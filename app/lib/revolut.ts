/**
 * Client minimal pentru Revolut Merchant API + verificarea semnăturii webhook.
 * Portat din INEO DECOR (aceeași versiune de API și același contract de semnătură).
 *
 * Invariante:
 *   - versiunea de API e fixată; schimbarea ei cere resincronizare cu documentația;
 *   - semnătura webhook e v1: payload = `v1.<timestamp>.<corp brut>`, HMAC-SHA256;
 *   - fereastra de replay e 5 minute; în afara ei respingem indiferent de semnătură;
 *   - comparație în timp constant — niciodată `===` pe digest.
 */
import crypto from "crypto";

const PRODUCTION_BASE = "https://merchant.revolut.com";
const SANDBOX_BASE = "https://sandbox-merchant.revolut.com";
const API_VERSION = "2026-03-12";
const SIGNATURE_VERSION = "v1";
const REPLAY_TOLERANCE_MS = 5 * 60 * 1000;

export type RevolutOrder = {
  id: string;
  token: string;
  state: string;
  amount: number;
  currency: string;
  checkout_url?: string;
  merchant_order_data?: { reference?: string };
  metadata?: Record<string, string>;
};

function apiBase(): string {
  return process.env.REVOLUT_API_MODE === "sandbox" ? SANDBOX_BASE : PRODUCTION_BASE;
}

function authHeaders(): Record<string, string> {
  const key = process.env.REVOLUT_SECRET_KEY;
  if (!key) throw new Error("REVOLUT_SECRET_KEY not set");
  return {
    Authorization: `Bearer ${key}`,
    "Revolut-Api-Version": API_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function createRevolutOrder(input: {
  amountMinor: number;
  currency: string;
  description: string;
  merchantOrderRef: string;
  redirectUrl: string;
  customer: { email: string; full_name?: string; phone?: string };
  metadata?: Record<string, string>;
  idempotencyKey?: string;
}): Promise<RevolutOrder> {
  const headers = authHeaders();
  if (input.idempotencyKey) headers["Idempotency-Key"] = input.idempotencyKey;

  const res = await fetch(`${apiBase()}/api/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      amount: input.amountMinor,
      currency: input.currency,
      description: input.description,
      customer: input.customer,
      merchant_order_data: { reference: input.merchantOrderRef },
      redirect_url: input.redirectUrl,
      capture_mode: "automatic",
      metadata: input.metadata,
    }),
  });

  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!res.ok) {
    const msg =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : `HTTP ${res.status}`;
    throw new Error(`Revolut API error: ${msg}`);
  }
  return body as RevolutOrder;
}

export function verifyRevolutWebhookSignature(input: {
  rawBody: string;
  signatureHeader: string | null;
  timestampHeader: string | null;
  signingSecret: string;
  now?: number;
}): { ok: true } | { ok: false; reason: string } {
  const { rawBody, signatureHeader, timestampHeader, signingSecret } = input;
  if (!signingSecret) return { ok: false, reason: "missing signing secret" };
  if (!signatureHeader) return { ok: false, reason: "missing signature header" };
  if (!timestampHeader) return { ok: false, reason: "missing timestamp header" };

  const ts = Number(timestampHeader);
  if (!Number.isFinite(ts)) return { ok: false, reason: "invalid timestamp" };
  const now = input.now ?? Date.now();
  if (Math.abs(now - ts) > REPLAY_TOLERANCE_MS) {
    return { ok: false, reason: "timestamp out of tolerance" };
  }

  const payload = `${SIGNATURE_VERSION}.${ts}.${rawBody}`;
  const expected = `${SIGNATURE_VERSION}=${crypto
    .createHmac("sha256", signingSecret)
    .update(payload)
    .digest("hex")}`;
  const expectedBuf = Buffer.from(expected);

  for (const cand of signatureHeader.split(",").map((s) => s.trim()).filter(Boolean)) {
    const candBuf = Buffer.from(cand);
    if (candBuf.length === expectedBuf.length && crypto.timingSafeEqual(candBuf, expectedBuf)) {
      return { ok: true };
    }
  }
  return { ok: false, reason: "signature mismatch" };
}
