import { TextToSpeech, QueueStrategy } from '@capacitor-community/text-to-speech';
import type { LocaleCode } from '../i18n/locales';
import { loadJSON, saveJSON } from './storage';

export type VirtaCharacter = 'virtinho' | 'virtinha';

export const VOICE_PITCH: Record<VirtaCharacter, number> = {
  virtinho: 0.85,
  virtinha: 1.2,
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

export function speak(text: string, locale: LocaleCode, pitch: number): void {
  TextToSpeech.speak({
    text,
    lang: SPEECH_LANG[locale] ?? 'en-US',
    pitch,
    rate: 1,
    volume: 1,
    queueStrategy: QueueStrategy.Flush,
  }).catch(() => {
    // No TTS engine available on this device; fail silently.
  });
}

export function stopSpeaking(): void {
  TextToSpeech.stop().catch(() => {});
}
