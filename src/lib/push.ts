import webpush from "web-push";
import { listSubscriptions, removeSubscription, type Filter, type Subscription } from "@/lib/repo/push";

// Envoi de notifications Web Push (VAPID). Côté serveur uniquement.

let configured = false;
function configure(): boolean {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:contact@diabaction.cg";
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

export type PushPayload = { title: string; body: string; url?: string };

export type SendResult = { matched: number; sent: number; failed: number; pruned: number };

/** Diffuse une notification aux abonnés correspondant au ciblage. */
export async function broadcast(payload: PushPayload, filter: Filter = {}): Promise<SendResult> {
  if (!configure()) {
    throw new Error("VAPID non configuré (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY).");
  }
  const subs = await listSubscriptions(filter);
  const body = JSON.stringify(payload);
  let sent = 0;
  let failed = 0;
  let pruned = 0;

  await Promise.all(
    subs.map(async (s: Subscription) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, body);
        sent++;
      } catch (err) {
        failed++;
        // 404/410 : abonnement expiré → on le purge.
        const code = (err as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) {
          await removeSubscription(s.endpoint);
          pruned++;
        }
      }
    })
  );

  return { matched: subs.length, sent, failed, pruned };
}
