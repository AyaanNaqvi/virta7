import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// Push notifications need a Firebase project. Until FIREBASE_SERVICE_ACCOUNT_JSON
// is set (the contents of a Firebase service account key, as JSON), this stays
// disabled and notifyTutor() becomes a no-op rather than throwing.
let messaging = null;

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (raw) {
  try {
    const serviceAccount = JSON.parse(raw);
    initializeApp({ credential: cert(serviceAccount) });
    messaging = getMessaging();
  } catch (err) {
    console.error('Firebase push notifications not configured correctly:', err.message);
  }
}

export function pushEnabled() {
  return messaging !== null;
}

// Sends to every token; drops tokens that FCM reports as no-longer-registered
// so a stale install doesn't keep failing forever. `onInvalidToken` lets the
// caller remove them from storage.
export async function sendPushToTokens(tokens, { title, body }, onInvalidToken) {
  if (!messaging || !tokens || tokens.length === 0) return;
  await Promise.all(
    tokens.map(async (token) => {
      try {
        await messaging.send({ token, notification: { title, body } });
      } catch (err) {
        if (err?.code === 'messaging/registration-token-not-registered') {
          onInvalidToken?.(token);
        } else {
          console.error('Push send failed:', err.message);
        }
      }
    })
  );
}
