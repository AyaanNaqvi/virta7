import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Volume2, VolumeX } from 'lucide-react';
import type { ChatMessage } from '../types';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage';
import { getVirtaReply } from '../lib/virtaChat';
import { apiFetch } from '../lib/api';
import { speak, stopSpeaking, isVoiceMuted, setVoiceMuted } from '../lib/speech';
import { useAuth } from '../contexts/AuthContext';
import { useReduceMotion } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';
import virtinha from '../assets/virtinha.jpg';
import virtinho from '../assets/virtinho.jpg';

type Character = 'virtinha' | 'virtinho';

const CHARACTERS: { id: Character; name: string; image: string }[] = [
  { id: 'virtinha', name: 'Virtinha', image: virtinha },
  { id: 'virtinho', name: 'Virtinho', image: virtinho },
];

function makeMessage(sender: ChatMessage['sender'], text: string): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sender,
    text,
    createdAt: new Date().toISOString(),
  };
}

function CharacterAvatar({ image, name, size = 36 }: { image: string; name: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10"
      style={{ height: size, width: size }}
    >
      <img src={image} alt={name} className="h-full w-full object-cover object-top" />
    </span>
  );
}

function CharacterPicker({ onPick }: { onPick: (character: Character) => void }) {
  const reduceMotion = useReduceMotion();
  const { t } = useLanguage();
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-6 text-center">
      <h1 className="mb-1 text-2xl font-bold text-text">{t('virtago_whoChat')}</h1>
      <p className="mb-8 text-text-muted">{t('virtago_pickFriend')}</p>
      <div className="grid w-full max-w-sm grid-cols-2 gap-4">
        {CHARACTERS.map((c) => (
          <motion.button
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            className="flex flex-col items-center gap-3 rounded-3xl border-2 border-border bg-surface p-4 active:bg-surface-alt"
          >
            <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary/10">
              <img src={c.image} alt="" aria-hidden="true" className="h-full w-full object-cover object-top" />
            </span>
            <span className="text-lg font-bold text-text">{c.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function VirtaGo() {
  const reduceMotion = useReduceMotion();
  const { user } = useAuth();
  const { t, locale } = useLanguage();
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [muted, setMuted] = useState<boolean>(() => isVoiceMuted());
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSpokenId = useRef<string | null>(null);

  const active = CHARACTERS.find((c) => c.id === character);
  const storageKey = character
    ? `${STORAGE_KEYS.virtaGoMessages}:${user?.id ?? 'anonymous'}:${character}`
    : null;

  useEffect(() => {
    if (!character) return;
    const key = `${STORAGE_KEYS.virtaGoMessages}:${user?.id ?? 'anonymous'}:${character}`;
    const stored = loadJSON<ChatMessage[]>(key, []);
    if (stored.length > 0) {
      setMessages(stored);
    } else {
      const name = CHARACTERS.find((c) => c.id === character)?.name ?? '';
      setMessages([makeMessage('virta', t('virtago_hiImName', { name }))]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  useEffect(() => {
    if (!storageKey) return;
    saveJSON(storageKey, messages);
  }, [storageKey, messages]);

  useEffect(() => {
    if (muted || !character) return;
    const last = messages[messages.length - 1];
    if (!last || last.sender !== 'virta' || last.id === lastSpokenId.current) return;
    lastSpokenId.current = last.id;
    speak(last.text, locale, character);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, muted, character, locale]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  function toggleMuted() {
    setMuted((m) => {
      const next = !m;
      setVoiceMuted(next);
      if (next) stopSpeaking();
      return next;
    });
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages, isTyping, reduceMotion]);

  async function handleSend() {
    const text = draft.trim();
    if (!text) return;
    const history = messages.slice(-10).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.text,
    }));
    setMessages((prev) => [...prev, makeMessage('user', text)]);
    setDraft('');
    setIsTyping(true);

    let reply: string;
    try {
      const data = await apiFetch<{ reply: string }>('/chat', {
        method: 'POST',
        body: { message: text, history, language: locale },
      });
      reply = data.reply;
    } catch {
      // Backend chat isn't configured or reachable — fall back to canned replies.
      reply = getVirtaReply(text);
    }

    const delay = reduceMotion ? 150 : 400;
    setTimeout(() => {
      setMessages((prev) => [...prev, makeMessage('virta', reply)]);
      setIsTyping(false);
    }, delay);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }

  if (!character || !active) {
    return <CharacterPicker onPick={setCharacter} />;
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <CharacterAvatar image={active.image} name={active.name} size={40} />
        <div className="flex-1">
          <h1 className="text-lg font-bold text-text">{active.name}</h1>
          <p className="text-sm text-text-muted">{t('virtago_talkWith', { name: active.name })}</p>
        </div>
        <button
          type="button"
          onClick={toggleMuted}
          aria-label={muted ? 'Unmute voice' : 'Mute voice'}
          aria-pressed={muted}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-text-muted"
        >
          {muted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                className={`flex items-end gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'virta' && <CharacterAvatar image={active.image} name={active.name} size={32} />}
                <div
                  className={`max-w-[75%] rounded-3xl px-4 py-3 text-base ${
                    m.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'border border-border bg-surface text-text'
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2"
            >
              <CharacterAvatar image={active.image} name={active.name} size={32} />
              <div className="rounded-3xl border border-border bg-surface px-4 py-3 text-text-muted">
                {t('virtago_typing', { name: active.name })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('virtago_placeholder')}
          aria-label="Message to Virta"
          className="min-h-11 flex-1 rounded-2xl border-2 border-border bg-surface px-4 text-text"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim()}
          aria-label="Send message"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl bg-primary text-white disabled:opacity-50"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
