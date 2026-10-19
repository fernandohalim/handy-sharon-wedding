import https from "node:https";
import { writeFileSync } from "node:fs";
import { HttpsProxyAgent } from "https-proxy-agent";
import { initializeApp, cert } from "firebase-admin/app";

// Corp network blocks direct egress; route Firestore REST calls via the proxy.
const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
if (proxy) https.globalAgent = new HttpsProxyAgent(proxy);

import { getFirestore } from "firebase-admin/firestore";

// Read-only: dumps guests, rsvps and wishes to a JSON file (argv[2]).
const out = process.argv[2];
if (!out) {
  console.error("usage: node scripts/dump-rsvps.mjs <out.json>");
  process.exit(1);
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

const toPlain = (d) =>
  Object.fromEntries(
    Object.entries(d.data()).map(([k, v]) => [
      k,
      v?.toDate ? v.toDate().toISOString() : v,
    ]),
  );

const dump = {};
for (const name of ["guests", "rsvps", "wishes"]) {
  const snap = await db.collection(name).get();
  dump[name] = snap.docs.map((d) => ({ id: d.id, ...toPlain(d) }));
  console.log(`${name}: ${snap.size}`);
}
writeFileSync(out, JSON.stringify(dump, null, 2));
process.exit(0);
