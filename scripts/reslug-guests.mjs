/**
 * Re-issues every guest's invite link as a random, unguessable slug.
 *
 *   node --env-file=.env.local scripts/reslug-guests.mjs            # dry run
 *   node --env-file=.env.local scripts/reslug-guests.mjs --commit   # write
 *
 * Behind a corp proxy, prefix with HTTPS_PROXY=http://gps:8080
 *
 * The old slugs were the guests' own names ("nando-medyy"), so anyone holding
 * one invitation could guess their way into the rest. This moves every doc to a
 * random id and deletes the readable one.
 *
 * DESTRUCTIVE: any link already sent out under an old slug stops working the
 * moment this commits. Run it only while no invitations are in circulation.
 *
 * The doc id is the slug, and Firestore cannot rename a doc, so each guest is
 * re-created under the new id and the old doc deleted — along with their `rsvps`
 * and `wishes` entries, which are keyed by the same slug and are carried across
 * so nobody's response is lost.
 *
 * The old → new mapping is printed and written to reslug-map.json. Keep it
 * until you have confirmed the site works; nothing else records it.
 */
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HttpsProxyAgent } from "https-proxy-agent";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
if (proxy) https.globalAgent = new HttpsProxyAgent(proxy);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMMIT = process.argv.includes("--commit");

// Mirrors lib/slug.ts. Kept as a copy rather than an import because this is a
// plain .mjs script and lib/ is TypeScript — if you change the alphabet or the
// length there, change it here too.
const ALPHABET = "23456789bcdfghjkmnpqrstvwxz";
const LENGTH = 10;
const isValidSlug = (s) => new RegExp(`^[${ALPHABET}]{${LENGTH}}$`).test(s);

function newSlug() {
  const LIMIT = 243; // 9 × 27 — see lib/slug.ts on the rejection sampling
  const out = [];
  while (out.length < LENGTH) {
    const bytes = new Uint8Array(LENGTH);
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b < LIMIT && out.length < LENGTH) out.push(ALPHABET[b % ALPHABET.length]);
    }
  }
  return out.join("");
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);
db.settings({ preferRest: true });

const guests = await db.collection("guests").get();
if (guests.empty) {
  console.error("✗ guests collection is empty — nothing to do.");
  process.exit(1);
}

// Already-random slugs are left alone, so a half-finished run can be repeated
// safely instead of churning links that were already re-issued.
const stale = guests.docs.filter((d) => !isValidSlug(d.id));
const alreadyDone = guests.size - stale.length;

console.log(`guests: ${guests.size} (${alreadyDone} already randomised)`);
if (!stale.length) {
  console.log("✓ Every slug is already random. Nothing to do.");
  process.exit(0);
}

// Draw all the new slugs up front and check them against each other and the
// existing ids, so a collision can never silently merge two guests.
const taken = new Set(guests.docs.map((d) => d.id));
const plan = [];
for (const doc of stale) {
  let slug;
  do {
    slug = newSlug();
  } while (taken.has(slug));
  taken.add(slug);
  plan.push({ from: doc.id, to: slug, data: doc.data() });
}

console.log("");
for (const { from, to, data } of plan) {
  console.log(`  ?to=${from.padEnd(26)} → ?to=${to}   ${data.name}`);
}

// rsvps / wishes are keyed by slug and have to move with the guest.
const [rsvps, wishes] = await Promise.all([
  db.collection("rsvps").get(),
  db.collection("wishes").get(),
]);
const rsvpById = new Map(rsvps.docs.map((d) => [d.id, d.data()]));
const wishById = new Map(wishes.docs.map((d) => [d.id, d.data()]));
const movingRsvps = plan.filter((p) => rsvpById.has(p.from));
const movingWishes = plan.filter((p) => wishById.has(p.from));

console.log(
  `\n${plan.length} guest(s) to re-slug · ${movingRsvps.length} rsvp(s) and ${movingWishes.length} wish(es) to carry across`,
);

if (!COMMIT) {
  console.log("\nDry run. Re-run with --commit to write.");
  process.exit(0);
}

// One batch: 68 guests × 2 ops plus responses stays well inside the 500 cap.
const batch = db.batch();
for (const { from, to, data } of plan) {
  batch.set(db.collection("guests").doc(to), { ...data, slug: to });
  batch.delete(db.collection("guests").doc(from));

  const rsvp = rsvpById.get(from);
  if (rsvp) {
    batch.set(db.collection("rsvps").doc(to), { ...rsvp, slug: to });
    batch.delete(db.collection("rsvps").doc(from));
  }
  const wish = wishById.get(from);
  if (wish) {
    batch.set(db.collection("wishes").doc(to), { ...wish, slug: to });
    batch.delete(db.collection("wishes").doc(from));
  }
}
await batch.commit();

const mapPath = path.join(root, "reslug-map.json");
fs.writeFileSync(
  mapPath,
  JSON.stringify(
    plan.map(({ from, to, data }) => ({ from, to, name: data.name })),
    null,
    2,
  ),
);

const after = await db.collection("guests").get();
const bad = after.docs.filter((d) => !isValidSlug(d.id));
console.log(`\n✓ Committed. guests now holds ${after.size} docs.`);
console.log(`  Mapping written to ${mapPath}`);
if (bad.length) {
  console.error(`✗ still non-random: ${bad.map((d) => d.id).join(", ")}`);
  process.exit(1);
}
process.exit(0);
