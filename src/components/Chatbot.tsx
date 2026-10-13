import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChefHat, ExternalLink, MessageCircle, Minus, Plus, Send, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getItemById } from '../data/menu';
import {
  DEFAULT_QUICK_REPLIES,
  getBotReply,
  INITIAL_CONTEXT,
  proposeAdd,
  WELCOME_MESSAGE,
  type BotReply,
  type ChatContext,
  type ChatLink,
} from '../utils/chatbot';
import { cn, formatPrice, formatTime } from '../utils/format';
import { SmartImage } from './SmartImage';

interface ChatMessage {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: Date;
  itemIds?: string[];
  links?: ChatLink[];
  quickReplies?: string[];
}

let messageId = 0;
const makeMessage = (m: Omit<ChatMessage, 'id' | 'time'>): ChatMessage => ({ ...m, id: ++messageId, time: new Date() });

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    makeMessage({ from: 'bot', text: WELCOME_MESSAGE, quickReplies: DEFAULT_QUICK_REPLIES }),
  ]);
  const [context, setContext] = useState<ChatContext>(INITIAL_CONTEXT);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>();
  const reduceMotion = useReducedMotion();
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages, typing, reduceMotion]);

  useEffect(() => {
    if (open && !minimized) {
      setUnread(0);
      inputRef.current?.focus();
    }
  }, [open, minimized]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const deliver = useCallback(
    (reply: BotReply) => {
      setTyping(true);
      window.clearTimeout(timerRef.current);
      const delay = reduceMotion ? 150 : 550 + Math.min(reply.text.length * 4, 700);
      timerRef.current = window.setTimeout(() => {
        setTyping(false);
        setContext(reply.context);
        if (reply.addToCartItemId) {
          const ok = addItem({ itemId: reply.addToCartItemId });
          const item = getItemById(reply.addToCartItemId);
          if (ok && item) showToast({ variant: 'success', title: 'Added to your cart', description: `1 × ${item.name}` });
        }
        setMessages((m) => [
          ...m,
          makeMessage({
            from: 'bot',
            text: reply.text,
            itemIds: reply.itemIds,
            links: reply.links,
            quickReplies: reply.quickReplies,
          }),
        ]);
        setUnread((n) => n + 1);
      }, delay);
    },
    [addItem, showToast, reduceMotion],
  );

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((m) => [...m, makeMessage({ from: 'user', text: trimmed })]);
    setInput('');
    deliver(getBotReply(trimmed, context));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const askToAdd = (itemId: string) => {
    if (typing) return;
    const item = getItemById(itemId);
    if (!item) return;
    setMessages((m) => [...m, makeMessage({ from: 'user', text: `Add ${item.name}` })]);
    deliver(proposeAdd(itemId));
  };

  /** On small screens the chat covers the page — minimize it after following a link. */
  const onLinkFollow = () => {
    if (window.matchMedia('(max-width: 639px)').matches) setMinimized(true);
  };

  const lastBotIndex = messages.map((m) => m.from).lastIndexOf('bot');

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setOpen(true);
              setMinimized(false);
            }}
            className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-tomato text-cream shadow-lift sm:bottom-6 sm:right-6"
            aria-label="Open Savora Food Assistant chat"
          >
            <MessageCircle className="h-7 w-7" aria-hidden="true" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-charcoal px-1 text-[11px] font-bold">
                {unread}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Window */}
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Savora Food Assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{ transformOrigin: 'bottom right' }}
            className={cn(
              'fixed z-50 flex flex-col overflow-hidden bg-cream shadow-lift ring-1 ring-charcoal/10',
              minimized
                ? 'bottom-5 right-5 w-[calc(100vw-2.5rem)] rounded-3xl sm:bottom-6 sm:right-6 sm:w-80'
                : 'inset-x-2 bottom-2 top-16 rounded-3xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(640px,calc(100vh-6rem))] sm:w-[400px]',
            )}
          >
            {/* Header */}
            <header className="flex items-center gap-3 bg-charcoal px-4 py-3.5 text-cream">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tomato">
                <ChefHat className="h-5 w-5" aria-hidden="true" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-olive-400 ring-2 ring-charcoal" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-base font-bold">Savora Food Assistant</h2>
                <p className="truncate text-xs text-cream/60">Rule-based demo assistant</p>
              </div>
              <button
                type="button"
                onClick={() => setMinimized((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/10"
                aria-label={minimized ? 'Expand chat' : 'Minimize chat'}
                aria-expanded={!minimized}
              >
                {minimized ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {!minimized && (
              <>
                <div
                  ref={listRef}
                  className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
                  role="log"
                  aria-live="polite"
                  aria-label="Chat messages"
                >
                  {messages.map((msg, index) => (
                    <div key={msg.id} className={cn('flex flex-col', msg.from === 'user' ? 'items-end' : 'items-start')}>
                      <div
                        className={cn(
                          'max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                          msg.from === 'user'
                            ? 'rounded-br-md bg-tomato text-cream'
                            : 'rounded-bl-md bg-white text-charcoal shadow-soft',
                        )}
                      >
                        <span className="sr-only">{msg.from === 'user' ? 'You said: ' : 'Assistant said: '}</span>
                        {msg.text}
                      </div>

                      {msg.itemIds && msg.itemIds.length > 0 && (
                        <ul className="mt-2 w-[85%] space-y-2">
                          {msg.itemIds.map((id) => {
                            const item = getItemById(id);
                            if (!item) return null;
                            return (
                              <li key={id} className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-soft">
                                <SmartImage src={item.image} alt={item.name} wrapperClassName="h-14 w-14 shrink-0 rounded-xl" />
                                <div className="min-w-0 flex-1">
                                  <Link
                                    to={`/menu/${item.slug}`}
                                    onClick={onLinkFollow}
                                    className="block truncate text-sm font-semibold hover:text-tomato"
                                  >
                                    {item.name}
                                  </Link>
                                  <p className="text-xs text-charcoal-500">{formatPrice(item.price)}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => askToAdd(item.id)}
                                  disabled={typing}
                                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-charcoal text-cream transition hover:bg-tomato disabled:opacity-50"
                                  aria-label={`Ask to add ${item.name} to cart`}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {msg.links && msg.links.length > 0 && (
                        <div className="mt-2 flex max-w-[85%] flex-wrap gap-2">
                          {msg.links.map((link) =>
                            link.external ? (
                              <a
                                key={link.to}
                                href={link.to}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-full border border-olive/30 bg-olive-50 px-3 py-1.5 text-xs font-semibold text-olive-800 transition hover:bg-olive-100"
                              >
                                {link.label} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                              </a>
                            ) : (
                              <Link
                                key={link.to}
                                to={link.to}
                                onClick={onLinkFollow}
                                className="rounded-full border border-olive/30 bg-olive-50 px-3 py-1.5 text-xs font-semibold text-olive-800 transition hover:bg-olive-100"
                              >
                                {link.label}
                              </Link>
                            ),
                          )}
                        </div>
                      )}

                      <time className="mt-1 px-1 text-[11px] text-charcoal-400" dateTime={msg.time.toISOString()}>
                        {formatTime(msg.time)}
                      </time>

                      {index === lastBotIndex && !typing && msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2" aria-label="Suggested replies">
                          {msg.quickReplies.map((q) => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => send(q)}
                              className="rounded-full border border-tomato/40 bg-white px-3 py-1.5 text-xs font-semibold text-tomato-700 transition hover:bg-tomato hover:text-cream"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {typing && (
                    <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-soft" aria-label="Assistant is typing">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-charcoal-400"
                          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-charcoal/10 bg-white p-3">
                  <label htmlFor="chat-input" className="sr-only">
                    Type your message
                  </label>
                  <input
                    id="chat-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about dishes, hours, delivery…"
                    maxLength={300}
                    autoComplete="off"
                    className="flex-1 rounded-full bg-cream px-4 py-3 text-sm placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-tomato/30"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-tomato text-cream transition hover:bg-tomato-600 disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
