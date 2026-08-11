// Static pillar-card illustrations for Nomad — the Agentic SRE for Zerops.
// Each visual tells one step of the mission:
//   - TasksIllustration      -> Detect    (parallel syslog scanners)
//   - BrowserIllustration    -> Diagnose  (incidents dashboard + Claude diagnosis)
//   - AutomationsIllustration-> Forwarding (log forwarding to the Nomad listener)
//   - ByoiIllustration       -> Human in the Loop (remediation with approval gate)
//
// Canvas is 738x544, scaled to the card via container-type:inline-size + cqw.

import type { ReactNode } from "react";

function Frame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden [container-type:inline-size]">
          <div
            style={{ transform: "scale(tan(atan2(100cqw, 738px)))" }}
            className="relative h-[544px] w-[738px] origin-top-left overflow-clip font-commit-mono antialiased [font-synthesis:none] bg-[#F7FBFC] dark:bg-[#0F1F22]"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const RING =
  "absolute left-1/2 -translate-x-1/2 rounded-full border border-[#EEF1F3] opacity-70 dark:border-[#1A2127]";
const FADE =
  "absolute inset-x-0 bottom-0 bg-gradient-to-b from-[#F7FBFC00] to-[#F7FBFC] dark:from-[#0F1F2200] dark:to-[#0F1F22]";
const MONO = "font-['Menlo-Regular','Menlo',system-ui,sans-serif]";

function RadarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.8"
      className={`shrink-0 stroke-[#8A9499] dark:stroke-[#6E7B81] ${className}`}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v9l6 3" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Dots() {
  return (
    <div className="flex shrink-0 items-center gap-[5px]">
      <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#FE6056]" />
      <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#FDBC25]" />
      <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#20C83D]" />
    </div>
  );
}

const HEADER =
  "flex h-[31px] items-center justify-between border-b border-[#EEF1F3] bg-[#F5F6F7] px-[11px] dark:border-[#212A2D] dark:bg-[#212A2D]";

function LogLine({
  time,
  level,
  message,
  levelClass,
}: {
  time: string;
  level: string;
  message: string;
  levelClass: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="shrink-0 text-[#B8C2C8] dark:text-[#586468]">{time}</span>
      <span className={`shrink-0 ${levelClass}`}>{level}</span>
      <span className="truncate text-[#26323B] dark:text-[#EEF0F2]">{message}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detect — three detectors scanning service syslog streams in parallel */
/* ------------------------------------------------------------------ */

export function TasksIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className={`${RING} top-[232px] h-[560px] w-[560px]`} />
      <div className={`${RING} top-[232px] h-[360px] w-[360px]`} />
      <div className={`${FADE} h-[120px]`} />

      <div className="absolute left-1/2 top-[78px] inline-flex -translate-x-1/2 items-center gap-[9px] rounded-[9px] border border-[#E8EBEE] bg-white px-[14px] py-[9px] shadow-[0_6px_16px_-6px_#B4C2CB8C] dark:border-[#212A2D] dark:bg-[#1A2127] dark:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.45)]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          className="shrink-0 stroke-[#1F2931] dark:stroke-[#EEF0F2]"
        >
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M6 9v6" />
          <circle cx="18" cy="6" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
        <span className="text-[12px] leading-4 -tracking-[0.02em] text-[#1F2931] dark:text-[#EEF0F2]">
          detector
        </span>
        <span className="h-[13px] w-px shrink-0 bg-[#E8EBEE] dark:bg-[#2A363B]" />
        <span className="text-[11px] leading-[14px] -tracking-[0.02em] text-[#9AA6AB] dark:text-[#586468]">
          every 15s
        </span>
      </div>

      <svg
        width="738"
        height="74"
        viewBox="0 0 738 74"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-0 top-[114px]"
      >
        <g className="stroke-[#CBD4DB] dark:stroke-[#314146]" fill="none" strokeWidth="1.4" strokeDasharray="3 4">
          <path d="M132 8 V64" />
          <path d="M369 8 V64" />
          <path d="M606 8 V64" />
        </g>
        <circle cx="369" cy="4" r="3.2" className="fill-[#1F2931] [transform-box:fill-box] origin-center dark:fill-[#EEF0F2]" />
        <circle cx="132" cy="69" r="3.4" strokeWidth="1.4" className="fill-white stroke-[#CBD4DB] dark:fill-[#1A2127] dark:stroke-[#314146]" />
        <circle cx="369" cy="69" r="3.4" strokeWidth="1.4" className="fill-white stroke-[#CBD4DB] dark:fill-[#1A2127] dark:stroke-[#314146]" />
        <circle cx="606" cy="69" r="3.4" strokeWidth="1.4" className="fill-white stroke-[#CBD4DB] dark:fill-[#1A2127] dark:stroke-[#314146]" />
      </svg>

      <div
        className="absolute top-[188px] w-[224px] overflow-clip rounded-[11px] border border-[#E8EBEE] bg-white shadow-[0_10px_26px_-10px_#B0BEC8A6] dark:border-[#212A2D] dark:bg-[#1A2127] dark:shadow-[0_10px_26px_-10px_rgba(0,0,0,0.5)]"
        style={{ left: "20px" }}
      >
        <div className={HEADER}>
          <div className="flex min-w-0 items-center gap-[9px]">
            <Dots />
            <span className="truncate text-[11px] leading-[13px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
              api
            </span>
          </div>
          <RadarIcon />
        </div>
        <div className="flex flex-col gap-1.5 bg-[#FBFDFE] px-3 pb-3.5 pt-3 text-[12px] leading-[14px] -tracking-[0.02em] dark:bg-[#1A2127]">
          <LogLine time="23:14:02" level="ERR" message="502 upstream" levelClass="text-[#C26157] dark:text-[#D97757]" />
          <LogLine time="23:14:07" level="ERR" message="502 upstream" levelClass="text-[#C26157] dark:text-[#D97757]" />
          <LogLine time="23:14:12" level="ERR" message="conn reset" levelClass="text-[#C26157] dark:text-[#D97757]" />
          <LogLine time="23:14:17" level="ERR" message="502 upstream" levelClass="text-[#C26157] dark:text-[#D97757]" />
          <LogLine time="23:14:22" level="ERR" message="502 upstream" levelClass="text-[#C26157] dark:text-[#D97757]" />
          <div className="flex items-center gap-[5px] text-[#C26157] dark:text-[#D97757]">
            <span className="inline-block text-[11px]">●</span>
            <span className="text-[12px]">burst 5/60s · INC-0012</span>
          </div>
        </div>
      </div>

      <div
        className="absolute top-[188px] w-[224px] overflow-clip rounded-[11px] border border-[#E8EBEE] bg-white shadow-[0_10px_26px_-10px_#B0BEC8A6] dark:border-[#212A2D] dark:bg-[#1A2127] dark:shadow-[0_10px_26px_-10px_rgba(0,0,0,0.5)]"
        style={{ left: "257px" }}
      >
        <div className={HEADER}>
          <div className="flex min-w-0 items-center gap-[9px]">
            <Dots />
            <span className="truncate text-[11px] leading-[13px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
              worker
            </span>
          </div>
          <RadarIcon />
        </div>
        <div className="flex flex-col gap-1.5 bg-[#FBFDFE] px-3 pb-3.5 pt-3 text-[12px] leading-[14px] -tracking-[0.02em] dark:bg-[#1A2127]">
          <LogLine time="23:14:05" level="INFO" message="job #4412 ok" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <LogLine time="23:14:12" level="INFO" message="job #4413 ok" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <LogLine time="23:14:19" level="INFO" message="job #4414 ok" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <LogLine time="23:14:26" level="INFO" message="job #4415 ok" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <LogLine time="23:14:33" level="INFO" message="job #4416 ok" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <div className="flex items-center gap-[5px] text-[#2A9D54] dark:text-[#98E491]">
            <span className="inline-block text-[11px]">●</span>
            <span className="text-[12px]">healthy · 0 anomalies</span>
          </div>
        </div>
      </div>

      <div
        className="absolute top-[188px] w-[224px] overflow-clip rounded-[11px] border border-[#E8EBEE] bg-white shadow-[0_10px_26px_-10px_#B0BEC8A6] dark:border-[#212A2D] dark:bg-[#1A2127] dark:shadow-[0_10px_26px_-10px_rgba(0,0,0,0.5)]"
        style={{ left: "494px" }}
      >
        <div className={HEADER}>
          <div className="flex min-w-0 items-center gap-[9px]">
            <Dots />
            <span className="truncate text-[11px] leading-[13px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
              target
            </span>
          </div>
          <RadarIcon />
        </div>
        <div className="flex flex-col gap-1.5 bg-[#FBFDFE] px-3 pb-3.5 pt-3 text-[12px] leading-[14px] -tracking-[0.02em] dark:bg-[#1A2127]">
          <LogLine time="23:14:03" level="INFO" message="GET / 200" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <LogLine time="23:14:11" level="INFO" message="GET /health" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <LogLine time="23:14:19" level="INFO" message="POST /check" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <LogLine time="23:14:27" level="INFO" message="GET / 200" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <LogLine time="23:14:35" level="INFO" message="GET / 200" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          <div className="flex items-center gap-[5px] text-[#2A9D54] dark:text-[#98E491]">
            <span className="inline-block text-[11px]">●</span>
            <span className="text-[12px]">healthy · 0 anomalies</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Diagnose — incidents dashboard with the Claude diagnosis panel       */
/* ------------------------------------------------------------------ */

export function BrowserIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div aria-hidden className="absolute left-[52px] top-[26px] h-[340px] w-[340px]">
        <div className="absolute inset-0 rounded-full border-[1.5px] border-[#DFE5EA] dark:border-[#28343A]" />
        <div className="absolute left-1/2 top-[15%] h-[13%] w-[71%] -translate-x-1/2 rounded-[50%] border-[1.5px] border-[#DFE5EA] dark:border-[#28343A]" />
        <div className="absolute left-1/2 top-1/2 h-[16%] w-full -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[1.5px] border-[#DFE5EA] dark:border-[#28343A]" />
        <div className="absolute bottom-[15%] left-1/2 h-[13%] w-[71%] -translate-x-1/2 rounded-[50%] border-[1.5px] border-[#DFE5EA] dark:border-[#28343A]" />
      </div>
      <div className={`${FADE} z-10 h-[110px]`} />

      <div className="absolute left-[130px] top-[168px] flex w-[660px] flex-col overflow-clip rounded-[14px_0_0_0] border border-[#E8EBEE] bg-white shadow-[0_10px_26px_-10px_#B0BEC8A6] dark:border-[#212A2D] dark:bg-[#1A2127] dark:shadow-[0_10px_26px_-10px_rgba(0,0,0,0.5)]">
        <div className="flex h-10 items-center gap-[7px] bg-white px-4 dark:bg-[#1A2127]">
          <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#E1E6EA] dark:bg-[#2A363B]" />
          <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#E1E6EA] dark:bg-[#2A363B]" />
          <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#E1E6EA] dark:bg-[#2A363B]" />
        </div>

        <div className="flex items-stretch">
          <div className="flex w-[156px] shrink-0 flex-col gap-1.5 border-r border-[#EEF1F3] bg-[#F5F6F7] px-2.5 pb-[22px] pt-3.5 dark:border-[#212A2D] dark:bg-[#212A2D]">
            <div className="px-2 pb-1.5 text-[11px] leading-[14px] tracking-[0.08em] text-[#B8C2C8] dark:text-[#46545B]">
              INCIDENTS
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[13px] leading-4 -tracking-[0.02em] rounded-[7px] border border-[#C26157]/35 bg-white text-[#C26157] dark:border-[#D97757]/35 dark:bg-[#1A2127] dark:text-[#D97757]">
              <span className="inline-block text-[9px]">●</span>INC-0012 · api
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[13px] leading-4 -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              <span className="inline-block text-[9px] text-[#2A9D54] dark:text-[#98E491]">●</span>INC-0009
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-[13px] leading-4 -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              <span className="inline-block text-[9px] text-[#2A9D54] dark:text-[#98E491]">●</span>INC-0004
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-[#FBFDFE] dark:bg-[#1A2127]">
            <div className="flex h-10 items-stretch border-b border-[#EEF1F3] bg-[#F5F6F7] dark:border-[#212A2D] dark:bg-[#212A2D]">
              <div className="flex items-center gap-[7px] border-b-2 border-r border-b-[#C26157] border-r-[#EEF1F3] bg-[#FBFDFE] px-4 dark:border-b-[#D97757] dark:border-r-[#212A2D] dark:bg-[#1A2127]">
                <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="shrink-0 stroke-[#8A9499] dark:stroke-[#6E7B81]">
                  <circle cx="12" cy="12" r="9" />
                  <ellipse cx="12" cy="12" rx="4" ry="9" />
                  <path d="M3 12h18" />
                </svg>
                <span className="text-[13px] leading-4 -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
                  Nomad | Incidents
                </span>
              </div>
              <div className="flex items-center border-r border-[#EEF1F3] px-4 dark:border-[#212A2D]">
                <span className="text-[13px] leading-4 -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
                  Diagnosis
                </span>
              </div>
            </div>

            <div className="flex h-8 items-center gap-2.5 border-b border-[#EEF1F3] px-3 dark:border-[#212A2D]">
              <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2.4" className="shrink-0 stroke-[#B8C2C8] dark:stroke-[#46545B]">
                <path d="M15 5l-7 7 7 7" />
              </svg>
              <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2.4" className="shrink-0 stroke-[#B8C2C8] dark:stroke-[#46545B]">
                <path d="M9 5l7 7-7 7" />
              </svg>
              <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" className="shrink-0 stroke-[#8A9499] dark:stroke-[#6E7B81]">
                <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" />
              </svg>
              <span className="ml-1 text-[12px] leading-[15px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
                http://localhost:3000/incidents
              </span>
            </div>

            <div className="h-[264px] overflow-clip">
              <div className="flex gap-4 px-[18px] pb-6 pt-4">
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[5px] border border-[#C26157]/40 px-1.5 py-[2px] text-[10px] leading-[13px] -tracking-[0.02em] text-[#C26157] dark:border-[#D97757]/40 dark:text-[#D97757]">
                      OPEN
                    </span>
                    <span className="text-[15px] leading-[18px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
                      INC-0012
                    </span>
                    <span className="text-[13px] leading-4 -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
                      api · 5 errors in 60s
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-[12px] leading-[15px] -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
                    <span>opened Aug 10, 18:02:11 · source syslog</span>
                    <span>window 60s · severity critical · stream api</span>
                  </div>
                  <div className="mt-1.5 flex flex-col gap-1.5 text-[12px] leading-[15px] -tracking-[0.02em]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="shrink-0 text-[#B8C2C8] dark:text-[#586468]">23:14:02</span>
                      <span className="shrink-0 text-[#C26157] dark:text-[#D97757]">ERR</span>
                      <span className="text-[#26323B] dark:text-[#EEF0F2]">502 upstream timeout</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="shrink-0 text-[#B8C2C8] dark:text-[#586468]">23:14:07</span>
                      <span className="shrink-0 text-[#C26157] dark:text-[#D97757]">ERR</span>
                      <span className="text-[#26323B] dark:text-[#EEF0F2]">502 upstream timeout</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="shrink-0 text-[#B8C2C8] dark:text-[#586468]">23:14:12</span>
                      <span className="shrink-0 text-[#C26157] dark:text-[#D97757]">ERR</span>
                      <span className="text-[#26323B] dark:text-[#EEF0F2]">connection reset</span>
                    </div>
                  </div>
                </div>

                <div className="flex w-[190px] shrink-0 flex-col gap-2 rounded-[9px] border border-[#E8EBEE] bg-white p-2.5 dark:border-[#2A363B] dark:bg-[#212A2D]">
                  <span className="text-[10px] leading-[13px] tracking-[0.08em] text-[#B8C2C8] dark:text-[#46545B]">
                    DIAGNOSIS · claude
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] leading-[13px] text-[#8A9499] dark:text-[#6E7B81]">root cause</span>
                    <span className="text-[12px] leading-[15px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
                      Node 22 heap limit — OOM during request spike
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] leading-[13px] text-[#8A9499] dark:text-[#6E7B81]">suggested fix</span>
                    <span className="text-[12px] leading-[15px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
                      restart api · roll back to 2.4.1
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] leading-[13px] text-[#8A9499] dark:text-[#6E7B81]">confidence</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-[7px] w-full rounded-full bg-[#EEF1F3] dark:bg-[#2A363B]">
                        <div className="h-[7px] w-[94%] rounded-full bg-[#2A9D54] dark:bg-[#98E491]" />
                      </div>
                      <span className="text-[11px] leading-[14px] text-[#2A9D54] dark:text-[#98E491]">94%</span>
                    </div>
                  </div>
                  <span className="mt-auto inline-flex h-[26px] items-center justify-center rounded-[6px] bg-[#26323B] text-[11px] leading-[13px] -tracking-[0.02em] text-white dark:bg-[#EEF0F2] dark:text-[#1A2127]">
                    review fix
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Forwarding — syslog forwarding rule pointing at the Nomad listener   */
/* ------------------------------------------------------------------ */

export function AutomationsIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className={`${RING} top-[252px] h-[560px] w-[560px]`} />
      <div className={`${RING} top-[252px] h-[360px] w-[360px]`} />
      <div className={`${FADE} h-[110px]`} />

      <div className="absolute left-[93px] top-[104px] flex w-[552px] flex-col overflow-clip rounded-[14px] border border-[#E8EBEE] bg-white shadow-[0_10px_26px_-10px_#B0BEC8A6] dark:border-[#212A2D] dark:bg-[#1A2127] dark:shadow-[0_10px_26px_-10px_rgba(0,0,0,0.5)]">
        <div className="flex h-12 items-center border-b border-[#EEF1F3] bg-[#F5F6F7] px-[18px] dark:border-[#212A2D] dark:bg-[#212A2D]">
          <span className="text-[12px] leading-[15px] tracking-[0.1em] text-[#B8C2C8] dark:text-[#46545B]">
            LOG FORWARDING
          </span>
        </div>

        <div className="flex flex-col gap-4 bg-[#FBFDFE] px-6 pb-[26px] pt-[22px] dark:bg-[#1A2127]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-[19px] w-8 shrink-0 items-center justify-end rounded-full bg-[#26323B] p-0.5 dark:bg-[#EEF0F2]">
              <span className="h-3.5 w-3.5 rounded-full bg-white dark:bg-[#1A2127]" />
            </span>
            <span className="flex-1 text-[18px] leading-[22px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
              forward syslog → nomad
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                className="shrink-0 stroke-[#26323B] dark:stroke-[#EEF0F2]"
              >
                <path d="M3 12h3l2.5-7 5 14 2.5-7h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[15px] leading-[19px] -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
                UDP 514 · RFC 5424
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["api", "worker", "target"].map((svc) => (
              <span
                key={svc}
                className="inline-flex items-center gap-1.5 rounded-[7px] border border-[#E8EBEE] bg-[#F7FBFC] px-3 py-[5px] text-[14px] leading-[17px] -tracking-[0.02em] text-[#8A9499] dark:border-[#212A2D] dark:bg-[#0F1F22] dark:text-[#6E7B81]"
              >
                <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" className="shrink-0 stroke-[#8A9499] dark:stroke-[#6E7B81]">
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                </svg>
                {svc}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 rounded-[7px] border border-[#E8EBEE] bg-[#F7FBFC] px-3 py-[5px] text-[14px] leading-[17px] -tracking-[0.02em] text-[#8A9499] dark:border-[#212A2D] dark:bg-[#0F1F22] dark:text-[#6E7B81]">
              <RadarIcon className="stroke-[#8A9499] dark:stroke-[#6E7B81]" />
              nomad-listener
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[7px] border bg-[#F7FBFC] px-3 py-[5px] text-[14px] leading-[17px] -tracking-[0.02em] dark:bg-[#0F1F22] border-[#C26157]/45 text-[#C26157] dark:border-[#D97757]/45 dark:text-[#D97757]">
              active
            </span>
          </div>

          <div className="h-px bg-[#EEF1F3] dark:bg-[#212A2D]" />

          <div className="text-[13px] leading-4 -tracking-[0.02em] text-[#B8C2C8] dark:text-[#46545B]">stream</div>
          <div className="flex items-center gap-2.5">
            <span className="inline-block text-[16px] leading-5 text-[#2A9D54] dark:text-[#98E491]">●</span>
            <span className="text-[16px] leading-5 -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
              receiving · 12s
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="inline-block text-[16px] leading-5 text-[#2A9D54] dark:text-[#98E491]">●</span>
            <span className="text-[16px] leading-5 -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              ingested · Aug 10 · 1,204 lines · 0 dropped
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="inline-block text-[16px] leading-5 text-[#2A9D54] dark:text-[#98E491]">●</span>
            <span className="text-[16px] leading-5 -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              parsed · Aug 10 · 1,204 structured
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Human in the Loop — remediation with an explicit approval gate       */
/* ------------------------------------------------------------------ */

export function ByoiIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div data-active="false" className="group [font-synthesis:none] relative flex h-full w-full flex-col overflow-clip bg-[#F7FBFC] antialiased text-xs/4 dark:bg-[#0F1F22]">
        <div className="absolute -top-2.5 -right-5 h-32.5 w-32.5 rounded-[50%] border border-solid border-[#E8EBEE] opacity-[0.5] transition-transform duration-700 ease-out group-hover:scale-110 dark:border-[#1A2127] dark:opacity-[0.3]" />
        <div className="absolute right-1.25 top-3.75 h-21 w-21 rounded-[50%] border border-solid border-[#E8EBEE] opacity-[0.4] transition-transform duration-700 ease-out group-hover:scale-110 dark:border-[#1A2127] dark:opacity-[0.3]" />

        <div className="absolute left-4.5 top-3 flex h-59 w-82.5 flex-col overflow-clip rounded-md border border-solid border-[#E8EBEE] bg-[#F5F6F7] dark:border-[#212A2D] dark:bg-[#1A2127]">
          <div className="flex h-7.5 shrink-0 items-center px-2.5">
            <Dots />
            <div className="pl-3.5">
              <div className="w-max tracking-[-0.03em] text-[8px]/2.5 text-[#384B50] dark:text-[#EEF0F2]">
                remediate.sh
              </div>
            </div>
          </div>
          <div className="h-px w-full shrink-0 bg-[#E8EBEE] dark:bg-[#212A2D]" />

          <div className="grow shrink basis-[0%] relative overflow-clip bg-[#F7FBFC] dark:bg-[#0F1F22]">
            <div className="flex flex-col gap-1.25 p-3.5">
              <div className="flex items-baseline gap-1.5">
                <div className={`${MONO} text-[9px]/3 text-[#CBD4DB] dark:text-[#586468]`}>$</div>
                <div className={`${MONO} text-[9px]/3 text-[#26323B] dark:text-[#EEF0F2]`}>nomad remediate INC-0012</div>
              </div>
              <div className={`${MONO} text-[9px]/3 text-[#CBD4DB] dark:text-[#586468]`}>
                → incident api · 5 errors in 60s · severity critical
              </div>
              <div className={`${MONO} text-[9px]/3 text-[#CBD4DB] dark:text-[#586468]`}>
                → diagnosis: <span className="text-[#26323B] dark:text-[#EEF0F2]">OOM · Node 22 heap limit</span>
              </div>
              <div className={`${MONO} text-[9px]/3 text-[#CBD4DB] dark:text-[#586468]`}>
                → suggested fix: <span className="text-[#26323B] dark:text-[#EEF0F2]">restart api</span> · conf{" "}
                <span className="text-[#C45A2D] dark:text-[#D97757]">0.94</span>
              </div>
              <div className={`${MONO} text-[9px]/3 text-[#CBD4DB] dark:text-[#586468]`}>
                → auto-approve: <span className="text-[#C45A2D] dark:text-[#D97757]">disabled</span> · awaiting operator
              </div>
              <div className={`${MONO} text-[9px]/3 text-[#CBD4DB] dark:text-[#586468]`}>
                <span className="text-[#3A8A32] dark:text-[#98E491]">✓</span>{" "}
                {"approved by operator · applying via Zerops REST"}
              </div>
              <div className={`${MONO} text-[9px]/3 text-[#CBD4DB] dark:text-[#586468] pl-3.5`}>
                POST /api/rest/v1/service/api/restart
              </div>
              <div className={`${MONO} text-[9px]/3 text-[#CBD4DB] dark:text-[#586468] pl-3.5`}>
                <span className="text-[#3A8A32] dark:text-[#98E491]">200 OK</span> · container restarted ·{" "}
                <span className="text-[#C45A2D] dark:text-[#D97757]">6.4s</span>
              </div>
              <div className={`${MONO} text-[9px]/3 text-[#CBD4DB] dark:text-[#586468]`}>
                → <span className="text-[#26323B] dark:text-[#EEF0F2]">INC-0012 resolved</span> ·{" "}
                <span className="text-[#C45A2D] dark:text-[#D97757]">18s</span> total
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <circle cx="5" cy="5" r="5" className="fill-[#3A8A32]/15 dark:fill-[#98E491]/20" />
                <path d="M3 5.2l1.5 1.3L7 3.5" className="stroke-[#3A8A32] dark:stroke-[#98E491]" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className={`${MONO} text-[9px]/3 text-[#3A8A32] dark:text-[#98E491]`}>
                Approved by operator · applied in 18s
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Observe — the syslog listener ingesting RFC 5424 streams             */
/* ------------------------------------------------------------------ */

function SyslogRow({
  time,
  pri,
  host,
  level,
  message,
  levelClass,
}: {
  time: string;
  pri: string;
  host: string;
  level: string;
  message: string;
  levelClass: string;
}) {
  return (
    <div className="flex items-baseline gap-2 text-[13px] leading-[18px] -tracking-[0.02em]">
      <span className="w-[56px] shrink-0 text-[#B8C2C8] dark:text-[#586468]">{time}</span>
      <span className="w-[40px] shrink-0 text-[#C45A2D] dark:text-[#D97757]">{pri}</span>
      <span className="w-[50px] shrink-0 text-[#26323B] dark:text-[#EEF0F2]">{host}</span>
      <span className={`w-[36px] shrink-0 ${levelClass}`}>{level}</span>
      <span className="truncate text-[#8A9499] dark:text-[#6E7B81]">{message}</span>
    </div>
  );
}

const CARD =
  "absolute left-[93px] top-[104px] flex w-[552px] flex-col overflow-clip rounded-[14px] border border-[#E8EBEE] bg-white shadow-[0_10px_26px_-10px_#B0BEC8A6] dark:border-[#212A2D] dark:bg-[#1A2127] dark:shadow-[0_10px_26px_-10px_rgba(0,0,0,0.5)]";
const CARD_HEADER =
  "flex h-12 items-center justify-between border-b border-[#EEF1F3] bg-[#F5F6F7] px-[18px] dark:border-[#212A2D] dark:bg-[#212A2D]";

export function ListenerIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className={`${RING} top-[252px] h-[560px] w-[560px]`} />
      <div className={`${RING} top-[252px] h-[360px] w-[360px]`} />
      <div className={`${FADE} h-[110px]`} />

      <div className={CARD}>
        <div className={CARD_HEADER}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2A9D54] opacity-60 dark:bg-[#98E491]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2A9D54] dark:bg-[#98E491]" />
            </span>
            <span className="text-[12px] leading-[15px] tracking-[0.1em] text-[#B8C2C8] dark:text-[#46545B]">
              SYSLOG LISTENER
            </span>
          </div>
          <span className="text-[12px] leading-[15px] tracking-[0.1em] text-[#B8C2C8] dark:text-[#46545B]">
            UDP 514 · RFC 5424
          </span>
        </div>

        <div className="flex flex-col gap-3.5 bg-[#FBFDFE] px-6 pb-[26px] pt-[22px] dark:bg-[#1A2127]">
          <div className="flex items-center justify-between text-[14px] leading-[17px] -tracking-[0.02em]">
            <span className="text-[#26323B] dark:text-[#EEF0F2]">listening · udp :514</span>
            <span className="text-[#8A9499] dark:text-[#6E7B81]">uptime 12d 4h</span>
          </div>
          <div className="h-px bg-[#EEF1F3] dark:bg-[#212A2D]" />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2 text-[11px] leading-[14px] tracking-[0.08em] text-[#B8C2C8] dark:text-[#46545B]">
              <span className="w-[56px] shrink-0">TIME</span>
              <span className="w-[40px] shrink-0">PRI</span>
              <span className="w-[50px] shrink-0">HOST</span>
              <span className="w-[36px] shrink-0">LVL</span>
              <span>MESSAGE</span>
            </div>
            <SyslogRow time="18:02:11" pri="14" host="api" level="ERR" message="502 upstream timeout" levelClass="text-[#C26157] dark:text-[#D97757]" />
            <SyslogRow time="18:02:12" pri="14" host="api" level="ERR" message="connection reset" levelClass="text-[#C26157] dark:text-[#D97757]" />
            <SyslogRow time="18:02:19" pri="10" host="worker" level="INFO" message="job #4412 ok · 210ms" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
            <SyslogRow time="18:02:27" pri="10" host="target" level="INFO" message="GET / 200 · 41ms" levelClass="text-[#8A9499] dark:text-[#6E7B81]" />
          </div>
          <div className="flex items-center gap-2.5 pt-0.5">
            <span className="inline-block text-[14px] leading-[18px] text-[#2A9D54] dark:text-[#98E491]">●</span>
            <span className="text-[14px] leading-[18px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
              1,204 stored · 0 dropped
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Fix — reviewing a planned remediation before applying it via REST    */
/* ------------------------------------------------------------------ */

export function FixIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className={`${RING} top-[252px] h-[560px] w-[560px]`} />
      <div className={`${RING} top-[252px] h-[360px] w-[360px]`} />
      <div className={`${FADE} h-[110px]`} />

      <div className={CARD}>
        <div className={CARD_HEADER}>
          <span className="text-[12px] leading-[15px] tracking-[0.1em] text-[#B8C2C8] dark:text-[#46545B]">
            FIX REVIEW
          </span>
          <span className="rounded-[6px] border border-[#C26157]/40 px-2 py-[3px] text-[11px] leading-[13px] -tracking-[0.02em] text-[#C26157] dark:border-[#D97757]/40 dark:text-[#D97757]">
            INC-0012
          </span>
        </div>

        <div className="flex flex-col gap-3.5 bg-[#FBFDFE] px-6 pb-[26px] pt-[22px] dark:bg-[#1A2127]">
          <div className="flex items-center gap-2.5">
            <span className="inline-block text-[14px] leading-[18px] text-[#C26157] dark:text-[#D97757]">●</span>
            <span className="text-[16px] leading-[20px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
              api · 5 errors in 60s
            </span>
            <span className="ml-auto text-[14px] leading-[17px] -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              diagnosis · OOM heap
            </span>
          </div>

          <div className="h-px bg-[#EEF1F3] dark:bg-[#212A2D]" />

          <div className="text-[13px] leading-4 tracking-[0.08em] text-[#B8C2C8] dark:text-[#46545B]">
            PLANNED CHANGE
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2 text-[14px] leading-[18px] -tracking-[0.02em]">
              <span className="w-4 shrink-0 text-[#C26157] dark:text-[#D97757]">−</span>
              <span className="text-[#8A9499] dark:text-[#6E7B81]">api 2.4.0 · degraded</span>
            </div>
            <div className="flex items-baseline gap-2 text-[14px] leading-[18px] -tracking-[0.02em]">
              <span className="w-4 shrink-0 text-[#2A9D54] dark:text-[#98E491]">+</span>
              <span className="text-[#26323B] dark:text-[#EEF0F2]">restart api · roll back to 2.4.1</span>
            </div>
          </div>

          <div className="h-px bg-[#EEF1F3] dark:bg-[#212A2D]" />

          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-[34px] items-center justify-center rounded-[8px] bg-[#26323B] px-4 text-[14px] leading-[17px] -tracking-[0.02em] text-white dark:bg-[#EEF0F2] dark:text-[#1A2127]">
              apply fix
            </span>
            <span className="text-[14px] leading-[17px] -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              via Zerops REST
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[14px] leading-[17px] -tracking-[0.02em] text-[#2A9D54] dark:text-[#98E491]">
              <span className="inline-block text-[10px]">●</span>200 OK · 6.4s
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Incident Log — searchable history of diagnosis + fix + outcome       */
/* ------------------------------------------------------------------ */

export function IncidentLogIllustration({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className={`${RING} top-[252px] h-[560px] w-[560px]`} />
      <div className={`${RING} top-[252px] h-[360px] w-[360px]`} />
      <div className={`${FADE} h-[110px]`} />

      <div className={CARD}>
        <div className={CARD_HEADER}>
          <div className="flex items-center gap-2">
            <span className="text-[12px] leading-[15px] tracking-[0.1em] text-[#B8C2C8] dark:text-[#46545B]">
              INCIDENT LOG
            </span>
          </div>
          <div className="flex h-7 items-center gap-2 rounded-[7px] border border-[#E8EBEE] bg-white px-2.5 dark:border-[#2A363B] dark:bg-[#1A2127]">
            <svg aria-hidden width="11" height="11" viewBox="0 0 24 24" fill="none" strokeWidth="2.4" className="shrink-0 stroke-[#B8C2C8] dark:stroke-[#46545B]">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span className="text-[12px] leading-[15px] -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              search history
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-[#FBFDFE] px-6 pb-[26px] pt-[22px] dark:bg-[#1A2127]">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[14px] leading-[18px] -tracking-[0.02em]">
              <span className="inline-block text-[11px] text-[#2A9D54] dark:text-[#98E491]">●</span>
              <span className="font-medium text-[#26323B] dark:text-[#EEF0F2]">INC-0012</span>
              <span className="text-[#8A9499] dark:text-[#6E7B81]">api · OOM heap</span>
              <span className="ml-auto text-[13px] leading-[17px] text-[#2A9D54] dark:text-[#98E491]">18s</span>
            </div>
            <div className="pl-4 text-[13px] leading-[17px] -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              fix: <span className="text-[#26323B] dark:text-[#EEF0F2]">restart api</span> · Aug 10
            </div>
          </div>
          <div className="h-px bg-[#EEF1F3] dark:bg-[#212A2D]" />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[14px] leading-[18px] -tracking-[0.02em]">
              <span className="inline-block text-[11px] text-[#2A9D54] dark:text-[#98E491]">●</span>
              <span className="font-medium text-[#26323B] dark:text-[#EEF0F2]">INC-0009</span>
              <span className="text-[#8A9499] dark:text-[#6E7B81]">worker · config drift</span>
              <span className="ml-auto text-[13px] leading-[17px] text-[#2A9D54] dark:text-[#98E491]">42s</span>
            </div>
            <div className="pl-4 text-[13px] leading-[17px] -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              fix: <span className="text-[#26323B] dark:text-[#EEF0F2]">rollback 2.3.8</span> · Aug 09
            </div>
          </div>
          <div className="h-px bg-[#EEF1F3] dark:bg-[#212A2D]" />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[14px] leading-[18px] -tracking-[0.02em]">
              <span className="inline-block text-[11px] text-[#2A9D54] dark:text-[#98E491]">●</span>
              <span className="font-medium text-[#26323B] dark:text-[#EEF0F2]">INC-0004</span>
              <span className="text-[#8A9499] dark:text-[#6E7B81]">target · port conflict</span>
              <span className="ml-auto text-[13px] leading-[17px] text-[#2A9D54] dark:text-[#98E491]">11s</span>
            </div>
            <div className="pl-4 text-[13px] leading-[17px] -tracking-[0.02em] text-[#8A9499] dark:text-[#6E7B81]">
              fix: <span className="text-[#26323B] dark:text-[#EEF0F2]">heal over private net</span> · Aug 08
            </div>
          </div>
          <div className="flex items-center gap-2.5 pt-0.5">
            <span className="inline-block text-[14px] leading-[18px] text-[#2A9D54] dark:text-[#98E491]">●</span>
            <span className="text-[14px] leading-[18px] -tracking-[0.02em] text-[#26323B] dark:text-[#EEF0F2]">
              3 resolved · every fix + outcome searchable
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );
}
