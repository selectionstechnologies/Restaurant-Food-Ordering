import type { Category, CategoryId, FoodItem } from '../types';

/**
 * Single source of truth for all menu data. Menu cards, the details page, search,
 * the cart, checkout and the chatbot all read from here.
 *
 * Prices, ratings and reviews are sample demo content.
 */

/** Builds a consistently-cropped Unsplash URL. */
export function unsplash(id: string, width = 800, height = Math.round(width * 0.75)): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export const categories: Category[] = [
  {
    id: 'burgers',
    name: 'Burgers',
    description: 'Smashed, stacked & juicy',
    image: unsplash('1550547660-d9450f859349', 600, 600),
  },
  {
    id: 'pizza',
    name: 'Pizza',
    description: 'Stone-baked, blistered crust',
    image: unsplash('1513104890138-7c749659a591', 600, 600),
  },
  {
    id: 'pasta',
    name: 'Pasta',
    description: 'Fresh, silky & comforting',
    image: unsplash('1621996346565-e3dbc646d9a9', 600, 600),
  },
  {
    id: 'salads',
    name: 'Salads',
    description: 'Crisp, bright & seasonal',
    image: unsplash('1540420773420-3366772f4999', 600, 600),
  },
  {
    id: 'asian',
    name: 'Asian',
    description: 'Bold, fragrant & wok-fired',
    image: unsplash('1569718212165-3a8278d5f624', 600, 600),
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet endings, done right',
    image: unsplash('1606313564200-e75d5e30476c', 600, 600),
  },
  {
    id: 'drinks',
    name: 'Drinks',
    description: 'Fresh-squeezed & ice-cold',
    image: unsplash('1461023058943-07fcbe16d735', 600, 600),
  },
];

const burgerAddOns = [
  { id: 'extra-patty', name: 'Extra beef patty', price: 3.5 },
  { id: 'bacon', name: 'Smoked bacon', price: 2 },
  { id: 'avocado', name: 'Sliced avocado', price: 1.75 },
  { id: 'fries', name: 'Side of fries', price: 3.25 },
];

const pizzaSizes = [
  { id: 'small', label: 'Small 10"', priceDelta: 0 },
  { id: 'medium', label: 'Medium 12"', priceDelta: 3 },
  { id: 'large', label: 'Large 14"', priceDelta: 6 },
];

const pizzaAddOns = [
  { id: 'extra-cheese', name: 'Extra mozzarella', price: 1.5 },
  { id: 'mushrooms', name: 'Roasted mushrooms', price: 1.25 },
  { id: 'chili-oil', name: 'Calabrian chili oil', price: 0.75 },
];

const drinkSizes = [
  { id: 'regular', label: 'Regular 12oz', priceDelta: 0 },
  { id: 'large', label: 'Large 16oz', priceDelta: 1 },
];

export const menuItems: FoodItem[] = [
  {
    id: 'classic-cheeseburger',
    name: 'Classic Cheeseburger',
    slug: 'classic-cheeseburger',
    description: 'Prime beef patty, aged cheddar, pickles and our house sauce on a toasted brioche bun.',
    longDescription:
      'Our signature burger starts with a 6oz patty of freshly ground chuck and brisket, seared on a cast-iron flat top and finished with melted aged cheddar. Crisp lettuce, ripe tomato, dill pickles and Savora house sauce come together on a butter-toasted brioche bun.',
    price: 12.99,
    category: 'burgers',
    image: unsplash('1568901346375-23c9450c58cd'),
    gallery: [
      unsplash('1568901346375-23c9450c58cd', 1200, 900),
      unsplash('1550547660-d9450f859349', 1200, 900),
      unsplash('1553979459-d2229ba7433b', 1200, 900),
    ],
    ingredients: ['Beef patty', 'Aged cheddar', 'Brioche bun', 'Lettuce', 'Tomato', 'Pickles', 'House sauce'],
    dietaryTags: [],
    allergens: ['gluten', 'dairy', 'eggs'],
    available: true,
    featured: true,
    bestseller: true,
    rating: 4.8,
    reviewCount: 412,
    popularity: 98,
    calories: 780,
    addOns: burgerAddOns,
  },
  {
    id: 'double-smash-burger',
    name: 'Double Smash Burger',
    slug: 'double-smash-burger',
    description: 'Two crispy-edged smashed patties, American cheese, caramelized onions and smoky mayo.',
    longDescription:
      'Two thin patties pressed hard onto a screaming-hot griddle for maximum crust, layered with double American cheese, slow-caramelized onions and chipotle-smoked mayo. Messy in the best possible way.',
    price: 15.49,
    category: 'burgers',
    image: unsplash('1553979459-d2229ba7433b'),
    gallery: [
      unsplash('1553979459-d2229ba7433b', 1200, 900),
      unsplash('1568901346375-23c9450c58cd', 1200, 900),
      unsplash('1550547660-d9450f859349', 1200, 900),
    ],
    ingredients: ['Two beef patties', 'American cheese', 'Caramelized onions', 'Chipotle mayo', 'Potato bun'],
    dietaryTags: ['spicy'],
    allergens: ['gluten', 'dairy', 'eggs'],
    available: true,
    featured: true,
    chefSpecial: true,
    rating: 4.9,
    reviewCount: 356,
    popularity: 95,
    calories: 980,
    addOns: burgerAddOns,
  },
  {
    id: 'garden-veggie-burger',
    name: 'Garden Veggie Burger',
    slug: 'garden-veggie-burger',
    description: 'Charred black-bean & beet patty, smashed avocado, pickled red onion and herb aioli.',
    longDescription:
      'A hearty house-made patty of black beans, roasted beetroot and brown rice, grilled until crisp and topped with smashed avocado, quick-pickled red onion, rocket and a bright herb aioli.',
    price: 11.99,
    category: 'burgers',
    image: unsplash('1520072959219-c595dc870360'),
    gallery: [
      unsplash('1520072959219-c595dc870360', 1200, 900),
      unsplash('1525059696034-4967a8e1dca2', 1200, 900),
    ],
    ingredients: ['Black bean & beet patty', 'Avocado', 'Pickled red onion', 'Rocket', 'Herb aioli', 'Whole-wheat bun'],
    dietaryTags: ['vegetarian'],
    allergens: ['gluten', 'eggs'],
    available: true,
    featured: false,
    rating: 4.6,
    reviewCount: 148,
    popularity: 72,
    calories: 610,
    addOns: burgerAddOns.filter((a) => a.id !== 'extra-patty' && a.id !== 'bacon'),
  },
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    slug: 'margherita-pizza',
    description: 'San Marzano tomato, fior di latte, fresh basil and extra-virgin olive oil.',
    longDescription:
      'The pizza that started it all. Our 48-hour fermented dough is stretched by hand, topped with crushed San Marzano tomatoes and torn fior di latte, then blistered in a 450°C stone oven and finished with basil and olive oil.',
    price: 13.5,
    category: 'pizza',
    image: unsplash('1574071318508-1cdbab80d002'),
    gallery: [
      unsplash('1574071318508-1cdbab80d002', 1200, 900),
      unsplash('1513104890138-7c749659a591', 1200, 900),
    ],
    ingredients: ['48-hour dough', 'San Marzano tomato', 'Fior di latte', 'Fresh basil', 'Olive oil'],
    dietaryTags: ['vegetarian'],
    allergens: ['gluten', 'dairy'],
    available: true,
    featured: true,
    bestseller: true,
    rating: 4.7,
    reviewCount: 389,
    popularity: 93,
    calories: 820,
    sizes: pizzaSizes,
    addOns: pizzaAddOns,
  },
  {
    id: 'pepperoni-pizza',
    name: 'Pepperoni Pizza',
    slug: 'pepperoni-pizza',
    description: 'Cup-and-char pepperoni, mozzarella, tomato sauce and a drizzle of hot honey.',
    longDescription:
      'Crispy, curling cups of spicy pepperoni over a blanket of mozzarella and our slow-cooked tomato sauce, finished with a drizzle of chili-infused hot honey for sweet heat.',
    price: 15.5,
    category: 'pizza',
    image: unsplash('1628840042765-356cda07504e'),
    gallery: [
      unsplash('1628840042765-356cda07504e', 1200, 900),
      unsplash('1513104890138-7c749659a591', 1200, 900),
    ],
    ingredients: ['48-hour dough', 'Tomato sauce', 'Mozzarella', 'Pepperoni', 'Hot honey'],
    dietaryTags: ['spicy'],
    allergens: ['gluten', 'dairy'],
    available: true,
    featured: true,
    bestseller: true,
    rating: 4.8,
    reviewCount: 441,
    popularity: 97,
    calories: 940,
    sizes: pizzaSizes,
    addOns: pizzaAddOns,
  },
  {
    id: 'creamy-alfredo-pasta',
    name: 'Creamy Alfredo Pasta',
    slug: 'creamy-alfredo-pasta',
    description: 'Fresh fettuccine tossed in a silky parmesan cream sauce with cracked black pepper.',
    longDescription:
      'Ribbons of fresh egg fettuccine tossed in a velvety sauce of butter, cream and 24-month Parmigiano Reggiano, finished with cracked black pepper and a little lemon zest to keep it bright.',
    price: 14.25,
    category: 'pasta',
    image: unsplash('1645112411341-6c4fd023714a'),
    gallery: [
      unsplash('1645112411341-6c4fd023714a', 1200, 900),
      unsplash('1621996346565-e3dbc646d9a9', 1200, 900),
    ],
    ingredients: ['Fresh fettuccine', 'Parmigiano Reggiano', 'Butter', 'Cream', 'Black pepper', 'Lemon zest'],
    dietaryTags: ['vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs'],
    available: true,
    featured: false,
    chefSpecial: true,
    rating: 4.6,
    reviewCount: 203,
    popularity: 81,
    calories: 890,
    addOns: [
      { id: 'grilled-chicken', name: 'Grilled chicken', price: 3.5 },
      { id: 'shrimp', name: 'Garlic shrimp', price: 4.5 },
      { id: 'truffle', name: 'Truffle oil', price: 2 },
    ],
  },
  {
    id: 'spicy-arrabbiata',
    name: 'Spicy Arrabbiata',
    slug: 'spicy-arrabbiata',
    description: 'Penne in a fiery tomato, garlic and chili sauce with parsley and pecorino.',
    longDescription:
      'Al dente penne in an "angry" sauce of slow-simmered tomatoes, plenty of garlic and dried Calabrian chili. Finished with flat-leaf parsley and shaved pecorino.',
    price: 12.75,
    category: 'pasta',
    image: unsplash('1621996346565-e3dbc646d9a9'),
    gallery: [
      unsplash('1621996346565-e3dbc646d9a9', 1200, 900),
      unsplash('1645112411341-6c4fd023714a', 1200, 900),
    ],
    ingredients: ['Penne', 'Tomato', 'Garlic', 'Calabrian chili', 'Parsley', 'Pecorino'],
    dietaryTags: ['vegetarian', 'spicy'],
    allergens: ['gluten', 'dairy'],
    available: true,
    featured: false,
    rating: 4.5,
    reviewCount: 118,
    popularity: 66,
    calories: 640,
  },
  {
    id: 'grilled-chicken-bowl',
    name: 'Grilled Chicken Bowl',
    slug: 'grilled-chicken-bowl',
    description: 'Herb-marinated chicken, quinoa, roasted veg, avocado and lemon-tahini dressing.',
    longDescription:
      'Free-range chicken thigh marinated in garlic, lemon and oregano, chargrilled and sliced over fluffy quinoa with roasted sweet potato, cherry tomatoes, cucumber, avocado and a creamy lemon-tahini dressing.',
    price: 13.95,
    category: 'salads',
    image: unsplash('1546069901-ba9599a7e63c'),
    gallery: [
      unsplash('1546069901-ba9599a7e63c', 1200, 900),
      unsplash('1512621776951-a57141f2eefd', 1200, 900),
    ],
    ingredients: ['Grilled chicken', 'Quinoa', 'Sweet potato', 'Cherry tomatoes', 'Cucumber', 'Avocado', 'Lemon-tahini'],
    dietaryTags: ['gluten-free', 'dairy-free'],
    allergens: ['sesame'],
    available: true,
    featured: true,
    bestseller: true,
    rating: 4.7,
    reviewCount: 267,
    popularity: 88,
    calories: 620,
    addOns: [
      { id: 'extra-chicken', name: 'Extra chicken', price: 3.5 },
      { id: 'soft-egg', name: 'Jammy soft egg', price: 1.25 },
    ],
  },
  {
    id: 'fresh-garden-salad',
    name: 'Fresh Garden Salad',
    slug: 'fresh-garden-salad',
    description: 'Crisp greens, heirloom tomatoes, cucumber, radish and seeds with citrus vinaigrette.',
    longDescription:
      'A crunchy, colorful bowl of mixed leaves, heirloom tomatoes, shaved cucumber, radish, toasted pumpkin seeds and pickled shallots, tossed with a zesty orange-champagne vinaigrette.',
    price: 9.75,
    category: 'salads',
    image: unsplash('1540420773420-3366772f4999'),
    gallery: [
      unsplash('1540420773420-3366772f4999', 1200, 900),
      unsplash('1512621776951-a57141f2eefd', 1200, 900),
    ],
    ingredients: ['Mixed greens', 'Heirloom tomatoes', 'Cucumber', 'Radish', 'Pumpkin seeds', 'Citrus vinaigrette'],
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    allergens: [],
    available: true,
    featured: false,
    rating: 4.5,
    reviewCount: 96,
    popularity: 58,
    calories: 290,
    addOns: [
      { id: 'feta', name: 'Crumbled feta', price: 1.5 },
      { id: 'add-chicken', name: 'Grilled chicken', price: 3.5 },
      { id: 'add-avocado', name: 'Avocado', price: 1.75 },
    ],
  },
  {
    id: 'crispy-chicken-wings',
    name: 'Crispy Chicken Wings',
    slug: 'crispy-chicken-wings',
    description: 'Double-fried wings tossed in Korean gochujang glaze with sesame and scallions.',
    longDescription:
      'Brined overnight and double-fried for shatteringly crisp skin, our wings are tossed in a sticky, sweet-and-spicy gochujang glaze and showered with toasted sesame and scallions.',
    price: 11.5,
    category: 'asian',
    image: unsplash('1567620832903-9fc6debc209f'),
    gallery: [
      unsplash('1567620832903-9fc6debc209f', 1200, 900),
      unsplash('1608039755401-742074f0548d', 1200, 900),
    ],
    ingredients: ['Chicken wings', 'Gochujang', 'Honey', 'Garlic', 'Sesame seeds', 'Scallions'],
    dietaryTags: ['spicy', 'dairy-free'],
    allergens: ['soy', 'sesame', 'gluten'],
    available: true,
    featured: true,
    chefSpecial: true,
    rating: 4.8,
    reviewCount: 318,
    popularity: 91,
    calories: 720,
    sizes: [
      { id: '6pc', label: '6 pieces', priceDelta: 0 },
      { id: '12pc', label: '12 pieces', priceDelta: 9 },
    ],
  },
  {
    id: 'tonkotsu-ramen',
    name: 'Tonkotsu Ramen',
    slug: 'tonkotsu-ramen',
    description: 'Rich 18-hour pork broth, chashu, soft egg, bamboo shoots and springy noodles.',
    longDescription:
      'A deeply savory, creamy pork bone broth simmered for 18 hours, ladled over springy wheat noodles and crowned with torched chashu pork, a marinated soft egg, bamboo shoots, nori and scallions.',
    price: 14.95,
    category: 'asian',
    image: unsplash('1569718212165-3a8278d5f624'),
    gallery: [
      unsplash('1569718212165-3a8278d5f624', 1200, 900),
      unsplash('1557872943-16a5ac26437e', 1200, 900),
    ],
    ingredients: ['Pork broth', 'Ramen noodles', 'Chashu pork', 'Soft egg', 'Bamboo shoots', 'Nori', 'Scallions'],
    dietaryTags: [],
    allergens: ['gluten', 'eggs', 'soy', 'sesame'],
    available: true,
    featured: false,
    rating: 4.7,
    reviewCount: 174,
    popularity: 79,
    calories: 860,
    addOns: [
      { id: 'extra-egg', name: 'Extra soft egg', price: 1.25 },
      { id: 'extra-chashu', name: 'Extra chashu', price: 3 },
      { id: 'chili-crisp', name: 'Chili crisp', price: 0.75 },
    ],
  },
  {
    id: 'veggie-pad-thai',
    name: 'Veggie Pad Thai',
    slug: 'veggie-pad-thai',
    description: 'Wok-tossed rice noodles, tofu, bean sprouts, peanuts and tamarind sauce.',
    longDescription:
      'Rice noodles wok-tossed over high heat with crispy tofu, egg, bean sprouts and garlic chives in a tangy tamarind-palm sugar sauce. Finished with crushed peanuts and a wedge of lime.',
    price: 12.5,
    category: 'asian',
    image: unsplash('1559314809-0d155014e29e'),
    gallery: [
      unsplash('1559314809-0d155014e29e', 1200, 900),
      unsplash('1569718212165-3a8278d5f624', 1200, 900),
    ],
    ingredients: ['Rice noodles', 'Tofu', 'Egg', 'Bean sprouts', 'Garlic chives', 'Tamarind', 'Peanuts', 'Lime'],
    dietaryTags: ['vegetarian', 'gluten-free'],
    allergens: ['nuts', 'soy', 'eggs'],
    available: true,
    featured: false,
    rating: 4.6,
    reviewCount: 131,
    popularity: 70,
    calories: 680,
  },
  {
    id: 'chocolate-brownie',
    name: 'Chocolate Brownie',
    slug: 'chocolate-brownie',
    description: 'Warm, fudgy dark-chocolate brownie with sea salt and vanilla bean ice cream.',
    longDescription:
      'Made with 70% dark chocolate and brown butter for a crackly top and molten, fudgy center. Served warm with a scoop of vanilla bean ice cream and a pinch of flaky sea salt.',
    price: 7.5,
    category: 'desserts',
    image: unsplash('1606313564200-e75d5e30476c'),
    gallery: [
      unsplash('1606313564200-e75d5e30476c', 1200, 900),
      unsplash('1564355808539-22fda35bed7e', 1200, 900),
    ],
    ingredients: ['Dark chocolate', 'Brown butter', 'Eggs', 'Flour', 'Sea salt', 'Vanilla ice cream'],
    dietaryTags: ['vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs'],
    available: true,
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 287,
    popularity: 90,
    calories: 540,
  },
  {
    id: 'new-york-cheesecake',
    name: 'New York Cheesecake',
    slug: 'new-york-cheesecake',
    description: 'Dense, creamy baked cheesecake on a graham crust with seasonal berry compote.',
    longDescription:
      'A classic New York-style cheesecake — tall, dense and impossibly creamy — on a buttery graham cracker crust, served with a bright compote of seasonal berries.',
    price: 8.25,
    category: 'desserts',
    image: unsplash('1533134242443-d4fd215305ad'),
    gallery: [
      unsplash('1533134242443-d4fd215305ad', 1200, 900),
      unsplash('1567327613485-fbc7bf196198', 1200, 900),
    ],
    ingredients: ['Cream cheese', 'Graham crust', 'Eggs', 'Vanilla', 'Berry compote'],
    dietaryTags: ['vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs'],
    available: true,
    featured: false,
    chefSpecial: true,
    rating: 4.8,
    reviewCount: 192,
    popularity: 76,
    calories: 510,
  },
  {
    id: 'tiramisu',
    name: 'Classic Tiramisu',
    slug: 'tiramisu',
    description: 'Espresso-soaked ladyfingers layered with mascarpone cream and cocoa.',
    longDescription:
      'Savoiardi biscuits soaked in fresh espresso and a splash of marsala, layered with light whipped mascarpone and dusted generously with dark cocoa.',
    price: 7.95,
    category: 'desserts',
    image: unsplash('1571877227200-a0d98ea607e9'),
    gallery: [unsplash('1571877227200-a0d98ea607e9', 1200, 900)],
    ingredients: ['Ladyfingers', 'Espresso', 'Mascarpone', 'Eggs', 'Cocoa'],
    dietaryTags: ['vegetarian'],
    allergens: ['gluten', 'dairy', 'eggs'],
    available: false,
    featured: false,
    rating: 4.7,
    reviewCount: 88,
    popularity: 55,
    calories: 450,
  },
  {
    id: 'fresh-lemonade',
    name: 'Fresh Lemonade',
    slug: 'fresh-lemonade',
    description: 'Hand-squeezed lemons, a touch of cane sugar and fresh mint over crushed ice.',
    longDescription:
      'Squeezed to order from sun-ripened lemons, lightly sweetened with raw cane sugar and muddled with fresh mint. Bright, tart and endlessly refreshing.',
    price: 4.25,
    category: 'drinks',
    image: unsplash('1621263764928-df1444c5e859'),
    gallery: [
      unsplash('1621263764928-df1444c5e859', 1200, 900),
      unsplash('1523677011781-c91d1bbe2f9e', 1200, 900),
    ],
    ingredients: ['Fresh lemons', 'Cane sugar', 'Mint', 'Filtered water', 'Ice'],
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    allergens: [],
    available: true,
    featured: false,
    rating: 4.6,
    reviewCount: 154,
    popularity: 68,
    calories: 120,
    sizes: drinkSizes,
  },
  {
    id: 'iced-coffee',
    name: 'Iced Coffee',
    slug: 'iced-coffee',
    description: 'Slow-steeped cold brew over ice with your choice of milk and vanilla syrup.',
    longDescription:
      'Single-origin beans cold-steeped for 16 hours for a smooth, chocolatey brew with low acidity, poured over ice and finished with your choice of milk.',
    price: 4.75,
    category: 'drinks',
    image: unsplash('1461023058943-07fcbe16d735'),
    gallery: [
      unsplash('1461023058943-07fcbe16d735', 1200, 900),
      unsplash('1517701604599-bb29b565090c', 1200, 900),
    ],
    ingredients: ['Cold brew coffee', 'Milk', 'Vanilla syrup', 'Ice'],
    dietaryTags: ['vegetarian', 'gluten-free'],
    allergens: ['dairy'],
    available: true,
    featured: false,
    rating: 4.5,
    reviewCount: 121,
    popularity: 63,
    calories: 140,
    sizes: drinkSizes,
    addOns: [
      { id: 'oat-milk', name: 'Swap to oat milk', price: 0.6 },
      { id: 'extra-shot', name: 'Extra espresso shot', price: 1 },
    ],
  },
  {
    id: 'mango-smoothie',
    name: 'Mango Passion Smoothie',
    slug: 'mango-passion-smoothie',
    description: 'Ripe mango, passion fruit, banana and coconut water blended until velvety.',
    longDescription:
      'A tropical blend of Alphonso mango, tangy passion fruit, banana and coconut water. No added sugar — just fruit, blended thick and velvety.',
    price: 5.5,
    category: 'drinks',
    image: unsplash('1623065422902-30a2d299bbe4'),
    gallery: [unsplash('1623065422902-30a2d299bbe4', 1200, 900)],
    ingredients: ['Mango', 'Passion fruit', 'Banana', 'Coconut water'],
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    allergens: [],
    available: true,
    featured: false,
    rating: 4.4,
    reviewCount: 74,
    popularity: 50,
    calories: 210,
    sizes: drinkSizes,
  },
];

// ---- Lookup helpers --------------------------------------------------------

const byId = new Map(menuItems.map((item) => [item.id, item]));
const bySlug = new Map(menuItems.map((item) => [item.slug, item]));

export function getItemById(id: string): FoodItem | undefined {
  return byId.get(id);
}

export function getItemBySlug(slug: string): FoodItem | undefined {
  return bySlug.get(slug);
}

export function getCategory(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function isVegetarian(item: FoodItem): boolean {
  return item.dietaryTags.includes('vegetarian') || item.dietaryTags.includes('vegan');
}

export const MENU_MAX_PRICE = Math.ceil(Math.max(...menuItems.map((i) => i.price)));

export function getRelatedItems(item: FoodItem, count = 4): FoodItem[] {
  const sameCategory = menuItems.filter((i) => i.category === item.category && i.id !== item.id);
  const others = menuItems
    .filter((i) => i.category !== item.category && i.id !== item.id && i.featured)
    .sort((a, b) => b.popularity - a.popularity);
  return [...sameCategory, ...others].filter((i) => i.available).slice(0, count);
}
