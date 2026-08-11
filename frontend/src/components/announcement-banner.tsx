"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "nomad-banner-dismissed";

export function AnnouncementBanner() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration mount pattern
    setMounted(true);
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) setShow(false);
    } catch {
      /* ignore */
    }
  }, []);

  if (!mounted || !show) return null;

  return (
    <div className="border-b border-border bg-surface-1">
      <div className="containers">
        <div className="relative border-x border-border px-4 py-2.5 text-center tablet:px-8 desktop:px-14">
          <Link
            href="/dashboard"
            className="font-commit-mono cursor-pointer text-[13px] leading-5 text-text-primary transition-colors hover:text-accent-primary tablet:text-[14px]"
          >
            <span>Built during the WeMakeDevs x Zerops Hackathon 2026</span>
            <span className="mx-2 text-text-tertiary">-</span>
            <span className="text-accent-primary">Explore the demo</span>
            <span aria-hidden="true" className="ml-2">
              -&gt;
            </span>
          </Link>
          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={() => {
              setShow(false);
              try {
                sessionStorage.setItem(STORAGE_KEY, "1");
              } catch {
                /* ignore */
              }
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-tertiary transition-colors hover:text-text-primary tablet:right-8 desktop:right-14"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
              aria-hidden="true"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
