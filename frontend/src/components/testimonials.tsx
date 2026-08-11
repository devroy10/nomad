"use client";

import Image from "next/image";
import { useRef } from "react";
import { HeaderBar } from "@/components/ui/header-bar";
import { SectionSpacer } from "@/components/section-spacer";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "Nomad just shipped at the Zerops hackathon. You could be the first to connect a project and watch it heal itself.",
    img: "/avatars/avatar-1.png",
    name: "You",
    handle: "be_the_first",
    link: "https://www.linkedin.com",
  },
  {
    quote: "You could be the first to break a service on purpose and the first to see it caught, explained, and fixed.",
    img: "/avatars/avatar-2.png",
    name: "You",
    handle: "be_the_first",
    link: "https://x.com",
  },
{
    quote:
      "No reviews yet, and that's the point. You could be the first to write one.",
    img: "/avatars/avatar-3.png",
    name: "You",
    handle: "be_the_first",
    link: "https://www.linkedin.com",
  },
  {
    quote:
      "You could be the first to sleep through a 2am restart. Nomad handles the boring part.",
    img: "/avatars/avatar-4.png",
    name: "You",
    handle: "be_the_first",
    link: "https://www.producthunt.com",
  },
];

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="containers isolate flex flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col border-x border-border">
        <div className="isolate ">
          <div className="border-dashed-b">
            <HeaderBar label="[ Early Days ]" />
          </div>
          <div className="border-dashed-b">
            <div className="mx-auto max-w-[1160px]">
              <div className="flex items-center justify-between border-r border-border border-dashed-l pl-7">
                <div className="-tracking-[0.03em] text-[16px] font-medium leading-[1.3] text-text-primary tablet:text-[32px]">
                  No reviews yet. You could be the first.
                </div>
                <div className="flex">
                  <button
                    onClick={() => scroll(-1)}
                    aria-label="Scroll left"
                    className="group cursor-pointer border-b border-l border-border px-5 py-5 tablet:py-12"
                  >
                    <Arrow className="rotate-180" />
                  </button>
                  <button
                    onClick={() => scroll(1)}
                    aria-label="Scroll right"
                    className="group cursor-pointer border-b border-l border-border px-5 py-5 tablet:py-12"
                  >
                    <Arrow />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-dashed-b">
            <div className="relative mx-auto max-w-[1160px]">
              <div
                ref={scrollerRef}
                className="relative -mt-px max-w-full overflow-x-hidden whitespace-nowrap border"
                style={{ scrollbarWidth: "none" }}
              >
                <div className="flex w-max">
                  {TESTIMONIALS.map((p, i) => (
                    <TestimonialCard key={i} {...p} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <SectionSpacer />
        </div>
      </div>
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "size-6 text-bg-surface-4 transition-colors group-hover:text-text-tertiary",
        className,
      )}
    >
      <path
        d="M12.25 7H1.75"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 3.5L12.25 7L8.75 10.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TestimonialCard({
  quote,
  img,
  name,
  handle,
  link,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="relative w-80 shrink-0 border-r border-border">
      <div className=" h-60 px-[22px] pt-10 text-[15px] font-medium leading-[1.35] whitespace-pre-wrap -tracking-[0.03em] text-text-tertiary tablet:h-72 tablet:pt-[54px]">
        {quote}
      </div>
      <div className="flex border-t border-border">
        <div className="relative size-13 border-r border-border">
          <Image
            alt={name}
            fill
            sizes="52px"
            className="object-cover"
            src={img}
          />
        </div>
        <div className="flex flex-col justify-center gap-0.5 pl-3">
          <div className="-tracking-[0.03em] text-[14px] font-medium leading-[1.3] text-text-primary">
            {name}
          </div>
          <div className="-tracking-[0.03em] text-[12px] font-medium leading-[1.3] truncate text-text-tertiary">
            @{handle}
          </div>
        </div>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${name}'s post`}
        className="absolute right-3 top-3 text-text-tertiary transition-colors hover:text-text-primary"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.16663 1.75H12.25V5.83333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.25 8.5965V11.375C12.25 11.8583 11.8583 12.25 11.375 12.25H2.625C2.14175 12.25 1.75 11.8583 1.75 11.375V2.625C1.75 2.14175 2.14175 1.75 2.625 1.75H5.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.5249 6.4752L11.9874 2.0127"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
