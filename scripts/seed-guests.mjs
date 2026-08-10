/**
 * One-off seed of the real guest list into Firestore. ALREADY RUN — kept as the
 * record of who was invited, not as something to run again.
 *
 *   node --env-file=.env.local scripts/seed-guests.mjs            # dry run
 *   node --env-file=.env.local scripts/seed-guests.mjs --commit   # write
 *
 * Behind a corp proxy, prefix with HTTPS_PROXY=http://gps:8080
 *
 * ⚠ The slugs below are the guests' names, which is exactly what made every
 * invitation guessable from any other. They were replaced with random ones by
 * scripts/reslug-guests.mjs, so re-running this would put the guessable links
 * back and orphan the RSVPs filed under the current slugs. To add a guest now,
 * use the manage screen — it mints a random slug server-side.
 */
import https from "node:https";
import { HttpsProxyAgent } from "https-proxy-agent";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
if (proxy) https.globalAgent = new HttpsProxyAgent(proxy);

const COMMIT = process.argv.includes("--commit");

/** Test rows seeded during development — removed before the real list lands. */
const DELETE_SLUGS = ["amelia", "andre", "kapepe", "sendy"];

// [slug, display name, pax]
const BOTH = [
  ["ka-ryan-ci-fina", "Ka Ryan & Ci Fina", 2],
  ["leon-tesa", "Leon & Tesa", 2],
  ["josh-klara", "Josh & Klara", 2],
  ["kevin-monic", "Kevin & Monic", 2],
  ["tepin", "Tepin", 1],
  ["cecel", "Cecel", 1],
  ["rilla", "Rilla", 1],
  ["keren-quino", "Keren & Quino", 2],
  ["bobby-vhenna", "Bobby & Vhenna", 2],
  ["mouthy", "Mouthy & Partner", 2],
  ["gaby-kiki", "Gaby Kiki", 1],
  ["gaby-gunawan", "Gaby Gunawan & Partner", 2],
  ["edwin-jess", "Edwin & Jess", 2],
  ["maurin-henry", "Maurin & Henry", 2],
  ["therese", "Therese", 1],
  ["nando-medyy", "Nando & Medyy", 2],
  ["david-there", "David & There", 2],
  ["ka-dave-ka-airin-daniel", "Ka Dave, Ka Airin & Daniel", 3],
  ["kezia", "Kezia", 1],
  ["rose", "Rose", 1],
  ["sheren", "Sheren", 1],
  ["yana", "Yana", 1],
  ["jordy", "Jordy", 1],
  ["jay-joan", "Jay & Joan", 2],
  ["bapake-mamake", "Bapake & Mamake", 2],
];

const HANDY = [
  ["kape", "Kape & Partner", 2],
  ["cece-kape", "Cece Kape & Partner", 2],
  ["om-pardi", "Om Pardi & Partner", 2],
  ["andre-monic", "Andre & Monic", 2],
  ["uta", "Uta & Partner", 2],
  ["ko-thomcil", "Ko Thomcil & Partner", 2],
  ["ko-indra-ci-bec", "Ko Indra & Ci Bec", 2],
  ["ci-nat-ko-arpin", "Ci Nat & Ko Arpin", 2],
  ["ci-gladys", "Ci Gladys & Partner", 2],
  ["bom-wian", "Bom & Wian", 2],
  ["ko-agus-ci-marsya", "Ko Agus & Ci Marsya", 2],
  ["ko-dan-ci-epe", "Ko Dan & Ci Epe", 2],
  ["ko-andrew-ci-vena", "Ko Andrew & Ci Vena", 2],
  ["gilbrot-panes", "Gilbrot & Panes", 2],
  ["michael-yunita", "Michael & Yunita", 2],
  ["ci-christie", "Ci Christie & Partner", 2],
  ["tasya-chesya-ray", "Tasya, Chesya & Ray", 3],
  ["edward", "Edward & Partner", 2],
  ["ko-fide-ci-keke", "Ko Fide & Ci Keke", 2],
  ["ce-yemi", "Ce Yemi & Partner", 2],
  ["ci-epcil", "Ci Epcil", 1],
  ["stenli", "Stenli & Partner", 2],
  ["nando-ncek", "Nando Ncek", 1],
  ["ryan", "Ryan", 1],
  ["aldo", "Aldo", 1],
  ["singyung", "Singyung", 1],
  ["mario", "Mario", 1],
  ["russel", "Russel & Partner", 2],
];

const SHARON = [
  ["gloria", "Gloria", 1],
  ["brenda", "Brenda & Partner", 2],
  ["gaby", "Gaby", 1],
  ["livia", "Livia", 1],
  ["jesika", "Jesika", 1],
  ["ps-ray-ps-cindy", "Ps Ray & Ps Cindy", 2],
  ["samsoy-ci-mey", "Samsoy & Ci Mey", 2],
  ["ka-daell-ka-itin", "Ka Daell & Ka Itin", 2],
  ["ka-hellen-ka-hendrik", "Ka Hellen & Ka Hendrik", 2],
  ["ka-kezia-ka-kaleb", "Ka Kezia & Ka Kaleb", 2],
  ["ka-yogi-ka-vini", "Ka Yogi & Ka Vini", 2],
  ["rheva-ka-bams", "Rheva & Ka Bams", 2],
  ["ka-odre", "Ka Odre", 1],
  ["ci-cindy", "Ci Cindy", 1],
  ["michelle-wilson", "Michelle & Wilson", 2],
];

const GROUPS = [
  ["Both", BOTH, 41],
  ["Handy", HANDY, 51],
  ["Sharon", SHARON, 24],
];

// --- validate before touching Firestore ---------------------------------
const seen = new Map();
let problems = 0;

for (const [label, rows, expectedPax] of GROUPS) {
  const pax = rows.reduce((s, r) => s + r[2], 0);
  if (pax !== expectedPax) {
    console.error(`✗ ${label}: pax ${pax}, expected ${expectedPax}`);
    problems++;
  }
  for (const [slug, name, p] of rows) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      console.error(`✗ bad slug "${slug}"`);
      problems++;
    }
    if (!name.trim()) {
      console.error(`✗ empty name for "${slug}"`);
      problems++;
    }
    if (!Number.isInteger(p) || p < 1 || p > 10) {
      console.error(`✗ bad pax ${p} for "${slug}"`);
      problems++;
    }
    if (seen.has(slug)) {
      console.error(`✗ duplicate slug "${slug}" (${seen.get(slug)} & ${label})`);
      problems++;
    }
    seen.set(slug, label);
  }
}
if (problems) {
  console.error(`\n${problems} problem(s) — aborting.`);
  process.exit(1);
}

const all = GROUPS.flatMap(([, rows]) => rows);
const totalPax = all.reduce((s, r) => s + r[2], 0);

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);
db.settings({ preferRest: true });

const existing = new Set((await db.collection("guests").get()).docs.map((d) => d.id));
const collisions = all.filter(([slug]) => existing.has(slug));

for (const [label, rows] of GROUPS) {
  console.log(`\n--- ${label} (${rows.length} invites, ${rows.reduce((s, r) => s + r[2], 0)} pax) ---`);
  for (const [slug, name, pax] of rows) {
    console.log(`  ?to=${slug.padEnd(24)} ${name.padEnd(28)} pax ${pax}`);
  }
}

console.log(`\nTotal: ${all.length} invites, ${totalPax} pax`);
console.log(`Deleting test docs: ${DELETE_SLUGS.filter((s) => existing.has(s)).join(", ") || "(none present)"}`);
if (collisions.length) {
  console.error(`\n✗ slug already in Firestore: ${collisions.map((c) => c[0]).join(", ")} — aborting.`);
  process.exit(1);
}

if (!COMMIT) {
  console.log("\nDry run. Re-run with --commit to write.");
  process.exit(0);
}

// Firestore batches cap at 500 ops; this fits comfortably in one.
const batch = db.batch();
for (const slug of DELETE_SLUGS) {
  batch.delete(db.collection("guests").doc(slug));
  batch.delete(db.collection("rsvps").doc(slug));
  batch.delete(db.collection("wishes").doc(slug));
}
for (const [slug, name, pax] of all) {
  batch.set(db.collection("guests").doc(slug), {
    slug,
    name,
    pax,
    createdAt: FieldValue.serverTimestamp(),
  });
}
await batch.commit();

const after = await db.collection("guests").get();
console.log(`\n✓ Committed. guests collection now holds ${after.size} docs.`);
process.exit(0);
