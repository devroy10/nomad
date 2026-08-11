"use client";

import Link from "next/link";
import { Wordmark } from "@/components/ui/wordmark";

export function GithubStarIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 1.17262C11.8675 1.17262 15 4.30512 15 8.17262C14.999 11.1801 13.0805 13.8521 10.2315 14.8136C9.8815 14.8836 9.75 14.6646 9.75 14.4811C9.75 14.2446 9.759 13.4921 9.759 12.5561C9.759 11.9001 9.5405 11.4801 9.2865 11.2611C10.844 11.0861 12.4805 10.4911 12.4805 7.80512C12.4805 7.03512 12.209 6.41362 11.763 5.92412C11.833 5.74912 12.078 5.03162 11.693 4.06912C11.693 4.06912 11.1065 3.87662 9.768 4.78662C9.208 4.62912 8.613 4.55062 8.018 4.55062C7.423 4.55062 6.828 4.62912 6.268 4.78662C4.9295 3.88562 4.343 4.06912 4.343 4.06912C3.958 5.03162 4.203 5.74912 4.273 5.92412C3.827 6.41412 3.5555 7.04412 3.5555 7.80512C3.5555 10.4826 5.183 11.0866 6.7405 11.2616C6.539 11.4366 6.3555 11.7431 6.294 12.1976C5.8915 12.3816 4.885 12.6791 4.2555 11.6201C4.124 11.4101 3.7305 10.8941 3.1795 10.9026C2.593 10.9116 2.9435 11.2351 3.188 11.3661C3.4855 11.5321 3.8265 12.1536 3.9055 12.3551C4.0455 12.7486 4.5005 13.5016 6.259 13.1776C6.259 13.7641 6.268 14.3151 6.268 14.4811C6.268 14.6651 6.1365 14.8746 5.7865 14.8136C2.927 13.8616 0.998501 11.1861 1 8.17212C1 4.30462 4.1325 1.17262 8 1.17262Z"
        fill="currentColor"
      />
    </svg>
  );
}

const NAV_LINKS = [] as const;

export function DownloadButton({
  className,
}: {
  className?: string;
}) {
  return (
    <Link
      href="/dashboard"
      className={
        "inline-flex cursor-pointer items-center gap-1 bg-text-primary px-4 py-2.75  text-bg-primary transition-colors hover:bg-text-primary/80 disabled:opacity-100 " +
        (className ?? "")
      }
    >
      <span className="-tracking-[0.02em] text-[14px] font-medium leading-3.5">
        Get started
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.4 8L7.99998 10.4L5.59998 8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 2.4V10.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.2 4.8C12.5256 4.8 13.6 5.8744 13.6 7.2V11.2C13.6 12.5256 12.5256 13.6 11.2 13.6H4.80002C3.47442 13.6 2.40002 12.5256 2.40002 11.2V7.2C2.40002 5.8744 3.47442 4.8 4.80002 4.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-border bg-bg-primary border-b">
      <div className="containers">
        <nav className="border-x border-border  h-full py-2.5 tablet:py-6">
          <div className="flex items-center justify-between px-4 tablet:px-8 desktop:px-14">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-text-primary transition-colors hover:text-text-primary/80"
              >
                <Wordmark />
              </Link>
            </div>

            <div className="hidden items-center gap-4 desktop:flex">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/devroy10/nomad"
                className="flex items-center gap-2 border border-border-default bg-surface-1 px-3 py-2.5 text-text-secondary transition-colors hover:bg-surface-1/80"
              >
                <GithubStarIcon />
                <span className="text-[14px] font-medium leading-[14px] -tracking-[0.03em]">
                  Github
                </span>
              </a>
              <DownloadButton />
            </div>

            <div className="flex items-center gap-2 desktop:hidden">
              <button
                className="p-2 text-text-primary transition-colors hover:text-text-primary/80"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-menu"
                  aria-hidden="true"
                >
                  <path d="M4 5h16"></path>
                  <path d="M4 12h16"></path>
                  <path d="M4 19h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
