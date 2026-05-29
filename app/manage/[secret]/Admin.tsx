"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { wedding } from "@/lib/config";

export type GuestRow = { slug: string; name: string; pax: number };
export type RsvpRow = {
  slug: string;
  name: string;
  attending: boolean;
  headcount: number;
  message: string;
  submittedAt: number | null;
};
export type WishRow = {
  id: string;
  name: string;
  message: string;
  createdAt: number | null;
};
const ease = [0.22, 1, 0.36, 1] as const;

type SortValue = "name-asc" | "name-desc" | "pending-first" | "recent-response";

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "pending-first", label: "Pending first" },
  { value: "recent-response", label: "Recently responded" },
];

type Dialog = {
  kind: "confirm" | "alert";
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "default" | "danger";
  onConfirm?: () => void | Promise<void>;
};

function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDateTime(ms: number | null): string {
  if (!ms) return "";
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Called only inside event handlers, so window is always defined.
function buildShareMessage(slug: string, name: string): string {
  const url = `${window.location.origin}/?to=${slug}`;
  return `Dear ${name},

We are getting married — ${wedding.groom.name} & ${wedding.bride.name}, on ${wedding.dateShort} in ${wedding.venue.area}. We would be honored by your presence.

Please open your personal invitation here:
${url}

With love,
${wedding.groom.name} & ${wedding.bride.name}`;
}

export default function Admin({
  secret,
  guests,
  rsvps,
  wishes,
}: {
  secret: string;
  guests: GuestRow[];
  rsvps: Record<string, RsvpRow>;
  wishes: WishRow[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [newPax, setNewPax] = useState(2);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("name-asc");
  const [guestPage, setGuestPage] = useState(1);
  const [wishPage, setWishPage] = useState(1);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [dialogBusy, setDialogBusy] = useState(false);

  useEffect(() => {
    if (!dialog) return;
    document.body.style.overflow = "hidden";
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && !dialogBusy) setDialog(null);
    }
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dialog, dialogBusy]);

  useEffect(() => {
    setGuestPage(1);
  }, [search, sort]);

  const guestSlugs = new Set(guests.map((g) => g.slug));
  const responses = Object.values(rsvps).filter((r) => guestSlugs.has(r.slug));
  const attendingResponses = responses.filter((r) => r.attending);
  const declinedResponses = responses.filter((r) => !r.attending);
  const totalAttendingHeadcount = attendingResponses.reduce(
    (sum, r) => sum + (r.headcount || 0),
    0,
  );
  const totalPending = Math.max(0, guests.length - responses.length);

  const slugPreview = normalizeSlug(newSlug);
  const canAdd =
    !!slugPreview && !!newName.trim() && newPax >= 1 && newPax <= 10 && !adding;

  const GUESTS_PER_PAGE = 10;
  const WISHES_PER_PAGE = 6;

  const searchLower = search.trim().toLowerCase();
  const filteredGuests = searchLower
    ? guests.filter(
        (g) =>
          g.name.toLowerCase().includes(searchLower) ||
          g.slug.toLowerCase().includes(searchLower),
      )
    : guests;

  const sortedGuests = [...filteredGuests].sort((a, b) => {
    const ra = rsvps[a.slug];
    const rb = rsvps[b.slug];
    switch (sort) {
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "pending-first": {
        const ap = ra ? 1 : 0;
        const bp = rb ? 1 : 0;
        if (ap !== bp) return ap - bp;
        return a.name.localeCompare(b.name);
      }
      case "recent-response": {
        const at = ra?.submittedAt ?? 0;
        const bt = rb?.submittedAt ?? 0;
        if (at !== bt) return bt - at;
        return a.name.localeCompare(b.name);
      }
      case "name-asc":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const guestTotalPages = Math.max(
    1,
    Math.ceil(sortedGuests.length / GUESTS_PER_PAGE),
  );
  const guestPageClamped = Math.min(Math.max(1, guestPage), guestTotalPages);
  const guestPageItems = sortedGuests.slice(
    (guestPageClamped - 1) * GUESTS_PER_PAGE,
    guestPageClamped * GUESTS_PER_PAGE,
  );

  const wishTotalPages = Math.max(
    1,
    Math.ceil(wishes.length / WISHES_PER_PAGE),
  );
  const wishPageClamped = Math.min(Math.max(1, wishPage), wishTotalPages);
  const wishPageItems = wishes.slice(
    (wishPageClamped - 1) * WISHES_PER_PAGE,
    wishPageClamped * WISHES_PER_PAGE,
  );

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800);
    } catch {}
  }

  async function addGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!canAdd) return;
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch(
        `/api/admin/guests?secret=${encodeURIComponent(secret)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: slugPreview,
            name: newName.trim(),
            pax: newPax,
          }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAddError(data.error ?? "Couldn't add guest.");
        return;
      }
      setNewSlug("");
      setNewName("");
      setNewPax(2);
      router.refresh();
    } catch {
      setAddError("Network error.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDialogConfirm() {
    if (!dialog) return;
    if (!dialog.onConfirm) {
      setDialog(null);
      return;
    }
    setDialogBusy(true);
    try {
      await dialog.onConfirm();
    } finally {
      setDialogBusy(false);
    }
  }

  function closeDialog() {
    if (dialogBusy) return;
    setDialog(null);
  }

  function deleteGuest(slug: string, name: string) {
    setDialog({
      kind: "confirm",
      variant: "danger",
      title: `Delete ${name}?`,
      message:
        "This removes their guest record along with any RSVP or wish they submitted. This cannot be undone.",
      confirmLabel: "Delete guest",
      onConfirm: async () => {
        const key = `guest-${slug}`;
        setDeletingKey(key);
        try {
          const res = await fetch(
            `/api/admin/guests?secret=${encodeURIComponent(secret)}&slug=${encodeURIComponent(slug)}`,
            { method: "DELETE" },
          );
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setDialog({
              kind: "alert",
              title: "Couldn't delete guest",
              message: data.error ?? "Please try again.",
            });
            return;
          }
          setDialog(null);
          router.refresh();
        } catch {
          setDialog({
            kind: "alert",
            title: "Network error",
            message: "Something went wrong. Please try again.",
          });
        } finally {
          setDeletingKey(null);
        }
      },
    });
  }

  function deleteWish(id: string, name: string) {
    setDialog({
      kind: "confirm",
      variant: "danger",
      title: `Delete wish from ${name}?`,
      message:
        "This blessing will be removed from the guestbook. This cannot be undone.",
      confirmLabel: "Delete wish",
      onConfirm: async () => {
        const key = `wish-${id}`;
        setDeletingKey(key);
        try {
          const res = await fetch(
            `/api/admin/wishes?secret=${encodeURIComponent(secret)}&id=${encodeURIComponent(id)}`,
            { method: "DELETE" },
          );
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setDialog({
              kind: "alert",
              title: "Couldn't delete wish",
              message: data.error ?? "Please try again.",
            });
            return;
          }
          setDialog(null);
          router.refresh();
        } catch {
          setDialog({
            kind: "alert",
            title: "Network error",
            message: "Something went wrong. Please try again.",
          });
        } finally {
          setDeletingKey(null);
        }
      },
    });
  }

  return (
    <main className="min-h-screen bg-ivory px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border-b border-line pb-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone">
            Handy &amp; Sharon · Admin
          </p>
          <h1 className="mt-2 font-serif text-4xl font-light text-ink sm:text-5xl">
            Guests &amp; Responses
          </h1>
        </header>

        {/* stats */}
        <section className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
          {[
            { label: "Invited", value: guests.length },
            { label: "Responded", value: responses.length },
            { label: "Attending (heads)", value: totalAttendingHeadcount },
            { label: "Declined", value: declinedResponses.length },
          ].map((s) => (
            <div key={s.label} className="bg-paper px-5 py-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone">
                {s.label}
              </p>
              <p className="mt-2 font-serif text-4xl font-light text-ink">
                {s.value}
              </p>
            </div>
          ))}
        </section>

        <p className="mt-3 text-xs text-stone">
          {totalPending} pending · {attendingResponses.length} accepted ·{" "}
          {responses.length} of {guests.length} replies
        </p>

        {/* add guest */}
        <section className="mt-10 border border-line bg-paper p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-light text-ink">
            Add a guest
          </h2>
          <p className="mt-1 text-xs text-stone">
            The slug becomes the value after{" "}
            <code className="bg-ivory px-1">?to=</code> in the invite URL.
          </p>

          <form
            onSubmit={addGuest}
            className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_1fr_auto_auto] sm:items-end"
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone">
                Name
              </span>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value.slice(0, 80))}
                placeholder="Enter Guest Name"
                className="border border-line bg-ivory px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink/60"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone">
                Slug{" "}
                {slugPreview && newSlug !== slugPreview && (
                  <span className="text-taupe">→ {slugPreview}</span>
                )}
              </span>
              <input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="guest-name"
                className="border border-line bg-ivory px-3 py-2.5 font-mono text-sm text-ink outline-none transition-colors focus:border-ink/60"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone">
                Pax
              </span>
              <input
                type="number"
                min={1}
                max={10}
                value={newPax}
                onChange={(e) => setNewPax(Number(e.target.value))}
                className="w-20 border border-line bg-ivory px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink/60"
              />
            </label>

            <button
              type="submit"
              disabled={!canAdd}
              className="border border-ink bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ivory transition-opacity disabled:opacity-40"
            >
              {adding ? "Adding…" : "Add Guest"}
            </button>
          </form>

          {addError && <p className="mt-3 text-xs text-taupe">{addError}</p>}
        </section>

        {/* guest list */}
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-2xl font-light text-ink">
              Guest list
            </h2>
            <p className="text-xs text-stone">
              {sortedGuests.length} of {guests.length}{" "}
              {guests.length === 1 ? "guest" : "guests"}
            </p>
          </div>

          {guests.length > 0 && (
            <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or slug…"
                className="border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink/60"
              />
              <SortDropdown
                value={sort}
                onChange={setSort}
                options={SORT_OPTIONS}
              />
            </div>
          )}

          {guests.length === 0 ? (
            <p className="border border-line bg-paper p-6 text-sm text-stone">
              No guests yet. Add one above.
            </p>
          ) : guestPageItems.length === 0 ? (
            <p className="border border-line bg-paper p-6 text-sm text-stone">
              No guests match &ldquo;{search}&rdquo;.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {guestPageItems.map((g) => {
                  const r = rsvps[g.slug];
                  const status: "attending" | "declined" | "pending" = r
                    ? r.attending
                      ? "attending"
                      : "declined"
                    : "pending";
                  const dKey = `guest-${g.slug}`;
                  return (
                    <article
                      key={g.slug}
                      className="border border-line bg-paper p-5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div>
                          <h3 className="font-serif text-xl font-light text-ink">
                            {g.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-stone">
                            <code className="bg-ivory px-1">?to={g.slug}</code>{" "}
                            · pax {g.pax}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-[0.25em] ${
                            status === "attending"
                              ? "text-ink"
                              : status === "declined"
                                ? "text-taupe"
                                : "text-stone/60"
                          }`}
                        >
                          {status === "attending"
                            ? `✓ Attending · ${r!.headcount} ${r!.headcount === 1 ? "head" : "heads"}`
                            : status === "declined"
                              ? "✗ Declined"
                              : "⏳ Pending"}
                        </span>
                      </div>

                      {r && (
                        <div className="mt-3 grid gap-1 text-xs text-stone">
                          {r.message && (
                            <p className="italic">&ldquo;{r.message}&rdquo;</p>
                          )}
                          <p className="text-stone/60">
                            Responded {formatDateTime(r.submittedAt)}
                            {r.name && r.name !== g.name
                              ? ` · as "${r.name}"`
                              : ""}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            copy(
                              `${window.location.origin}/?to=${g.slug}`,
                              `link-${g.slug}`,
                            )
                          }
                          className="border border-line bg-ivory px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink"
                        >
                          {copiedKey === `link-${g.slug}`
                            ? "Link copied"
                            : "Copy link"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            copy(
                              buildShareMessage(g.slug, g.name),
                              `msg-${g.slug}`,
                            )
                          }
                          className="border border-line bg-ivory px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink"
                        >
                          {copiedKey === `msg-${g.slug}`
                            ? "Message copied"
                            : "Copy message"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              `https://wa.me/?text=${encodeURIComponent(buildShareMessage(g.slug, g.name))}`,
                              "_blank",
                            )
                          }
                          className="border border-ink bg-ink px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ivory transition-opacity hover:opacity-90"
                        >
                          Open in WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteGuest(g.slug, g.name)}
                          disabled={deletingKey === dKey}
                          className="ml-auto border border-line bg-ivory px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-taupe transition-colors hover:border-taupe hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingKey === dKey ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <Pager
                page={guestPageClamped}
                total={guestTotalPages}
                onChange={setGuestPage}
              />
            </>
          )}
        </section>

        {/* wishes */}
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl font-light text-ink">
            Wishes ({wishes.length})
          </h2>

          {wishes.length === 0 ? (
            <p className="border border-line bg-paper p-6 text-sm text-stone">
              No wishes yet.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {wishPageItems.map((w) => {
                  const dKey = `wish-${w.id}`;
                  return (
                    <article
                      key={w.id}
                      className="border border-line bg-paper p-5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-serif text-lg italic text-ink">
                          {w.name}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-stone/60">
                          <code className="bg-ivory px-1 text-stone">
                            {w.id}
                          </code>{" "}
                          · {formatDateTime(w.createdAt)}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-stone">{w.message}</p>
                      <div className="mt-3 flex">
                        <button
                          type="button"
                          onClick={() => deleteWish(w.id, w.name)}
                          disabled={deletingKey === dKey}
                          className="ml-auto border border-line bg-ivory px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-taupe transition-colors hover:border-taupe hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingKey === dKey ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <Pager
                page={wishPageClamped}
                total={wishTotalPages}
                onChange={setWishPage}
              />
            </>
          )}
        </section>

        <footer className="mt-16 text-center text-[10px] uppercase tracking-[0.3em] text-stone/50">
          Refresh the page to see new responses
        </footer>
      </div>

      <AnimatePresence>
        {dialog && (
          <motion.div
            key="dialog-overlay"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
          >
            <div
              className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
              onClick={closeDialog}
            />
            <motion.div
              className="relative w-full max-w-md border border-line bg-paper p-7 sm:p-8"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.24, ease }}
            >
              <p className="text-[10px] uppercase tracking-[0.32em] text-stone">
                {dialog.variant === "danger"
                  ? "Heads up"
                  : dialog.kind === "alert"
                    ? "Notice"
                    : "Confirm"}
              </p>
              <h3 className="mt-3 font-serif text-2xl font-light text-ink sm:text-3xl">
                {dialog.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-stone">
                {dialog.message}
              </p>
              <div className="mt-7 flex flex-wrap justify-end gap-3">
                {dialog.kind === "confirm" && (
                  <button
                    type="button"
                    onClick={closeDialog}
                    disabled={dialogBusy}
                    className="border border-line bg-ivory px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDialogConfirm}
                  disabled={dialogBusy}
                  className={`border px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
                    dialog.variant === "danger"
                      ? "border-taupe bg-taupe text-ivory hover:opacity-90"
                      : "border-ink bg-ink text-ivory hover:opacity-90"
                  }`}
                >
                  {dialogBusy
                    ? "Working…"
                    : (dialog.confirmLabel ??
                      (dialog.kind === "alert" ? "OK" : "Confirm"))}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Pager({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-between gap-3 text-xs text-stone">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="border border-line bg-paper px-3 py-1.5 uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← Prev
      </button>
      <span className="uppercase tracking-[0.25em]">
        Page {page} of {total}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
        className="border border-line bg-paper px-3 py-1.5 uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}

function SortDropdown<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 border border-line bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/40 sm:min-w-[15rem]"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-stone">
          Sort
        </span>
        <span className="flex-1 text-left">{current?.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 z-30 mt-1 overflow-hidden border border-line bg-paper"
          >
            {options.map((o) => {
              const selected = value === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-ivory ${
                    selected ? "text-ink" : "text-stone"
                  }`}
                >
                  <span>{o.label}</span>
                  {selected && <span className="text-taupe">✦</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
