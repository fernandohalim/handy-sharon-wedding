import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Guest } from "@/lib/guests";

export type Rsvp = {
  slug: string;
  name: string;
  attending: boolean;
  headcount: number;
  message: string;
};

export type Wish = {
  id: string;
  name: string;
  message: string;
  createdAt: Date | null;
};

/** Resolve a guest by slug (?to=). Returns null if not found. */
export async function fetchGuest(slug: string): Promise<Guest | null> {
  const snap = await getDoc(doc(db, "guests", slug));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { slug: snap.id, name: d.name as string, pax: d.pax as number };
}

/** Create or overwrite this guest's RSVP (doc id == slug). */
export async function submitRsvp(input: Rsvp): Promise<void> {
  await setDoc(doc(db, "rsvps", input.slug), {
    slug: input.slug,
    name: input.name,
    attending: input.attending,
    headcount: input.headcount,
    message: input.message,
    submittedAt: serverTimestamp(),
  });
}

export type StoredRsvp = {
  attending: boolean;
  headcount: number;
  message: string;
};

/** Read this guest's existing RSVP, or null if they haven't responded. */
export async function fetchRsvp(slug: string): Promise<StoredRsvp | null> {
  const snap = await getDoc(doc(db, "rsvps", slug));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    attending: d.attending as boolean,
    headcount: d.headcount as number,
    message: (d.message as string) ?? "",
  };
}

/** Create this guest's wish (doc id == slug → one wish per guest). */
export async function submitWish(
  slug: string,
  name: string,
  message: string,
): Promise<void> {
  await setDoc(doc(db, "wishes", slug), {
    slug,
    name,
    message,
    createdAt: serverTimestamp(),
  });
}

/** Fetch all wishes, newest first. */
export async function fetchWishes(): Promise<Wish[]> {
  const snap = await getDocs(
    query(collection(db, "wishes"), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name as string,
      message: data.message as string,
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
}