"use client";

import { useTheme } from "@wrksz/themes/client";
import { useEffect, useState } from "react";

function MonitorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
    </svg>
  );
}

const OPTIONS = [
  { value: "system", label: "System theme", icon: <MonitorIcon /> },
  { value: "light", label: "Light mode", icon: <SunIcon /> },
  { value: "dark", label: "Dark mode", icon: <MoonIcon /> },
] as const;

type ThemeOption = (typeof OPTIONS)[number]["value"];

/** Footer theme switch (radiogroup style). */
export function FooterThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration mount pattern
    setMounted(true);
  }, []);
  const current = mounted ? resolvedTheme : "system";

  return (
    <div
      className="inline-flex items-center gap-0.5 border border-border-default bg-surface-1 p-1"
      aria-label="Toggle theme"
      role="radiogroup"
    >
      {OPTIONS.map((opt) => {
        const active = current === opt.value;
        return (
          <button
            key={opt.value}
            className={
              "flex items-center justify-center p-1.5 transition-all duration-200 " +
              (active ? "bg-surface-3" : "")
            }
            aria-label={opt.label}
            aria-checked={active}
            role="radio"
            onClick={() => setTheme(opt.value)}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
