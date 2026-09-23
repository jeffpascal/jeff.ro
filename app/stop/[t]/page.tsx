import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dezabonare | jeff.ro",
  robots: { index: false, follow: false },
};

// A confirm button (not auto-unsubscribe on GET) so link previews in WhatsApp/SMS apps can't trigger it.
export default async function StopPage({
  params,
  searchParams,
}: {
  params: Promise<{ t: string }>;
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  const { t } = await params;
  const { ok, err } = await searchParams;
  return (
    <main style={{ maxWidth: 460, margin: "0 auto", padding: "64px 20px", fontFamily: "system-ui, sans-serif", color: "#1d2534" }}>
      <p style={{ fontWeight: 600, marginBottom: 32 }}>jeff.ro</p>
      {ok ? (
        <>
          <h1 style={{ fontSize: 26, lineHeight: 1.25 }}>Gata, nu te mai contactez.</h1>
          <p style={{ color: "#4e586e", lineHeight: 1.6 }}>
            Datele tale de contact au fost trecute pe lista de excludere. Dacă am făcut un demo pentru magazinul tău, îl șterg.
          </p>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: 26, lineHeight: 1.25 }}>Nu mai vrei mesaje de la mine?</h1>
          <p style={{ color: "#4e586e", lineHeight: 1.6 }}>
            Apasă butonul și nu mai primești niciun email, SMS sau mesaj WhatsApp de la jeff.ro.
          </p>
          {err ? <p style={{ color: "#c03b2d" }}>Linkul nu mai e valid. Scrie-mi la contact@jeff.ro și te scot manual.</p> : null}
          <form method="post" action={`/api/stop/${t}`}>
            <button
              type="submit"
              style={{ marginTop: 16, font: "inherit", fontWeight: 600, padding: "12px 20px", borderRadius: 10, border: 0, background: "#1d2534", color: "#fff", cursor: "pointer" }}
            >
              Dezabonează-mă
            </button>
          </form>
          <p style={{ color: "#4e586e", fontSize: 14, marginTop: 24 }}>Sau răspunde „stop” la orice mesaj. UNIC JUST ONLINE SRL · contact@jeff.ro</p>
        </>
      )}
    </main>
  );
}
