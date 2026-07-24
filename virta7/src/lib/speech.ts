import { TextToSpeech, QueueStrategy } from '@capacitor-community/text-to-speech';
import type { LocaleCode } from '../i18n/locales';
import { loadJSON, saveJSON } from './storage';

export type VirtaCharacter = 'virtinho' | 'virtinha';

export const VOICE_PITCH: Record<VirtaCharacter, number> = {
  virtinho: 0.8,
  virtinha: 1.15,
};

const VOICE_MUTED_KEY = 'virtaVoiceMuted';

export function isVoiceMuted(): boolean {
  return loadJSON(VOICE_MUTED_KEY, false);
}

export function setVoiceMuted(muted: boolean): void {
  saveJSON(VOICE_MUTED_KEY, muted);
}

// BCP-47 tags for TTS voice matching (our locale codes are close, but a couple
// need a country suffix a voice is actually likely to exist for).
const SPEECH_LANG: Record<LocaleCode, string> = {
  'en-US': 'en-US',
  'en-GB': 'en-GB',
  'pt-PT': 'pt-PT',
  'pt-BR': 'pt-BR',
  es: 'es-ES',
  no: 'nb-NO',
  fr: 'fr-FR',
  it: 'it-IT',
  hu: 'hu-HU',
};

// Google's on-device TTS engine (the only engine on most Android installs)
// exposes several voice "families" per language as x-xxx codes, not labelled
// by gender. For en-US the male/female split below was confirmed on-device.
const ANDROID_MALE_HINTS = ['tpd', 'tpf', 'iob', 'iom'];
const ANDROID_FEMALE_HINTS = ['sfg', 'tpc', 'iog', 'iol'];

// Browsers (Web Speech API) expose a completely different voice list, keyed
// by human-readable names instead of codes (e.g. "Microsoft David - English",
// "Google UK English Female", "Samantha"). Match on those instead.
const WEB_MALE_NAME_HINTS = [
  'david', 'mark', 'guy', 'alex', 'daniel', 'fred', 'james', 'george', 'ryan', 'thomas',
  'diego', 'henri', 'paolo', 'matthew', 'justin', 'joey', 'brian', 'eric', 'russell', 'liam',
];
const WEB_FEMALE_NAME_HINTS = [
  'zira', 'samantha', 'karen', 'moira', 'tessa', 'fiona', 'susan', 'victoria', 'kate', 'emma',
  'linda', 'aria', 'jenny', 'salli', 'joanna', 'ivy', 'kimberly', 'amy', 'nicole', 'maria',
];

interface Voice {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

function familyOf(voiceURI: string): string {
  return voiceURI.replace(/-local$|-network$/, '');
}

function matchesAny(text: string, hints: string[]): boolean {
  return hints.some((hint) => text.includes(hint));
}

function pickVoiceIndex(allVoices: Voice[], matches: Voice[], character: VirtaCharacter): number | undefined {
  if (matches.length === 0) return undefined;

  const androidHints = character === 'virtinho' ? ANDROID_MALE_HINTS : ANDROID_FEMALE_HINTS;
  for (const hint of androidHints) {
    const found = matches.find((v) => v.voiceURI.includes(hint) && v.localService);
    if (found) return allVoices.indexOf(found);
  }
  for (const hint of androidHints) {
    const found = matches.find((v) => v.voiceURI.includes(hint));
    if (found) return allVoices.indexOf(found);
  }

  // Web Speech API voices: check the human-readable name for gender words or
  // known name hints (e.g. "Google UK English Male", "Microsoft Zira").
  const found = matches.find((v) => {
    const text = `${v.name} ${v.voiceURI}`.toLowerCase();
    if (character === 'virtinho') {
      return /\bmale\b/.test(text) || matchesAny(text, WEB_MALE_NAME_HINTS);
    }
    return /\bfemale\b/.test(text) || matchesAny(text, WEB_FEMALE_NAME_HINTS);
  });
  if (found) return allVoices.indexOf(found);

  // No gender info available at all: fall back to a deterministic split of
  // whatever distinct voices exist, so the two characters at least sound
  // like different people rather than the same voice at a different pitch.
  const families = Array.from(new Set(matches.map((v) => familyOf(v.voiceURI))));
  if (families.length < 2) return allVoices.indexOf(matches[0]);
  const family = character === 'virtinho' ? families[0] : families[families.length - 1];
  const familyMatch =
    matches.find((v) => familyOf(v.voiceURI) === family && v.localService) ??
    matches.find((v) => familyOf(v.voiceURI) === family);
  return familyMatch ? allVoices.indexOf(familyMatch) : allVoices.indexOf(matches[0]);
}

async function getVoicesWithRetry(): Promise<Voice[]> {
  // Chrome's Web Speech API loads voices asynchronously and can return an
  // empty list on the very first call after page load.
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await TextToSpeech.getSupportedVoices();
    if (res.voices.length > 0) return res.voices as Voice[];
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return [];
}

export async function speak(text: string, locale: LocaleCode, character: VirtaCharacter): Promise<void> {
  const langTag = SPEECH_LANG[locale] ?? 'en-US';
  const pitch = VOICE_PITCH[character];

  let voice: number | undefined;
  try {
    const allVoices = await getVoicesWithRetry();
    const matches = allVoices.filter((v) => v.lang === langTag);
    voice = pickVoiceIndex(allVoices, matches, character);
  } catch {
    voice = undefined;
  }

  const options =
    voice === undefined
      ? { text, lang: langTag, pitch, rate: 1, volume: 1, queueStrategy: QueueStrategy.Flush }
      : { text, lang: langTag, pitch, rate: 1, volume: 1, voice, queueStrategy: QueueStrategy.Flush };

  TextToSpeech.speak(options).catch(() => {
    // No TTS engine available on this device; fail silently.
  });
}

export function stopSpeaking(): void {
  TextToSpeech.stop().catch(() => {});
}
