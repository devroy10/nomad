"use client";

import { SectionSpacer } from "@/components/section-spacer";
import { CornerDots } from "@/components/ui/corner-dots";
import { HeaderBar } from "@/components/ui/header-bar";

const PROVIDERS = [
  { name: "Anthropic", src: "/provider-icons/anthropic.svg", monochrome: true },
  { name: "OpenAI", src: "/provider-icons/openai.svg", monochrome: true },
  { name: "Gemini", src: "/provider-icons/gemini.svg" },
  { name: "DeepSeek", src: "/provider-icons/deepseek.svg" },
  { name: "OpenRouter", src: "/provider-icons/openrouter.svg", monochrome: true },
];

function ProviderItem({
  name,
  src,
  monochrome,
}: {
  name: string;
  src: string;
  monochrome?: boolean;
}) {
  return (
    <li className="group relative flex flex-col items-center justify-center gap-2.5 border-border border-b py-7 tablet:gap-4 tablet:py-10 desktop:gap-5 desktop:py-[45px]">
      <img
        src={src}
        alt={name}
        className={[
          "h-auto w-auto max-h-5 max-w-[75%] grayscale transition duration-300 group-hover:grayscale-0 tablet:max-h-6",
          monochrome ? "dark:invert" : "dark:invert dark:group-hover:invert-0",
        ].join(" ")}
      />
      <CornerDots />
    </li>
  );
}

/** [ Services ] band: title + AI provider grid. */
export function CodingAgents() {
  return (
    <section className="containers isolate -mt-px flex flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col border-x border-border">
        <div className="isolate ">
          <div className="border-dashed-b">
            <HeaderBar label="[ Services ]" />
          </div>
          <div className="border-dashed-b">
            <div className="mx-auto flex max-w-[1160px] flex-col justify-between gap-1 py-4 tablet:flex-row tablet:items-center tablet:py-5 desktop:py-2">
              <div className="flex max-w-150 flex-col gap-1 tablet:gap-2">
                <div className="-tracking-[0.03em] text-[26px] font-semibold text-text-primary tablet:text-[32px]">
                  Connect any provider.
                </div>
                <div className=" text-[14px] leading-[1.3] -tracking-[0.03em] text-text-tertiary">
                  You are not limited in choosing who provides the intelligence powering your SRE agent
                </div>
              </div>
            </div>
          </div>
          <div className="border-dashed-b">
            <div className="border-border border-t desktop:border-x max-w-[1160px] mx-auto ">
              <ul className="grid grid-cols-3 divide-x divide-border tablet:grid-cols-5">
                {PROVIDERS.map((p) => (
                  <ProviderItem key={p.name} {...p} />
                ))}
              </ul>
            </div>
          </div>
          <SectionSpacer />
        </div>
      </div>
    </section>
  );
}