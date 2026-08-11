import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { HeaderBar } from "@/components/ui/header-bar";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "What is Nomad?",
    a: "Nomad is an autonomous SRE agent for Zerops. It ingests logs via syslog forwarding, detects error bursts, diagnoses root causes with Claude, and applies fixes through the Zerops REST API. Built for the WeMakeDevs x Zerops Hackathon 2026.",
  },
  {
    q: "What can Nomad do?",
    a: "Nomad observes your deployment in real time, opens an incident when a service starts erroring, explains the root cause in plain English, applies a fix when it's safe, and logs every incident to a searchable timeline.",
  },
  {
    q: "Is it free?",
    a: "Yes. Nomad is open source (MIT) and free to use.",
  },
  {
    q: "Is my code private?",
    a: "Yes. Nomad only stores the logs you forward and the incidents it opens. It never reads your source code.",
  },
  {
    q: "Which services can it watch?",
    a: "Any service that forwards logs to Nomad's UDP syslog listener, in this project or another. The demo repo wires up the target service so you can break and heal it right away.",
  },
  {
    q: "Do I need an API key?",
    a: "For Claude-powered diagnosis and chat, yes: set ANTHROPIC_API_KEY. Without it, Nomad still detects anomalies and suggests heuristic fixes.",
  },
  {
    q: "Where does Nomad run?",
    a: "Nomad is a monorepo of Node.js 22 services deployed on Zerops: frontend, api, worker, and a demo target, backed by managed Postgres 18.",
  },
  {
    q: "How do I get started?",
    a: "The demo runs on Zerops with one deploy. To monitor your own project, point its Advanced Observability log forwarding at the worker's syslog listener.",
  },
  {
    q: "Is Nomad related to the nomadic lifestyle?",
    a: "No. Nomad is an autonomous SRE agent for Zerops. The name just fits.",
  },
];

export function Faq() {
  return (
    <div className="containers isolate flex flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col border-x border-border">
        <div className="isolate ">
          <div className="border-dashed-b">
            <HeaderBar label="[ FAQ ]" />
          </div>
          <div>
            <div className="mx-auto max-w-[1160px]">
              <div className="flex flex-col desktop:flex-row">
                <div className="flex flex-1 flex-col justify-between border-dashed-l py-6 pl-7 tablet:py-10">
                  <div className="-tracking-[0.03em] text-[20px] font-medium text-text-primary desktop:max-w-[266px] tablet:text-[32px]">
                    Frequently asked questions.
                  </div>
                  <svg
                    width="225"
                    height="20"
                    viewBox="0 0 225 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden desktop:block"
                  >
                    <path
                      d="M16.8338 0H75L58.1662 20H0L16.8338 0Z"
                      className="fill-surface-3"
                    />
                    <path
                      d="M91.8338 0H150L133.166 20H75L91.8338 0Z"
                      className="fill-surface-2"
                    />
                    <path
                      d="M166.834 0H225L208.166 20H150L166.834 0Z"
                      className="fill-surface-1"
                    />
                  </svg>
                </div>

                <AccordionPrimitive.Root
                  type="single"
                  collapsible
                  defaultValue="item-0"
                  className="flex w-full flex-col border-x border-border border-t desktop:border-t-0 desktop:w-[642px]"
                >
                  {FAQ_ITEMS.map((item, i) => (
                    <AccordionItem
                      key={item.q}
                      value={`item-${i}`}
                      question={item.q}
                      answer={item.a}
                    />
                  ))}
                </AccordionPrimitive.Root>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionItem({
  value,
  question,
  answer,
}: {
  value: string;
  question: string;
  answer: React.ReactNode;
}) {
  return (
    <AccordionPrimitive.Item
      value={value}
      className="group relative border-border pr-8 pl-7.5 transition-colors data-[state=open]:bg-surface-1 not-last:border-b data-[state=open]:dark:bg-text-surface-1"
    >
      <h3 className="flex">
        <AccordionPrimitive.Trigger className="-tracking-[0.03em] flex flex-1 items-center justify-between border border-transparent py-4 text-left text-[14px] font-medium leading-[22px] text-text-tertiary outline-none">
          {question}
        </AccordionPrimitive.Trigger>
      </h3>
      <AccordionPrimitive.Content className="overflow-hidden data-closed:animate-accordion-up data-open:animate-accordion-down">
        <div className="flex h-auto flex-col gap-4 pr-20 pb-4 text-[14px] leading-[22px] -tracking-[0.03em] text-text-tertiary">
          {typeof answer === "string" ? <p>{answer}</p> : answer}
        </div>
      </AccordionPrimitive.Content>
      <Dot className="-translate-x-[2.5px] -translate-y-[2.5px] top-0 left-0" />
      <Dot className="translate-x-[2.5px] -translate-y-[2.5px] top-0 right-0" />
      <Dot className="-translate-x-[2.5px] translate-y-[2.5px] bottom-0 left-0 data-open:z-30" />
      <Dot className="translate-x-[2.5px] translate-y-[2.5px] bottom-0 right-0 data-open:z-30" />
    </AccordionPrimitive.Item>
  );
}

function Dot({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute size-1 bg-border-point transition-colors z-20 group-data-[state=open]:bg-text-tertiary",
        className,
      )}
    />
  );
}
