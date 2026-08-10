/**
 * Invite slugs — the `?to=` value that identifies a guest.
 *
 * These used to be readable ("nando-medyy"), which made every invitation on the
 * site guessable from any other: knowing one guest's link told you the shape of
 * everyone else's, and a name is a short list of guesses away. The invitation is
 * private, so slugs are now random and unguessable, and there is deliberately no
 * way to choose one — see `newSlug`.
 */

/**
 * Digits and consonants only.
 *
 * No `0`/`1`/`l`/`o` — they are read wrong off a screen and typed wrong into a
 * URL bar. No vowels either, which is what stops a random draw from ever
 * spelling a real word at somebody's guest.
 */
const ALPHABET = "23456789bcdfghjkmnpqrstvwxz";

/**
 * 10 characters of a 27-symbol alphabet ≈ 47 bits, or about 2×10^14 slugs.
 * Against the ~70 live invitations that is roughly a 1-in-3-trillion chance
 * that any single guess lands on a real one — an attacker would need to be
 * hammering the site for longer than the marriage to find one.
 */
const LENGTH = 10;

/** True for a string this module could have produced. */
export function isValidSlug(slug: string): boolean {
  return new RegExp(`^[${ALPHABET}]{${LENGTH}}$`).test(slug);
}

/**
 * A fresh random slug.
 *
 * There is no `preferred` or `custom` parameter, and that is the point: an
 * invite link is only private while it is unpredictable, so nothing anywhere in
 * the app lets a slug be chosen or edited. Callers get what they are given.
 *
 * Uses the platform CSPRNG — `Math.random()` is seeded predictably enough that
 * slugs drawn from it can be reconstructed, which would put us back where we
 * started. Available on Node 18+, the browser, and the edge runtime alike.
 */
export function newSlug(): string {
  // Rejection sampling. 27 does not divide 256, so folding a raw byte with `%`
  // would make the first 13 symbols marginally likelier than the rest; bytes
  // from the short tail are discarded instead. 243 = 9 × 27.
  const LIMIT = 243;
  const out: string[] = [];

  while (out.length < LENGTH) {
    const bytes = new Uint8Array(LENGTH);
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b < LIMIT && out.length < LENGTH) out.push(ALPHABET[b % ALPHABET.length]);
    }
  }

  return out.join("");
}
