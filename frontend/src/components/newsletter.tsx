"use client";

import { useState } from "react";
import { DownloadButton } from "@/components/navbar";
import { Wordmark } from "@/components/ui/wordmark";
import { ChevronDown } from "@/components/ui/icons";
import { CornerDots } from "@/components/ui/corner-dots";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="containers isolate flex flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col border-x border-border">
        <div className="isolate">
          <div className="border-dashed-spaced-y">
            <div className="relative mx-auto flex max-w-[1160px] gap-2 border-border py-3 pl-4 tablet:pl-[29px] desktop:border-x">
              <ChevronDown className="size-5 tablet:size-6" muted />
              <ChevronDown className="size-5 tablet:size-6" muted />
              <ChevronDown className="size-5 tablet:size-6" muted />
              <div className="bg-border absolute left-0 right-0 top-0 z-20 h-px" />
              <div className="bg-border absolute bottom-0 left-0 right-0 z-20 h-px" />
              <CornerDots />
            </div>
          </div>
          <div className="border-dashed-b">
            <div className="relative mx-auto flex max-w-[1160px] flex-col items-center border-x border-border py-14 tablet:py-20 desktop:py-25">
              <div className="mb-1 -tracking-[0.03em] text-[26px] leading-[1.3] text-text-tertiary tablet:text-[32px] desktop:text-[40px]">
                Be the first to try
              </div>
              <Wordmark className="mb-8 h-[34.1px] w-[140px] tablet:mb-12 tablet:h-[48.8px] tablet:w-[200px] desktop:h-[62px] desktop:w-[254px]" />
              <DownloadButton />
              <div className="mt-6 w-full max-w-[520px] px-4 tablet:mt-8">
                <div className="border border-border bg-surface-1 p-4 tablet:p-5">
                  <div className="mb-3 text-center">
                    <p className=" -tracking-[0.03em] text-[14px] font-medium leading-5 text-text-primary">
                      Join the waitlist
                    </p>
                    <p className="mt-1  -tracking-[0.03em] text-[13px] leading-5 text-text-quaternary">
                      Early access invites go out as we open up. Be first in line.
                    </p>
                  </div>
                  {done ? (
                    <p className=" text-center text-[14px] leading-5 text-accent-primary">
                      You're on the waitlist. Welcome aboard!
                    </p>
                  ) : (
                    <form
                      className="flex flex-col gap-2 tablet:flex-row"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setDone(true);
                      }}
                    >
                      <input
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="linus@kernel.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className=" min-w-0 flex-1 -tracking-[0.03em] border border-border bg-bg-primary px-3 py-2.5 text-[14px] leading-5 text-text-primary outline-none transition-colors placeholder:text-text-tertiary/50 focus:border-text-tertiary/60"
                        name="email"
                      />
                      <button
                        type="submit"
                        className="inline-flex min-w-[136px] items-center justify-center gap-2 bg-text-primary px-4 py-2.5  -tracking-[0.03em] text-[14px] font-medium leading-5 text-bg-primary transition-colors hover:bg-text-primary/80"
                      >
                        Join the waitlist
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
