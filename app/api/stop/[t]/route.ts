import { NextResponse } from "next/server";
import { optOut } from "../../../lib/optout";

// POST from the /stop/<t> page (form) or from mail clients (RFC 8058 List-Unsubscribe-Post one-click).
export async function POST(req: Request, { params }: { params: Promise<{ t: string }> }) {
  const { t } = await params;
  const body = await req.text().catch(() => "");
  const oneClick = body.includes("List-Unsubscribe=One-Click");
  const ok = await optOut(t, oneClick ? "email one-click" : "pagina /stop");
  if (oneClick) return new NextResponse(ok ? "ok" : "not found", { status: ok ? 200 : 404 });
  return NextResponse.redirect(new URL(`/stop/${t}?${ok ? "ok=1" : "err=1"}`, req.url), 303);
}
