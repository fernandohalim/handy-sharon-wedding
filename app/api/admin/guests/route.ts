import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { isValidSlug, newSlug } from "@/lib/slug";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Note there is no `slug` here. The invite link is only private while it is
  // unpredictable, so the slug is minted on the server and a client-supplied
  // one is ignored rather than honoured — otherwise anyone who could reach this
  // endpoint could plant a guessable link.
  let body: { name?: unknown; pax?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const pax = Number(body.pax);

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!Number.isInteger(pax) || pax < 1 || pax > 10) {
    return NextResponse.json(
      { error: "Pax must be a whole number between 1 and 10." },
      { status: 400 },
    );
  }

  // A collision is vanishingly unlikely at this scale, but a duplicate would
  // silently overwrite another guest's invitation, so draw again if it happens.
  let slug = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = newSlug();
    if (!(await adminDb.collection("guests").doc(candidate).get()).exists) {
      slug = candidate;
      break;
    }
  }
  if (!slug) {
    return NextResponse.json(
      { error: "Could not allocate an invite link. Please try again." },
      { status: 503 },
    );
  }

  await adminDb.collection("guests").doc(slug).set({
    slug,
    name,
    pax,
    createdAt: FieldValue.serverTimestamp(),
  });

  // Returned because the admin screen has no other way to learn it — unlike the
  // old scheme, the caller cannot predict what it asked for.
  return NextResponse.json({ ok: true, slug });
}

export async function PATCH(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { slug?: unknown; name?: unknown; pax?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = String(body.slug ?? "")
    .trim()
    .toLowerCase();
  const name = String(body.name ?? "").trim();
  const pax = Number(body.pax);

  // The slug is the invite URL — it identifies the doc and is never rewritten
  // here, so links already sent out keep working.
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!Number.isInteger(pax) || pax < 1 || pax > 10) {
    return NextResponse.json(
      { error: "Pax must be a whole number between 1 and 10." },
      { status: 400 },
    );
  }

  const ref = adminDb.collection("guests").doc(slug);
  const existing = await ref.get();
  if (!existing.exists) {
    return NextResponse.json(
      { error: `Guest "${slug}" no longer exists.` },
      { status: 404 },
    );
  }

  await ref.update({ name, pax, updatedAt: FieldValue.serverTimestamp() });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug")?.trim().toLowerCase() ?? "";
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  // Cascade: also remove this guest's RSVP and wish if they exist.
  // batch.delete is idempotent — non-existent docs are a no-op.
  const batch = adminDb.batch();
  batch.delete(adminDb.collection("guests").doc(slug));
  batch.delete(adminDb.collection("rsvps").doc(slug));
  batch.delete(adminDb.collection("wishes").doc(slug));
  await batch.commit();

  return NextResponse.json({ ok: true });
}
