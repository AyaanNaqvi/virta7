import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { apiFetch } from './api';

// The Firebase project (google-services.json + service account key) hasn't
// been set up yet. Calling PushNotifications.register() without it doesn't
// just reject the promise — it crashes the native app outright, right after
// the tutor grants notification permission. Keep this off until Firebase is
// actually wired up, then flip it back on.
const PUSH_NOTIFICATIONS_READY = false;

// Push notifications only work in the installed native app (Android/iOS) —
// there is no native push transport in a plain mobile/desktop browser tab.
// Silently does nothing there, and does nothing if the tutor already denied
// permission previously (we don't want to nag them every time they log in).
export async function registerForPushNotifications(token: string | null): Promise<void> {
  if (!PUSH_NOTIFICATIONS_READY || !token || !Capacitor.isNativePlatform()) return;

  try {
    const current = await PushNotifications.checkPermissions();
    let status = current.receive;
    if (status === 'prompt' || status === 'prompt-with-rationale') {
      const requested = await PushNotifications.requestPermissions();
      status = requested.receive;
    }
    if (status !== 'granted') return;

    PushNotifications.addListener('registration', ({ value: fcmToken }) => {
      apiFetch('/push/register', { method: 'POST', token, body: { token: fcmToken } }).catch(() => {
        // Best-effort; the tutor just won't get pushes until the next successful register.
      });
    });
    PushNotifications.addListener('registrationError', () => {
      // No Firebase project configured yet, or the platform rejected registration; ignore.
    });

    await PushNotifications.register();
  } catch {
    // Push notifications unavailable on this device/build; ignore.
  }
}
