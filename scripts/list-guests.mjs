import https from "node:https";
import { HttpsProxyAgent } from "https-proxy-agent";
import { initializeApp, cert } from "firebase-admin/app";

// Corp network blocks direct egress; route Firestore REST calls via the proxy.
const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
if (proxy) https.globalAgent = new HttpsProxyAgent(proxy);

import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);
db.settings({ preferRest: true });
const snap = await db.collection("guests").get();
console.log(`guests: ${snap.size}`);
snap.docs.forEach((d) => {
  const x = d.data();
  console.log(`${d.id} | ${x.name} | pax=${x.pax}`);
});
process.exit(0);
