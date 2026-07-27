import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { apiFetch } from './api';

// Push notifications only work in the installed native app (Android/iOS) —
// there is no native push transport in a plain mobile/desktop browser tab.
// Silently does nothing there, and does nothing if the tutor already denied
// permission previously (we don't want to nag them every time they log in).
export async function registerForPushNotifications(token: string | null): Promise<void> {
  if (!token || !Capacitor.isNativePlatform()) return;

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
