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
// For every other language we don't have a confirmed per-voice gender, so we
// fall back to a deterministic split of whatever families exist, so the two
// characters at least use genuinely different voices, not just a pitch shift
// on the same one.
const MALE_HINTS = ['tpd', 'tpf', 'iob', 'iom'];
const FEMALE_HINTS = ['sfg', 'tpc', 'iog', 'iol'];

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

function pickVoiceIndex(allVoices: Voice[], matches: Voice[], character: VirtaCharacter): number | undefined {
  if (matches.length === 0) return undefined;

  const hints = character === 'virtinho' ? MALE_HINTS : FEMALE_HINTS;
  for (const hint of hints) {
    const found = matches.find((v) => v.voiceURI.includes(hint) && v.localService);
    if (found) return allVoices.indexOf(found);
  }
  for (const hint of hints) {
    const found = matches.find((v) => v.voiceURI.includes(hint));
    if (found) return allVoices.indexOf(found);
  }

  const families = Array.from(new Set(matches.map((v) => familyOf(v.voiceURI))));
  if (families.length < 2) return allVoices.indexOf(matches[0]);
  const family = character === 'virtinho' ? families[0] : families[families.length - 1];
  const found =
    matches.find((v) => familyOf(v.voiceURI) === family && v.localService) ??
    matches.find((v) => familyOf(v.voiceURI) === family);
  return found ? allVoices.indexOf(found) : allVoices.indexOf(matches[0]);
}

export async function speak(text: string, locale: LocaleCode, character: VirtaCharacter): Promise<void> {
  const langTag = SPEECH_LANG[locale] ?? 'en-US';
  const pitch = VOICE_PITCH[character];

  let voice: number | undefined;
  try {
    const res = await TextToSpeech.getSupportedVoices();
    const allVoices = res.voices as Voice[];
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
