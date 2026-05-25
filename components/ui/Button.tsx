"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  tone?: "light" | "dark";
  type?: "button" | "submit";
  className?: string;
};

export default function Button({
  children,
  href,
  onClick,
  tone = "light",
  type = "button",
  className = "",
}: Props) {
  const isDark = tone === "dark";
  const border = isDark ? "border-ivory/55" : "border-ink";
  const text = isDark
    ? "text-ivory group-hover:text-ink"
    : "text-ink group-hover:text-ivory";
  const fill = isDark ? "bg-ivory" : "bg-ink";

  const cls = `group relative inline-flex items-center justify-center overflow-hidden border ${border} px-9 py-4 ${className}`;

  const inner = (
    <>
      <span
        className={`absolute inset-0 translate-y-full ${fill} transition-transform duration-500 ease-editorial group-hover:translate-y-0`}
      />
      <span
        className={`relative z-10 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.28em] transition-colors duration-500 ${text}`}
      >
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
