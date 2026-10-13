/**
 * Savora Food Assistant — a deterministic, rule-based demo chatbot.
 * It does NOT use an AI model. It matches intents with keyword rules and answers
 * from the real menu dataset, restaurant info and demo orders saved in this browser.
 */
import { categories, getItemById, isVegetarian, menuItems } from '../data/menu';
import { promoCodes } from '../data/promos';
import { restaurant } from '../data/restaurant';
import type { CategoryId, FoodItem } from '../types';
import { config } from './config';
import { formatDateTime, formatPrice } from './format';
import { findOrder } from './order';

export interface ChatLink {
  label: string;
  to: string;
  external?: boolean;
}

export interface ChatContext {
  awaiting: 'none' | 'order-number' | 'add-confirm';
  pendingItemId?: string;
  lastResults?: string[];
  offset?: number;
}

export interface BotReply {
  text: string;
  itemIds?: string[];
  links?: ChatLink[];
  quickReplies?: string[];
  /** Set only after the user has explicitly confirmed. */
  addToCartItemId?: string;
  context: ChatContext;
}

export const INITIAL_CONTEXT: ChatContext = { awaiting: 'none' };

export const WELCOME_MESSAGE =
  'Hi! Hungry for something delicious? I can help you find your next favorite meal.';

export const DEFAULT_QUICK_REPLIES = [
  'Browse Menu',
  'Popular Dishes',
  'Vegetarian Options',
  'Track My Order',
  'Contact Restaurant',
];

const PAGE_SIZE = 3;

// ---- Text helpers ----------------------------------------------------------

const STOPWORDS = new Set(
  'a an the and or with for of to in on me my i you your some any what whats is are do does can could would like want please show find get have has there something food dish dishes item items menu im looking anything give need order add cart one'.split(
    ' ',
  ),
);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9$.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const has = (text: string, pattern: RegExp) => pattern.test(text);

const CATEGORY_KEYWORDS: Record<CategoryId, RegExp> = {
  burgers: /\bburgers?\b/,
  pizza: /\bpizzas?\b/,
  pasta: /\bpasta|spaghetti|penne|fettuccine|alfredo\b/,
  salads: /\bsalads?|bowls?|healthy|light\b/,
  asian: /\basian|ramen|thai|noodles?|wings?|korean|japanese\b/,
  desserts: /\bdesserts?|sweets?|cake|brownie|cheesecake|something sweet\b/,
  drinks: /\bdrinks?|beverages?|coffee|lemonade|smoothie|thirsty|juice\b/,
};

function detectCategory(text: string): CategoryId | undefined {
  return (Object.keys(CATEGORY_KEYWORDS) as CategoryId[]).find((id) => CATEGORY_KEYWORDS[id].test(text));
}

function detectBudget(text: string): number | undefined {
  const match =
    text.match(/(?:under|below|less than|cheaper than|max|maximum|up to|within|budget(?: of| is)?|no more than)\s*\$?\s*(\d+(?:\.\d+)?)/) ??
    text.match(/\$\s*(\d+(?:\.\d+)?)/) ??
    text.match(/(\d+(?:\.\d+)?)\s*(?:dollars|bucks|usd)/);
  return match?.[1] ? Number(match[1]) : undefined;
}

const VEG_PATTERN = /\b(veg|vegetarian|veggie|vegan|meat ?free|plant ?based|no meat)\b/;
const SPICY_PATTERN = /\b(spicy|hot|heat|fiery|chili)\b/;
const YES_PATTERN = /^(y|yes|yeah|yep|yup|sure|ok|okay|please|yes please|add it|yes add it|do it|go ahead|confirm|sounds good)\b/;
const NO_PATTERN = /^(n|no|nope|nah|no thanks|not now|cancel|never ?mind|skip)\b/;
const ORDER_NUMBER_PATTERN = /\bsav-?([a-z0-9]{6})\b/i;

/** Scores menu items against free text by name, description, ingredients and tags. */
export function searchMenu(query: string): FoodItem[] {
  const q = normalize(query);
  const tokens = q.split(' ').filter((t) => t.length > 2 && !STOPWORDS.has(t));
  if (!tokens.length) return [];

  const scored = menuItems.map((item) => {
    const name = item.name.toLowerCase();
    let score = q.includes(name) ? 20 : 0;
    for (const token of tokens) {
      const stem = token.replace(/(es|s)$/, '');
      // Whole-word match, or substring match for longer words ("burger" in "cheeseburger").
      const wordRe = new RegExp(`\\b${stem}(es|s)?\\b`);
      const matches = (s: string) => wordRe.test(s.toLowerCase()) || (stem.length >= 5 && s.toLowerCase().includes(stem));
      if (matches(item.name)) score += 6;
      if (matches(item.description)) score += 2;
      if (item.ingredients.some(matches)) score += 2;
      if (item.dietaryTags.some(matches)) score += 2;
    }
    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.item.popularity - a.item.popularity)
    .map((s) => s.item);
}

const GENERIC_NAME_WORDS = new Set(['pizza', 'burger', 'pasta', 'salad', 'bowl', 'classic', 'fresh', 'the']);

/** Returns a single item only when the text names it unambiguously (e.g. "add a pepperoni"). */
function matchItemByName(text: string): FoodItem | undefined {
  const exact = menuItems.find((i) => text.includes(i.name.toLowerCase()));
  if (exact) return exact;
  const words = new Set(text.split(' ').map((w) => w.replace(/s$/, '')));
  const matches = menuItems.filter((item) =>
    normalize(item.name)
      .split(' ')
      .some((w) => !GENERIC_NAME_WORDS.has(w) && w.length > 2 && words.has(w.replace(/s$/, ''))),
  );
  return matches.length === 1 ? matches[0] : undefined;
}

function describeItem(item: FoodItem): string {
  return `${item.name} (${formatPrice(item.price)})`;
}

function isOpenNow(date = new Date()): boolean {
  const slot = restaurant.schedule[date.getDay()];
  if (!slot) return false;
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= slot[0] && minutes < slot[1];
}

// ---- Reply builders --------------------------------------------------------

function listReply(
  intro: string,
  results: FoodItem[],
  ctx: ChatContext,
  options: { offerAdd?: boolean; emptyText?: string } = {},
): BotReply {
  const available = results.filter((i) => i.available);
  if (!available.length) {
    return {
      text: options.emptyText ?? 'I couldn’t find any dishes that match. Want to see our most popular picks instead?',
      quickReplies: ['Popular Dishes', 'Browse Menu'],
      context: { ...ctx, awaiting: 'none' },
    };
  }
  const page = available.slice(0, PAGE_SIZE);
  const top = page[0]!;
  const more = available.length > PAGE_SIZE;
  const offerAdd = options.offerAdd ?? true;

  return {
    text: offerAdd
      ? `${intro}\n\nMy top pick is the ${describeItem(top)}. Would you like me to add it to your cart?`
      : intro,
    itemIds: page.map((i) => i.id),
    quickReplies: offerAdd
      ? ['Yes, add it', ...(more ? ['Show more options'] : []), 'No thanks']
      : more
        ? ['Show more options', 'Browse Menu']
        : ['Browse Menu'],
    context: {
      awaiting: offerAdd ? 'add-confirm' : 'none',
      pendingItemId: offerAdd ? top.id : undefined,
      lastResults: available.map((i) => i.id),
      offset: PAGE_SIZE,
    },
  };
}

export function proposeAdd(itemId: string): BotReply {
  const item = getItemById(itemId);
  if (!item || !item.available) {
    return {
      text: item ? `Sorry, ${item.name} is sold out today.` : 'Sorry, I couldn’t find that dish.',
      quickReplies: ['Popular Dishes'],
      context: INITIAL_CONTEXT,
    };
  }
  const sizeNote = item.sizes && item.sizes.length > 1 ? ` in ${item.sizes[0]!.label}` : '';
  return {
    text: `Add 1 × ${item.name}${sizeNote} for ${formatPrice(item.price)} to your cart?`,
    quickReplies: ['Yes, add it', 'No thanks'],
    links: [{ label: 'Customize on dish page', to: `/menu/${item.slug}` }],
    context: { awaiting: 'add-confirm', pendingItemId: item.id },
  };
}

function orderLookupReply(orderNumber: string): BotReply {
  const order = findOrder(orderNumber);
  const liveNote =
    'Live order tracking isn’t available in this demo — there’s no kitchen or courier backend connected.';
  if (!order) {
    return {
      text: `I couldn’t find order ${orderNumber.toUpperCase()} on this device. Demo orders are only stored in the browser they were placed from.\n\n${liveNote} For help with a real order, please contact the restaurant.`,
      quickReplies: ['Contact Restaurant', 'Browse Menu'],
      context: INITIAL_CONTEXT,
    };
  }
  const [min, max] = order.estimatedMinutes;
  const method = order.customer.fulfillment === 'delivery' ? 'delivery' : 'pickup';
  return {
    text:
      `Found it! Order ${order.orderNumber} was placed ${formatDateTime(order.createdAt)} for ${method}: ` +
      `${order.totals.itemCount} item(s), total ${formatPrice(order.totals.total)}.\n\n` +
      `The estimated ${method} time was ${min}–${max} minutes from ordering (an estimate, not a live status).\n\n${liveNote}`,
    links: [{ label: 'View order summary', to: '/order-success' }],
    quickReplies: ['Contact Restaurant', 'Browse Menu'],
    context: INITIAL_CONTEXT,
  };
}

// ---- Main entry ------------------------------------------------------------

export function getBotReply(rawInput: string, ctx: ChatContext): BotReply {
  const text = normalize(rawInput);
  const base: ChatContext = { awaiting: 'none', lastResults: ctx.lastResults, offset: ctx.offset };

  if (!text) {
    return { text: 'Tell me what you’re craving and I’ll find something tasty.', quickReplies: DEFAULT_QUICK_REPLIES, context: ctx };
  }

  // 1) Pending add-to-cart confirmation — the ONLY path that adds to the cart.
  if (ctx.awaiting === 'add-confirm' && ctx.pendingItemId) {
    const item = getItemById(ctx.pendingItemId);
    if (YES_PATTERN.test(text) && item) {
      return {
        text: `Done! I’ve added 1 × ${item.name} to your cart. Anything else you’d like?`,
        addToCartItemId: item.id,
        links: [
          { label: 'View cart', to: '/cart' },
          { label: 'Checkout', to: '/checkout' },
        ],
        quickReplies: ['Popular Dishes', 'Something sweet', 'Drinks'],
        context: base,
      };
    }
    if (NO_PATTERN.test(text)) {
      return {
        text: 'No problem — nothing was added. What else can I help you find?',
        quickReplies: ctx.lastResults && (ctx.offset ?? 0) < ctx.lastResults.length
          ? ['Show more options', 'Browse Menu']
          : DEFAULT_QUICK_REPLIES,
        context: base,
      };
    }
  }

  // 2) Waiting for an order number.
  const orderMatch = rawInput.match(ORDER_NUMBER_PATTERN);
  if (orderMatch) return orderLookupReply(`SAV-${orderMatch[1]}`);
  if (ctx.awaiting === 'order-number') {
    if (NO_PATTERN.test(text)) {
      return { text: 'Okay! Let me know if there’s anything else I can do.', quickReplies: DEFAULT_QUICK_REPLIES, context: base };
    }
    const isSingleToken = /^[a-z0-9#-]{2,14}$/.test(text);
    const isKnownWord = /^(menu|hi|hello|hey|hours|thanks|delivery|contact|pizza|burgers?|drinks?|desserts?)$/.test(text);
    if ((isSingleToken && !isKnownWord) || /^(it(s| is)|my (order )?(number|no) is)\b/.test(text)) {
      return {
        text: 'Hmm, that doesn’t look like a Savora order number. They look like “SAV-AB12CD” and appear on your confirmation page. Could you double-check it?',
        quickReplies: ['Contact Restaurant', 'Cancel'],
        context: { ...base, awaiting: 'order-number' },
      };
    }
  }

  // 3) "Show more" for the previous list.
  if (/\b(show )?more( options)?\b|\bother options\b|\bsomething else\b/.test(text) && ctx.lastResults?.length) {
    const offset = ctx.offset ?? 0;
    const remaining = ctx.lastResults.slice(offset).map((id) => getItemById(id)).filter((i): i is FoodItem => !!i);
    if (remaining.length) {
      const reply = listReply('Here are a few more options:', remaining, ctx);
      return { ...reply, context: { ...reply.context, lastResults: ctx.lastResults, offset: offset + PAGE_SIZE } };
    }
    return {
      text: 'That’s everything that matched! You can see the full menu for even more choices.',
      links: [{ label: 'Open full menu', to: '/menu' }],
      quickReplies: DEFAULT_QUICK_REPLIES,
      context: base,
    };
  }

  // 4) Small talk.
  if (/^(hi|hello|hey|hiya|yo|good (morning|afternoon|evening)|greetings)\b/.test(text)) {
    return {
      text: 'Hello! 👋 What are you in the mood for today? I can suggest dishes by craving, budget or dietary needs.',
      quickReplies: DEFAULT_QUICK_REPLIES,
      context: base,
    };
  }
  if (/\b(thanks|thank you|thx|cheers|awesome|great|perfect)\b/.test(text) && text.split(' ').length <= 4) {
    return { text: 'You’re very welcome! Enjoy your meal. 🍽️', quickReplies: ['Browse Menu', 'Track My Order'], context: base };
  }
  if (/\b(are you (a )?(bot|ai|human|real)|who are you|what are you)\b/.test(text)) {
    return {
      text: 'I’m the Savora Food Assistant — a rule-based demo helper, not an AI model. I search our real menu and answer common questions about hours, delivery and contact details.',
      quickReplies: DEFAULT_QUICK_REPLIES,
      context: base,
    };
  }

  // 5) Order tracking.
  if (/\b(track|tracking|order status|where is my|wheres my|my order|status of)\b/.test(text)) {
    return {
      text: 'I can look up a demo order placed in this browser. What’s your order number? (It looks like SAV-AB12CD.)',
      quickReplies: ['Cancel'],
      context: { ...base, awaiting: 'order-number' },
    };
  }

  // 6) FAQs.
  if (/\b(hours?|open|opening|close|closing|closed|when are you)\b/.test(text)) {
    const status = isOpenNow() ? 'We’re open right now! 🟢' : 'We’re currently closed. 🔴';
    return {
      text: `${status}\n\nOur opening hours:\n${restaurant.hours.map((h) => `• ${h.days}: ${h.time}`).join('\n')}`,
      quickReplies: ['Delivery info', 'Browse Menu'],
      context: base,
    };
  }
  if (/\b(deliver|delivery|shipping|fee|radius|how long|pick ?up|takeaway|take away|collect)\b/.test(text)) {
    const [dMin, dMax] = restaurant.delivery.estimate;
    const [pMin, pMax] = restaurant.delivery.pickupEstimate;
    return {
      text:
        `We deliver within ${restaurant.delivery.radius} of the restaurant. Delivery is ${formatPrice(config.deliveryFee)}, ` +
        `and free on orders over ${formatPrice(config.freeDeliveryThreshold)}.\n\n` +
        `Estimated times: delivery ${dMin}–${dMax} min, pickup ${pMin}–${pMax} min. These are estimates and can vary at busy times.`,
      quickReplies: ['Popular Dishes', 'Opening hours'],
      context: base,
    };
  }
  if (/\b(contact|phone|call|email|e-mail|whatsapp|address|location|located|where are you|find you|directions|reach)\b/.test(text)) {
    return {
      text: `You can reach Savora here:\n• Phone: ${restaurant.phone}\n• Email: ${restaurant.email}\n• Address: ${restaurant.address.full}`,
      links: [
        { label: 'Chat on WhatsApp', to: restaurant.whatsappHref, external: true },
        { label: 'Contact page', to: '/contact' },
      ],
      quickReplies: ['Opening hours', 'Browse Menu'],
      context: base,
    };
  }
  if (/\b(pay|payment|card|cash|credit|paypal|stripe)\b/.test(text)) {
    return {
      text: config.onlinePaymentEnabled
        ? `At checkout you can choose Cash on Delivery or ${config.onlinePaymentLabel}. This is a demo — no real payment is processed.`
        : 'At checkout you can choose Cash on Delivery. Online payment can be enabled once a payment provider is connected. This is a demo — no real payment is processed.',
      quickReplies: ['Browse Menu'],
      context: base,
    };
  }
  if (/\b(promo|discount|coupon|voucher|deal|offer|code)\b/.test(text)) {
    return {
      text: `Here are the current demo promo codes:\n${promoCodes.map((p) => `• ${p.code} — ${p.description}`).join('\n')}\n\nApply them on the cart page.`,
      links: [{ label: 'Go to cart', to: '/cart' }],
      context: base,
    };
  }
  if (/\b(allerg|allergen|allergy|allergies|nut|nuts|peanut|dairy|lactose|gluten|celiac|coeliac)\b/.test(text)) {
    const wantsGlutenFree = /\b(gluten|celiac|coeliac)\b/.test(text);
    const intro =
      'Every dish page lists its allergens and ingredients. Our kitchen handles gluten, dairy, eggs, nuts, soy and sesame, so we can’t guarantee zero cross-contact — please tell staff about severe allergies.';
    if (wantsGlutenFree) {
      return listReply(
        `${intro}\n\nHere are dishes made without gluten-containing ingredients:`,
        menuItems.filter((i) => i.dietaryTags.includes('gluten-free')),
        base,
        { offerAdd: false },
      );
    }
    return { text: intro, quickReplies: ['Vegetarian Options', 'Contact Restaurant'], context: base };
  }

  // 7) Explicit "add X" requests -> confirmation first.
  if (/\b(add|i ?ll have|i will have|get me|i want|order)\b/.test(text)) {
    const match = matchItemByName(text);
    if (match) return proposeAdd(match.id);
  }

  // 8) Preference-based recommendations.
  const budget = detectBudget(text);
  const veg = VEG_PATTERN.test(text);
  const spicy = SPICY_PATTERN.test(text);
  const category = detectCategory(text);
  const wantsRecommendation = has(text, /\b(recommend|suggest|hungry|craving|what should|surprise|pick|choose|idea|in the mood)\b/);
  const wantsPopular = has(text, /\b(popular|best ?sell(er|ing)?|top|favou?rites?|signature|chef|special|best)\b/);

  // A specific dish named without other constraints — show it first, then its siblings.
  const named = matchItemByName(text);
  if (named && budget === undefined && !veg && !spicy) {
    const siblings = menuItems.filter((i) => i.category === named.category && i.id !== named.id);
    return listReply(`Great choice! Here’s our ${named.name}:`, [named, ...siblings], base);
  }

  if (budget !== undefined || veg || spicy || category || wantsRecommendation || wantsPopular) {
    let results = menuItems.filter((i) => i.available);
    const parts: string[] = [];
    if (category) {
      results = results.filter((i) => i.category === category);
      parts.push(categories.find((c) => c.id === category)!.name.toLowerCase());
    } else {
      parts.push('dishes');
    }
    if (veg) {
      results = results.filter(isVegetarian);
      parts.unshift('vegetarian');
    }
    if (spicy) {
      results = results.filter((i) => i.dietaryTags.includes('spicy'));
      parts.unshift('spicy');
    }
    if (budget !== undefined) {
      results = results.filter((i) => i.price <= budget);
      parts.push(`under ${formatPrice(budget)}`);
    }
    results.sort((a, b) =>
      wantsPopular ? b.popularity - a.popularity : b.rating * 20 + b.popularity - (a.rating * 20 + a.popularity),
    );

    const label = parts.join(' ');
    const intro = wantsPopular && label === 'dishes'
      ? 'These are our guests’ favorites right now:'
      : `Here are some delicious ${label} I’d recommend:`;

    // If nothing matches the budget, suggest the closest options.
    if (!results.length && budget !== undefined) {
      const cheapest = menuItems.filter((i) => i.available && (!veg || isVegetarian(i))).sort((a, b) => a.price - b.price);
      return listReply(
        `Nothing matched ${label} exactly, but here are our most affordable options:`,
        cheapest,
        base,
      );
    }
    return listReply(intro, results, base);
  }

  // 9) Browse the menu / categories.
  if (/\b(menu|categories|category|browse|what do you (have|serve|offer|sell)|options)\b/.test(text)) {
    return {
      text: `We serve ${menuItems.length} dishes across ${categories.length} categories:\n${categories
        .map((c) => `• ${c.name} — ${c.description}`)
        .join('\n')}\n\nTap a category below or ask me for something specific.`,
      links: [
        { label: 'Open full menu', to: '/menu' },
        ...categories.slice(0, 4).map((c) => ({ label: c.name, to: `/menu?category=${c.id}` })),
      ],
      quickReplies: ['Popular Dishes', 'Vegetarian Options', 'Something under $10'],
      context: base,
    };
  }

  // 10) Free-text dish search.
  const found = searchMenu(text);
  if (found.length) {
    return listReply(
      found.length === 1 ? 'I found this on our menu:' : `I found ${Math.min(found.length, PAGE_SIZE)} matching dishes:`,
      found,
      base,
    );
  }

  // 11) Fallback.
  return {
    text:
      'Sorry, I didn’t quite catch that. I’m a simple demo assistant — I can recommend dishes (try “vegetarian under $15” or “spicy pizza”), share opening hours and delivery info, or look up a demo order.',
    quickReplies: DEFAULT_QUICK_REPLIES,
    context: base,
  };
}
