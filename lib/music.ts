"use client";

/**
 * The page's background music, as one audio element living outside React.
 *
 * It is not a component and not a ref, for one reason: every browser blocks
 * audio that did not come from a user gesture, and the gesture here is the tap
 * on "Open Invitation". `play()` has to be called *inside* that click handler —
 * from an effect it is a frame too late and Safari refuses. So the element is
 * a module singleton the handler can reach synchronously, and React subscribes
 * to it rather than owning it.
 */

const SRC = "/audio/song.mp3";

/** Under the page, not over it. The file is mastered to -18 LUFS to match. */
const VOLUME = 0.58;

/** Fade-in on open, so the music arrives rather than starting mid-bar. */
const FADE_MS = 1800;

let el: HTMLAudioElement | null = null;
let fadeTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Whether the music is *meant* to be sounding — which is what the toggle shows,
 * and it is not the same thing as `el.paused`.
 *
 * Two reasons it has to be tracked separately. Opening the invitation starts a
 * 2.8MB file that was not preloaded, so `paused` stays true for as long as the
 * first bytes take to arrive; keyed off that, the button would paint itself
 * struck-through on open and flip a second later, which reads as "the music is
 * off" at the exact moment it is starting. And leaving the tab pauses the
 * element without the guest having asked for silence — intent survives that,
 * so the button does not lie about it either.
 *
 * It starts true: playing is the default state, and only a rejected `play()`
 * or the guest's own tap turns it off.
 */
let intended = true;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

/**
 * Created on first use, never at module scope — this module is imported during
 * SSR, where `Audio` does not exist.
 */
function element(): HTMLAudioElement {
  if (el) return el;

  el = new Audio(SRC);
  el.loop = true;
  // Nothing is fetched until play() is called, so a guest still looking at the
  // cover never pays for 2.8MB they may never hear.
  el.preload = "none";
  el.volume = 0;

  el.addEventListener("play", emit);
  el.addEventListener("pause", emit);

  // Music from a tab you have left is just noise from nowhere. Hand the sound
  // back only if the guest did not silence it themselves.
  document.addEventListener("visibilitychange", () => {
    if (!el) return;
    if (document.hidden) el.pause();
    else if (intended) void el.play().catch(() => {});
  });

  return el;
}

/** Ramps volume, so play/pause are never abrupt. */
function fadeTo(target: number, ms: number, done?: () => void) {
  const a = element();
  if (fadeTimer) clearInterval(fadeTimer);

  const step = 40;
  const from = a.volume;
  const delta = target - from;
  let t = 0;

  fadeTimer = setInterval(() => {
    t += step;
    const p = Math.min(t / ms, 1);
    // iOS Safari makes `volume` read-only and silently ignores this. The track
    // is mastered quiet for exactly that case: there the music simply starts at
    // its own level instead of easing in, which is a fade missing, not a bug.
    a.volume = Math.max(0, Math.min(1, from + delta * p));
    if (p === 1) {
      if (fadeTimer) clearInterval(fadeTimer);
      fadeTimer = null;
      done?.();
    }
  }, step);
}

/**
 * Call this synchronously from the click that opens the invitation — that
 * gesture is what buys permission to make sound at all.
 */
export function start() {
  const a = element();
  intended = true;
  emit();
  a.volume = 0;
  void a
    .play()
    .then(() => fadeTo(VOLUME, FADE_MS))
    .catch(() => {
      // Blocked after all (a locked-down browser, or iOS Low Power Mode).
      // Correct the toggle rather than leaving it claiming to play, and let
      // the guest start it by hand.
      intended = false;
      emit();
    });
}

export function toggle() {
  const a = element();
  if (intended) {
    intended = false;
    emit();
    fadeTo(0, 400, () => a.pause());
  } else {
    intended = true;
    emit();
    a.volume = 0;
    void a.play().then(() => fadeTo(VOLUME, FADE_MS)).catch(() => {
      intended = false;
      emit();
    });
  }
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function isPlaying() {
  return intended;
}
