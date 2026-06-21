import { Resend } from "resend";

let cached: Resend | undefined;

/** Lazy Resend client — defers the env check until first call so build-time
 *  evaluation doesn't crash without secrets. Mirrors the INEO-DECOR setup. */
export function getResend(): Resend {
  if (!cached) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY not set");
    cached = new Resend(key);
  }
  return cached;
}

type SendArgs = Parameters<Resend["emails"]["send"]>[0];

/** Single chokepoint for outbound mail. Set EMAIL_DRY_RUN=1 to short-circuit
 *  (local debugging) and log instead of sending. */
export function sendEmail(args: SendArgs): ReturnType<Resend["emails"]["send"]> {
  if (process.env.EMAIL_DRY_RUN === "1") {
    const subject = typeof args.subject === "string" ? args.subject : "<non-string subject>";
    const to = Array.isArray(args.to) ? args.to.join(",") : args.to;
    console.log(`[sendEmail DRY_RUN] would send "${subject}" to ${to}`);
    return Promise.resolve({
      data: { id: `dry-run-${Date.now().toString(36)}` },
      error: null,
    }) as ReturnType<Resend["emails"]["send"]>;
  }
  return getResend().emails.send(args);
}
