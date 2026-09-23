import { getDb } from "./mongo";

/** Outreach opt-out (shop-prospector). Prospects live in the "prospector" db on the same cluster. */
async function prospectorDb() {
  const d = getDb();
  if (!d) return null;
  await d;
  return (await global._jeffroMongoPromise!).db("prospector");
}

export const validToken = (t: string) => /^[A-Za-z0-9_-]{6,16}$/.test(t);

export async function optOut(token: string, source: string): Promise<boolean> {
  if (!validToken(token)) return false;
  const db = await prospectorDb();
  if (!db) return false;
  const prospects = db.collection("prospects");
  const p = await prospects.findOne({ optoutToken: token });
  if (!p) return false;
  const now = new Date();
  if (p.stage !== "opted-out") {
    await prospects.updateOne(
      { _id: p._id },
      { $set: { stage: "opted-out", optedOutAt: now, updatedAt: now }, $push: { history: { at: now, stage: "opted-out", note: source } } } as never,
    );
  }
  const contacts: string[] = [
    ...((p.contact?.emails as string[]) ?? []).map((e) => e.toLowerCase()),
    ...((p.contact?.phones as string[]) ?? []),
    ...(p.contact?.anafPhone ? [p.contact.anafPhone as string] : []),
  ];
  const optouts = db.collection<{ _id: string; at: Date; source: string; cui: string }>("optouts");
  for (const c of new Set(contacts)) {
    await optouts.updateOne({ _id: c }, { $setOnInsert: { _id: c, at: now, source, cui: p.cui } }, { upsert: true });
  }
  return true;
}
