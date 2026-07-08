/**
 * Delicate hand-drawn botanical line-art used as a soft floral motif across
 * the invitation — a nod to the couple's flower-heavy wedding decor.
 * Everything strokes with `currentColor`, so colour comes from a `text-*`
 * class on the element (e.g. `text-taupe`).
 */

type SprigProps = { className?: string; flip?: boolean };

/** A small horizontal sprig with a rose at the inner (right) end. */
export function FloralSprig({ className = "", flip = false }: SprigProps) {
  return (
    <svg
      viewBox="0 0 60 22"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-3.5 w-auto ${flip ? "-scale-x-100" : ""} ${className}`}
    >
      <path d="M2 11 C 16 11, 26 11.5, 38 11" />
      <path d="M14 11 C 13 6, 17 4.5, 21 6 C 18.5 9, 16 11, 14 11 Z" />
      <path d="M22 11 C 21 16, 25 17.5, 29 16 C 26.5 13, 24 11, 22 11 Z" />
      <path d="M30 11 C 30 7.5, 33 6.5, 36 7.5" />
      <circle cx="46" cy="11" r="4" />
      <path d="M46 7.4 A4 4 0 0 1 49.6 11" />
      <path d="M42.6 11 A4 4 0 0 1 46 7.4" />
      <circle cx="46" cy="11" r="1.5" />
    </svg>
  );
}

/** A tiny sprig — a short stem with two leaves and a bud. For flanking labels. */
export function FloralTwig({ className = "", flip = false }: SprigProps) {
  return (
    <svg
      viewBox="0 0 30 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-2.5 w-auto ${flip ? "-scale-x-100" : ""} ${className}`}
    >
      <path d="M2 7 C 10 6, 16 6, 24 7" />
      <path d="M11 7 C 10 3.5, 13 2.5, 16 3.5 C 14 5.5, 12.5 7, 11 7 Z" />
      <path d="M17 7 C 16.5 10.5, 19 11.5, 21.5 10.5 C 20 8.5, 18.5 7, 17 7 Z" />
      <circle cx="26" cy="7" r="1.6" />
    </svg>
  );
}

/** A compact corner sprig — a short stem with a leaf and a rose. For small
 *  elements like buttons. Flip with `-scale-*` to place at any corner. */
export function SprigCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-5 w-5 ${className}`}
    >
      <path d="M5 5 C 15 7, 22 13, 26 23" />
      <path d="M15 9 C 12 6, 16 3, 20 5 C 17 8, 16 9, 15 9 Z" />
      <circle cx="28" cy="27" r="3.2" />
      <path d="M28 23.8 A3.2 3.2 0 0 1 31.2 27" />
      <path d="M24.8 27 A3.2 3.2 0 0 1 28 23.8" />
      <circle cx="28" cy="27" r="1.1" />
      <circle cx="6" cy="5" r="1" />
    </svg>
  );
}

/** A small symmetric bud — a rose with a leaf either side. For short dividers. */
export function FloralBud({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-4 w-auto ${className}`}
    >
      <circle cx="22" cy="8" r="3.2" />
      <path d="M22 4.8 A3.2 3.2 0 0 1 25.2 8" />
      <path d="M18.8 8 A3.2 3.2 0 0 1 22 4.8" />
      <circle cx="22" cy="8" r="1.1" />
      <path d="M18 8 C 13 8, 9 7, 5 8" />
      <path d="M12 8 C 11 5, 14 3.5, 16 5 C 14.5 7, 13 8, 12 8 Z" />
      <circle cx="4" cy="8" r="1" />
      <path d="M26 8 C 31 8, 35 7, 39 8" />
      <path d="M32 8 C 33 5, 30 3.5, 28 5 C 29.5 7, 31 8, 32 8 Z" />
      <circle cx="40" cy="8" r="1" />
    </svg>
  );
}

/** A symmetric centred flourish — a rose flanked by two leafy branches. */
export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-5 w-auto ${className}`}
    >
      {/* centre rose */}
      <circle cx="80" cy="12" r="4.2" />
      <path d="M80 7.8 A4.2 4.2 0 0 1 84.2 12" />
      <path d="M75.8 12 A4.2 4.2 0 0 1 80 7.8" />
      <circle cx="80" cy="12" r="1.5" />
      {/* left branch */}
      <path d="M73 12 C 60 12, 50 11, 38 12" />
      <path d="M60 12 C 59 8, 63 6.5, 67 8 C 64 11, 61.5 12, 60 12 Z" />
      <path d="M50 12 C 49 16, 53 17.5, 57 16 C 54 13, 51.5 12, 50 12 Z" />
      <circle cx="36" cy="12" r="1.2" />
      {/* right branch */}
      <path d="M87 12 C 100 12, 110 11, 122 12" />
      <path d="M100 12 C 101 8, 97 6.5, 93 8 C 96 11, 98.5 12, 100 12 Z" />
      <path d="M110 12 C 111 16, 107 17.5, 103 16 C 106 13, 108.5 12, 110 12 Z" />
      <circle cx="124" cy="12" r="1.2" />
    </svg>
  );
}

/**
 * A lush corner spray — layered roses, buds, leaves and filler berries that
 * curl in from a corner. Draws anchored to its top-left; rotate/flip with a
 * `-scale-*` class to place it at any corner.
 */
export function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 150"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-24 w-24 sm:h-28 sm:w-28 ${className}`}
    >
      {/* vines */}
      <path d="M12 12 C 44 20, 70 34, 88 64 C 98 82, 103 104, 105 128" />
      <path d="M60 30 C 74 24, 92 22, 112 26" />
      <path d="M84 60 C 92 54, 104 52, 116 56" />
      {/* leaves */}
      <path d="M40 19 C 36 11, 44 5, 52 9 C 46 14, 43 18, 40 19 Z" />
      <path d="M70 40 C 66 32, 74 27, 82 30 C 76 35, 73 39, 70 40 Z" />
      <path d="M95 78 C 89 73, 90 63, 98 62 C 98 68, 99 74, 95 78 Z" />
      <path d="M100 110 C 94 106, 94 96, 102 95 C 103 101, 104 106, 100 110 Z" />
      {/* rose 1 — top branch */}
      <circle cx="118" cy="24" r="7" />
      <path d="M118 17 A7 7 0 0 1 125 24" />
      <path d="M111 24 A7 7 0 0 1 118 17" />
      <circle cx="118" cy="24" r="3.4" />
      <circle cx="118" cy="24" r="1.2" />
      {/* rose 2 — mid branch */}
      <circle cx="120" cy="56" r="5" />
      <path d="M120 51 A5 5 0 0 1 125 56" />
      <circle cx="120" cy="56" r="2.2" />
      {/* bud at the vine tip */}
      <path d="M105 128 C 102 122, 106 117, 110 117 C 111 122, 110 126, 105 128 Z" />
      {/* filler berries */}
      <circle cx="54" cy="26" r="1.3" />
      <circle cx="30" cy="16" r="1.2" />
    </svg>
  );
}

/**
 * An ornate, diagonally-symmetric frame corner — a medallion at the corner with
 * two mirrored scroll arms carrying roses and leaves, for an engraved
 * photo-frame look. Flip with `-scale-*` to place at any corner.
 */
export function FrameCorner({ className = "" }: { className?: string }) {
  const arm = (
    <>
      <path d="M34 24 C 60 18, 78 22, 96 18" />
      <path d="M96 18 C 106 16, 114 20, 116 28 C 117 33, 113 37, 109 35 C 106 34, 106 30, 109.5 30.5" />
      <path d="M40 30 C 60 26, 74 30, 90 27" />
      <path d="M58 20 C 55 13, 63 9, 69 13 C 63 17, 60 20, 58 20 Z" />
      <path d="M78 22 C 77 15, 85 12, 90 16 C 84 20, 81 22, 78 22 Z" />
      <path d="M70 30 C 69 37, 77 39, 82 34 C 76 32, 73 30, 70 30 Z" />
      <circle cx="102" cy="32" r="5.5" />
      <path d="M102 26.5 A5.5 5.5 0 0 1 107.5 32" />
      <path d="M96.5 32 A5.5 5.5 0 0 1 102 26.5" />
      <circle cx="102" cy="32" r="2.4" />
      <circle cx="120" cy="40" r="1.4" />
    </>
  );
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.15}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-28 w-28 sm:h-36 sm:w-36 ${className}`}
    >
      {/* corner medallion */}
      <circle cx="26" cy="26" r="6" />
      <circle cx="26" cy="26" r="2.4" />
      <path d="M26 20 A6 6 0 0 1 32 26" />
      <path d="M20 26 A6 6 0 0 1 26 20" />
      {arm}
      {/* mirror the arm across the corner diagonal */}
      <g transform="matrix(0 1 1 0 0 0)">{arm}</g>
    </svg>
  );
}

/** A wide symmetric spray — a centre rose with long leafy branches and buds. */
export function FloralSpray({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 46"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-8 w-auto ${className}`}
    >
      {/* centre rose */}
      <circle cx="120" cy="23" r="6.5" />
      <path d="M120 16.5 A6.5 6.5 0 0 1 126.5 23" />
      <path d="M113.5 23 A6.5 6.5 0 0 1 120 16.5" />
      <circle cx="120" cy="23" r="3" />
      <circle cx="120" cy="23" r="1.1" />
      {/* left branch */}
      <path d="M113 23 C 95 23, 78 21, 58 25 C 46 27, 36 26, 26 22" />
      <path d="M92 23 C 90 17, 84 15, 79 17 C 82 21, 87 23, 92 23 Z" />
      <path d="M74 24 C 73 30, 78 32, 83 30 C 80 26, 77 24, 74 24 Z" />
      <path d="M58 25 C 57 20, 61 17, 66 18" />
      <circle cx="30" cy="22" r="3.4" />
      <path d="M30 18.6 A3.4 3.4 0 0 1 33.4 22" />
      <circle cx="22" cy="24" r="1.2" />
      {/* right branch */}
      <path d="M127 23 C 145 23, 162 21, 182 25 C 194 27, 204 26, 214 22" />
      <path d="M148 23 C 150 17, 156 15, 161 17 C 158 21, 153 23, 148 23 Z" />
      <path d="M166 24 C 167 30, 162 32, 157 30 C 160 26, 163 24, 166 24 Z" />
      <path d="M182 25 C 183 20, 179 17, 174 18" />
      <circle cx="210" cy="22" r="3.4" />
      <path d="M210 18.6 A3.4 3.4 0 0 1 213.4 22" />
      <circle cx="218" cy="24" r="1.2" />
    </svg>
  );
}
