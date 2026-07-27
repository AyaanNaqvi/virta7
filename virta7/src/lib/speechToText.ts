import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import type { LocaleCode } from '../i18n/locales';
import { SPEECH_LANG } from './speech';

// Minimal shape of the standard Web Speech API's SpeechRecognition, which
// TypeScript's lib.dom doesn't fully cover and most browsers only expose
// under the `webkit` prefix.
interface WebSpeechResultEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}
interface WebSpeechErrorEvent {
  error: string;
}
interface WebSpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: WebSpeechResultEvent) => void) | null;
  onerror: ((event: WebSpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
interface WebSpeechRecognitionCtor {
  new (): WebSpeechRecognition;
}
declare global {
  interface Window {
    SpeechRecognition?: WebSpeechRecognitionCtor;
    webkitSpeechRecognition?: WebSpeechRecognitionCtor;
  }
}

let activeWebRecognizer: WebSpeechRecognition | null = null;

function getWebSpeechCtor(): WebSpeechRecognitionCtor | undefined {
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

export function isSpeechToTextSupported(): boolean {
  if (Capacitor.isNativePlatform()) return true;
  return typeof window !== 'undefined' && !!getWebSpeechCtor();
}

// Listens for a single utterance and resolves with the transcript (empty
// string if nothing was understood). Rejects only on a real error/denial.
export async function listenOnce(locale: LocaleCode): Promise<string> {
  const langTag = SPEECH_LANG[locale] ?? 'en-US';

  if (Capacitor.isNativePlatform()) {
    const current = await SpeechRecognition.checkPermissions();
    let status = current.speechRecognition;
    if (status !== 'granted') {
      const requested = await SpeechRecognition.requestPermissions();
      status = requested.speechRecognition;
    }
    if (status !== 'granted') {
      throw new Error('Microphone permission denied');
    }
    const result = await SpeechRecognition.start({
      language: langTag,
      popup: false,
      partialResults: false,
      maxResults: 1,
    });
    return result.matches?.[0] ?? '';
  }

  const Ctor = getWebSpeechCtor();
  if (!Ctor) throw new Error('Speech recognition not supported in this browser');

  return new Promise<string>((resolve, reject) => {
    const recognizer = new Ctor();
    activeWebRecognizer = recognizer;
    let settled = false;

    recognizer.lang = langTag;
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;

    recognizer.onresult = (event) => {
      settled = true;
      resolve(event.results[0]?.[0]?.transcript ?? '');
    };
    recognizer.onerror = (event) => {
      settled = true;
      reject(new Error(event.error));
    };
    recognizer.onend = () => {
      activeWebRecognizer = null;
      if (!settled) resolve(''); // stopped with no speech understood
    };

    recognizer.start();
  });
}

export async function stopListening(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await SpeechRecognition.stop().catch(() => {});
    return;
  }
  activeWebRecognizer?.stop();
}
