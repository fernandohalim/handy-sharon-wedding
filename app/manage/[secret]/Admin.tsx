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

type StatusValue = "all" | "pending" | "attending" | "declined";

const STATUS_FILTERS: { value: StatusValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "attending", label: "Attending" },
  { value: "declined", label: "Declined" },
];

type Dialog = {
  kind: "confirm" | "alert";
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "default" | "danger";
  onConfirm?: () => void | Promise<void>;
};

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
With all due respect, We would be honored by your presence.

We are getting married — ${wedding.groom.name} & ${wedding.bride.name}, on ${wedding.dateShort} in ${wedding.venue.area}.

Please open your personal invitation here:
${url}

Note: Please confirm your presence via RSVP no later than October 1st, 2026

With love,
${wedding.groom.name} & ${wedding.bride.name}
${wedding.hashtag}`;
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
  const [newName, setNewName] = useState("");
  /** Slug the server minted for the guest just added — see `addGuest`. */
  const [addedSlug, setAddedSlug] = useState<{ slug: string; name: string } | null>(
    null,
  );
  const [newPax, setNewPax] = useState(2);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPax, setEditPax] = useState(2);
  const [editError, setEditError] = useState("");
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("name-asc");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("all");
  const [addOpen, setAddOpen] = useState(false);
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
  }, [search, sort, statusFilter]);

  const guestSlugs = new Set(guests.map((g) => g.slug));
  const responses = Object.values(rsvps).filter((r) => guestSlugs.has(r.slug));
  const attendingResponses = responses.filter((r) => r.attending);
  const declinedResponses = responses.filter((r) => !r.attending);
  const totalAttendingHeadcount = attendingResponses.reduce(
    (sum, r) => sum + (r.headcount || 0),
    0,
  );
  const totalPending = Math.max(0, guests.length - responses.length);
  const totalPax = guests.reduce((sum, g) => sum + (g.pax || 0), 0);

  const canAdd = !!newName.trim() && newPax >= 1 && newPax <= 10 && !adding;

  const GUESTS_PER_PAGE = 25;
  const WISHES_PER_PAGE = 6;

  const searchLower = search.trim().toLowerCase();
  const searchMatched = searchLower
    ? guests.filter(
        (g) =>
          g.name.toLowerCase().includes(searchLower) ||
          g.slug.toLowerCase().includes(searchLower),
      )
    : guests;

  // Counts sit on the search-matched set, so the chips describe what the
  // current search can actually show.
  const statusCounts: Record<StatusValue, number> = {
    all: searchMatched.length,
    pending: searchMatched.filter((g) => !rsvps[g.slug]).length,
    attending: searchMatched.filter((g) => rsvps[g.slug]?.attending).length,
    declined: searchMatched.filter((g) => {
      const r = rsvps[g.slug];
      return !!r && !r.attending;
    }).length,
  };

  const filteredGuests = searchMatched.filter((g) => {
    const r = rsvps[g.slug];
    switch (statusFilter) {
      case "pending":
        return !r;
      case "attending":
        return !!r && r.attending;
      case "declined":
        return !!r && !r.attending;
      default:
        return true;
    }
  });

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
    setAddedSlug(null);
    try {
      const name = newName.trim();
      const res = await fetch(
        `/api/admin/guests?secret=${encodeURIComponent(secret)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // No slug — the server mints a random one, so that it cannot be
          // guessed from the guest's name.
          body: JSON.stringify({ name, pax: newPax }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAddError(data.error ?? "Couldn't add guest.");
        return;
      }
      // Surfaced right here because it is the one moment the link is easy to
      // find — the new row lands somewhere in 60-odd sorted, paginated guests.
      setAddedSlug({ slug: data.slug, name });
      setNewName("");
      setNewPax(2);
      router.refresh();
    } catch {
      setAddError("Network error.");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(g: GuestRow) {
    setEditingSlug(g.slug);
    setEditName(g.name);
    setEditPax(g.pax);
    setEditError("");
  }

  function cancelEdit() {
    setEditingSlug(null);
    setEditError("");
  }

  async function saveEdit(e: React.FormEvent, slug: string) {
    e.preventDefault();
    const name = editName.trim();
    if (!name) {
      setEditError("Name is required.");
      return;
    }
    if (!Number.isInteger(editPax) || editPax < 1 || editPax > 10) {
      setEditError("Pax must be a whole number between 1 and 10.");
      return;
    }
    setSavingSlug(slug);
    setEditError("");
    try {
      const res = await fetch(
        `/api/admin/guests?secret=${encodeURIComponent(secret)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, name, pax: editPax }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setEditError(data.error ?? "Couldn't save changes.");
        return;
      }
      setEditingSlug(null);
      router.refresh();
    } catch {
      setEditError("Network error.");
    } finally {
      setSavingSlug(null);
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
            {
              label: "Invited",
              value: guests.length,
              hint: `${totalPax} pax`,
            },
            {
              label: "Responded",
              value: responses.length,
              hint: `${totalPending} pending`,
            },
            {
              label: "Attending (heads)",
              value: totalAttendingHeadcount,
              hint: `${attendingResponses.length} ${
                attendingResponses.length === 1 ? "invite" : "invites"
              }`,
            },
            {
              label: "Declined",
              value: declinedResponses.length,
              hint: `${responses.length} of ${guests.length} replied`,
            },
          ].map((s) => (
            <div key={s.label} className="bg-paper px-5 py-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone">
                {s.label}
              </p>
              <p className="mt-2 font-serif text-4xl font-light text-ink">
                {s.value}
              </p>
              <p className="mt-1 text-[11px] text-stone/60">{s.hint}</p>
            </div>
          ))}
        </section>

        {/* guest list */}
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-light text-ink">
                Guest list
              </h2>
              <p className="mt-1 text-xs text-stone">
                {sortedGuests.length === guests.length
                  ? `${guests.length} ${guests.length === 1 ? "invite" : "invites"} · ${totalPax} pax invited`
                  : `Showing ${sortedGuests.length} of ${guests.length} invites`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                cancelEdit();
                setAddError("");
                setAddOpen((o) => !o);
              }}
              className="border border-ink bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ivory transition-opacity hover:opacity-90"
            >
              {addOpen ? "Close" : "+ Add guest"}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {addOpen && (
              <motion.div
                key="add-guest"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.24, ease }}
                className="overflow-hidden"
              >
                <div className="mb-5 border border-line bg-paper p-5 sm:p-6">
                  <p className="text-xs text-stone">
                    The invite link is generated automatically — a random{" "}
                    <code className="bg-ivory px-1">?to=</code> code that
                    can&apos;t be guessed from the guest&apos;s name. It is shown
                    once the guest is added, and can&apos;t be chosen or changed.
                  </p>

                  <form
                    onSubmit={addGuest}
                    className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end"
                  >
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-stone">
                        Name
                      </span>
                      <input
                        value={newName}
                        onChange={(e) =>
                          setNewName(e.target.value.slice(0, 80))
                        }
                        placeholder="Enter Guest Name"
                        className="border border-line bg-ivory px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink/60"
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

                  {addError && (
                    <p className="mt-3 text-xs text-taupe">{addError}</p>
                  )}

                  {addedSlug && (
                    <div className="mt-4 flex flex-wrap items-center gap-3 border border-line bg-ivory px-4 py-3">
                      <span className="text-xs text-stone">
                        Added <strong className="text-ink">{addedSlug.name}</strong>{" "}
                        —
                      </span>
                      <code className="bg-paper px-1.5 py-0.5 font-mono text-xs text-ink">
                        ?to={addedSlug.slug}
                      </code>
                      <button
                        type="button"
                        onClick={() =>
                          copy(
                            `${window.location.origin}/?to=${addedSlug.slug}`,
                            `link-${addedSlug.slug}`,
                          )
                        }
                        className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-stone transition-colors hover:border-ink/60 hover:text-ink"
                      >
                        {copiedKey === `link-${addedSlug.slug}`
                          ? "Copied"
                          : "Copy link"}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {guests.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={search}
                onChange={(e) => {
                  cancelEdit();
                  setSearch(e.target.value);
                }}
                placeholder="Search by name or slug…"
                className="border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink/60"
              />
              <SortDropdown
                value={sort}
                onChange={(v) => {
                  cancelEdit();
                  setSort(v);
                }}
                options={SORT_OPTIONS}
              />
            </div>
          )}

          {guests.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => {
                const active = statusFilter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => {
                      cancelEdit();
                      setStatusFilter(f.value);
                    }}
                    className={`border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                      active
                        ? "border-ink bg-ink text-ivory"
                        : "border-line bg-paper text-stone hover:border-ink hover:text-ink"
                    }`}
                  >
                    {f.label}{" "}
                    <span
                      className={active ? "text-ivory/60" : "text-stone/50"}
                    >
                      {statusCounts[f.value]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {guests.length === 0 ? (
            <p className="mt-4 border border-line bg-paper p-6 text-sm text-stone">
              No guests yet. Use &ldquo;Add guest&rdquo; above.
            </p>
          ) : sortedGuests.length === 0 ? (
            <p className="mt-4 border border-line bg-paper p-6 text-sm text-stone">
              No guests match the current search or filter.
            </p>
          ) : (
            <>
              <table className="mt-4 w-full border-collapse border border-line bg-paper text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.25em] text-stone">
                    <th className="sticky top-0 z-10 border-b border-line bg-ivory px-4 py-3 font-normal">
                      Guest
                    </th>
                    <th className="sticky top-0 z-10 hidden w-16 border-b border-line bg-ivory px-2 py-3 text-center font-normal sm:table-cell">
                      Pax
                    </th>
                    <th className="sticky top-0 z-10 w-40 border-b border-line bg-ivory px-4 py-3 font-normal">
                      Status
                    </th>
                    <th className="sticky top-0 z-10 hidden border-b border-line bg-ivory px-4 py-3 font-normal lg:table-cell">
                      Reply
                    </th>
                    <th className="sticky top-0 z-10 border-b border-line bg-ivory px-4 py-3 text-right font-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guestPageItems.map((g) => {
                    const r = rsvps[g.slug];
                    const editing = editingSlug === g.slug;
                    const saving = savingSlug === g.slug;
                    const deleting = deletingKey === `guest-${g.slug}`;

                    if (editing) {
                      return (
                        <tr
                          key={g.slug}
                          className="border-b border-line bg-ivory/50 last:border-b-0"
                        >
                          <td colSpan={5} className="px-4 py-4">
                            <form
                              onSubmit={(e) => saveEdit(e, g.slug)}
                              className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end"
                            >
                              <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-stone">
                                  Name
                                </span>
                                <input
                                  autoFocus
                                  value={editName}
                                  onChange={(e) =>
                                    setEditName(e.target.value.slice(0, 80))
                                  }
                                  className="border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink/60"
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
                                  value={editPax}
                                  onChange={(e) =>
                                    setEditPax(Number(e.target.value))
                                  }
                                  className="w-20 border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink/60"
                                />
                              </label>

                              <button
                                type="submit"
                                disabled={saving || !editName.trim()}
                                className="border border-ink bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ivory transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {saving ? "Saving…" : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={saving}
                                className="border border-line bg-paper px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Cancel
                              </button>
                            </form>

                            <p className="mt-3 text-xs text-stone">
                              Invite link{" "}
                              <code className="bg-paper px-1">
                                ?to={g.slug}
                              </code>{" "}
                              stays the same, so links already sent keep
                              working.
                              {r && editPax < r.headcount && (
                                <span className="text-taupe">
                                  {" "}
                                  Heads up — they already replied with{" "}
                                  {r.headcount}.
                                </span>
                              )}
                            </p>

                            {editError && (
                              <p className="mt-2 text-xs text-taupe">
                                {editError}
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr
                        key={g.slug}
                        className="border-b border-line transition-colors last:border-b-0 hover:bg-ivory/60"
                      >
                        <td className="px-4 py-3">
                          <p className="font-serif text-base font-light leading-snug text-ink">
                            {g.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-stone">
                            <code>?to={g.slug}</code>
                            <span className="sm:hidden"> · {g.pax} pax</span>
                          </p>
                        </td>

                        <td className="hidden px-2 py-3 text-center tabular-nums text-ink sm:table-cell">
                          {g.pax}
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge rsvp={r} />
                        </td>

                        <td className="hidden px-4 py-3 align-top lg:table-cell">
                          {r ? (
                            <div className="text-xs text-stone">
                              <p className="text-stone/70">
                                {formatDateTime(r.submittedAt)}
                              </p>
                              {r.message && (
                                <p
                                  title={r.message}
                                  className="mt-1 line-clamp-2 max-w-xs italic"
                                >
                                  &ldquo;{r.message}&rdquo;
                                </p>
                              )}
                              {r.name && r.name !== g.name && (
                                <p className="mt-1 text-stone/60">
                                  as &ldquo;{r.name}&rdquo;
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-stone/40">—</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <IconButton
                              label="Edit name or pax"
                              onClick={() => startEdit(g)}
                            >
                              <IconPencil />
                            </IconButton>

                            <IconButton
                              label={
                                copiedKey === `link-${g.slug}`
                                  ? "Link copied"
                                  : "Copy invite link"
                              }
                              className="hidden sm:flex"
                              onClick={() =>
                                copy(
                                  `${window.location.origin}/?to=${g.slug}`,
                                  `link-${g.slug}`,
                                )
                              }
                            >
                              {copiedKey === `link-${g.slug}` ? (
                                <IconCheck />
                              ) : (
                                <IconLink />
                              )}
                            </IconButton>

                            <IconButton
                              label={
                                copiedKey === `msg-${g.slug}`
                                  ? "Message copied"
                                  : "Copy invite message"
                              }
                              className="hidden sm:flex"
                              onClick={() =>
                                copy(
                                  buildShareMessage(g.slug, g.name),
                                  `msg-${g.slug}`,
                                )
                              }
                            >
                              {copiedKey === `msg-${g.slug}` ? (
                                <IconCheck />
                              ) : (
                                <IconMessage />
                              )}
                            </IconButton>

                            <IconButton
                              label="Send via WhatsApp"
                              tone="primary"
                              onClick={() =>
                                window.open(
                                  `https://wa.me/?text=${encodeURIComponent(buildShareMessage(g.slug, g.name))}`,
                                  "_blank",
                                )
                              }
                            >
                              <IconWhatsApp />
                            </IconButton>

                            <IconButton
                              label="Delete guest"
                              tone="danger"
                              disabled={deleting}
                              onClick={() => deleteGuest(g.slug, g.name)}
                            >
                              <IconTrash />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <Pager
                page={guestPageClamped}
                total={guestTotalPages}
                onChange={(p) => {
                  cancelEdit();
                  setGuestPage(p);
                }}
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

function StatusBadge({ rsvp }: { rsvp: RsvpRow | undefined }) {
  if (!rsvp) {
    return (
      <span className="inline-block whitespace-nowrap border border-line px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-stone/60">
        Pending
      </span>
    );
  }
  if (!rsvp.attending) {
    return (
      <span className="inline-block whitespace-nowrap border border-taupe/40 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-taupe">
        Declined
      </span>
    );
  }
  return (
    <span className="inline-block whitespace-nowrap border border-ink/30 bg-ink/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-ink">
      Attending · {rsvp.headcount}
    </span>
  );
}

/** Square 32px action button. `label` doubles as the tooltip and a11y name. */
function IconButton({
  label,
  onClick,
  disabled,
  tone = "default",
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "primary" | "danger";
  className?: string;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "primary"
      ? "border-ink bg-ink text-ivory hover:opacity-90"
      : tone === "danger"
        ? "border-line bg-ivory text-taupe hover:border-taupe"
        : "border-line bg-ivory text-stone hover:border-ink hover:text-ink";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`flex h-8 w-8 shrink-0 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${toneClass} ${className}`}
    >
      {children}
    </button>
  );
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function IconPencil() {
  return (
    <Svg>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </Svg>
  );
}

function IconLink() {
  return (
    <Svg>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </Svg>
  );
}

function IconMessage() {
  return (
    <Svg>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </Svg>
  );
}

function IconWhatsApp() {
  return (
    <Svg>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
    </Svg>
  );
}

function IconTrash() {
  return (
    <Svg>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </Svg>
  );
}

function IconCheck() {
  return (
    <Svg>
      <path d="M20 6L9 17l-5-5" />
    </Svg>
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
