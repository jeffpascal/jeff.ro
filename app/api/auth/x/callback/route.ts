import { NextResponse } from "next/server";

/**
 * OAuth callback landing for the X (Twitter) developer app configured on
 * jeff.ro. Not wired to a token exchange yet — this just gives the X
 * Developer Portal a real, resolvable HTTPS callback URL to save against
 * the app's "Confidential client" settings.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasCode = searchParams.has("code");

  return NextResponse.json({
    ok: true,
    message: hasCode
      ? "Received X OAuth callback with an authorization code."
      : "X OAuth callback endpoint is live.",
  });
}
