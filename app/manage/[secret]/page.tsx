import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";
import Admin, { type GuestRow, type RsvpRow, type WishRow } from "./Admin";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ secret: string }>;
}) {
  const { secret } = await params;
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    notFound();
  }

  const [guestsSnap, rsvpsSnap, wishesSnap] = await Promise.all([
    adminDb.collection("guests").get(),
    adminDb.collection("rsvps").get(),
    adminDb.collection("wishes").orderBy("createdAt", "desc").get(),
  ]);

  const guests: GuestRow[] = guestsSnap.docs
    .map((d) => {
      const x = d.data();
      return {
        slug: d.id,
        name: String(x.name ?? ""),
        pax: Number(x.pax ?? 0),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const rsvps: Record<string, RsvpRow> = {};
  rsvpsSnap.docs.forEach((d) => {
    const x = d.data();
    rsvps[d.id] = {
      slug: d.id,
      name: String(x.name ?? ""),
      attending: Boolean(x.attending),
      headcount: Number(x.headcount ?? 0),
      message: String(x.message ?? ""),
      submittedAt: x.submittedAt?.toMillis?.() ?? null,
    };
  });

  const wishes: WishRow[] = wishesSnap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      name: String(x.name ?? ""),
      message: String(x.message ?? ""),
      createdAt: x.createdAt?.toMillis?.() ?? null,
    };
  });

  return (
    <Admin secret={secret} guests={guests} rsvps={rsvps} wishes={wishes} />
  );
}
