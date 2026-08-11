"use client";

// Nomad remediation-loop diagram: a status bar, a network diagram (Zerops
// hub + service nodes + dashed routes), a progress meter, and a remediation
// step list. The hub carries the Zerops logo. All colors are theme tokens so
// the component reads correctly in both light and dark modes.

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* Zerops logo (embedded, drawn white so it reads on the accent hub)   */
/* ------------------------------------------------------------------ */

function ZeropsLogo() {
  return (
    <g transform="translate(319 210) scale(0.068) translate(-500 -500)">
      <path
        d="M482.657 193.198L271.239 274.001C262.02 277.616 254.106 283.928 248.533 292.113C242.959 300.298 239.985 309.974 240 319.876V523.3L337.161 467.463V353.083L499.998 290.605V190C494.072 190.013 488.198 191.096 482.657 193.198Z"
        className="fill-white/95"
      />
      <path
        d="M338.883 648.749L499.998 555.892V443.727L251.069 587.254C247.718 589.218 244.936 592.019 242.995 595.382C241.054 598.746 240.022 602.557 240 606.441V681.587C240.084 691.405 243.103 700.974 248.671 709.062C254.238 717.149 262.098 723.386 271.239 726.97L482.657 807.773C488.198 809.875 494.072 810.958 499.998 810.971V710.366L338.883 648.749Z"
        className="fill-white/95"
      />
      <path
        d="M749.667 411.749C752.844 409.929 755.477 407.294 757.294 404.115C759.11 400.936 760.044 397.33 759.998 393.669V319.876C760.013 309.974 757.039 300.297 751.466 292.113C745.892 283.928 737.978 277.616 728.759 274.001L517.218 193.198C511.716 191.111 505.885 190.028 500 190V290.605L659.885 352.099L500 444.218V556.383L749.667 411.749Z"
        className="fill-white/80"
      />
      <path
        d="M517.218 807.773L728.759 726.969C737.901 723.386 745.761 717.149 751.328 709.061C756.895 700.973 759.915 691.405 759.998 681.587V476.072L662.837 532.155V648.134L500 710.366V810.971C505.885 810.943 511.716 809.86 517.218 807.773Z"
        className="fill-white/80"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Typing text                                                         */
/* ------------------------------------------------------------------ */

function useTypewriter(messages: string[], typeMs = 46, deleteMs = 20, holdMs = 900) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = messages[msgIndex];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (chars < current.length) {
        t = setTimeout(() => setChars((c) => c + 1), typeMs);
      } else {
        t = setTimeout(() => setDeleting(true), holdMs);
      }
    } else {
      if (chars > 0) {
        t = setTimeout(() => setChars((c) => c - 1), deleteMs);
      } else {
        setDeleting(false);
        setMsgIndex((i) => (i + 1) % messages.length);
        return;
      }
    }
    return () => clearTimeout(t);
  }, [chars, deleting, msgIndex, messages, typeMs, deleteMs, holdMs]);

  return messages[msgIndex].slice(0, chars);
}

/* ------------------------------------------------------------------ */
/* Service node card (folded corner)                                   */
/* ------------------------------------------------------------------ */

function ServiceCard({ x, y, label, online }: { x: number; y: number; label: string; online: boolean }) {
  const w = 44;
  const h = 52;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 2 Q0 0 2 0 L${w - 10} 0 L${w} 10 L${w} ${h - 2} Q${w} ${h} ${w - 2} ${h} L2 ${h} Q0 ${h} 0 ${h - 2} Z`}
        className="fill-surface-2 stroke-border-point"
        strokeWidth="1"
      />
      <path
        d={`M${w - 10} 0 L${w} 10 L${w - 10} 10 Z`}
        className="fill-surface-3 stroke-border-point"
        strokeWidth="1"
      />
      <circle
        cx={w / 2}
        cy={9}
        r="2.4"
        className={online ? "fill-accent-primary" : "fill-accent-secondary"}
      />
      <text
        x={w / 2}
        y={h / 2 + 3.5}
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="10"
        className="fill-text-primary"
        letterSpacing="-0.2"
      >
        {label}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Network diagram SVG                                                 */
/* ------------------------------------------------------------------ */

// Symmetric dashed routes with the Zerops hub at the center. Service nodes
// dock on the routes and feed logs toward the hub.
const ROUTES = [
  "M40 90 L196 90",
  "M40 330 L196 330",
  "M439 90 L595 90",
  "M439 330 L595 330",
  "M41 210 L263 210",
  "M201 190 L435 190",
  "M201 230 L435 230",
  "M371 210 L593 210",
  "M199 92 L199 182",
  "M199 230 L199 320",
  "M439 92 L439 182",
  "M439 230 L439 320",
];

const SQUARES = [
  [36, 87],
  [36, 207],
  [36, 327],
  [596, 87],
  [596, 207],
  [596, 327],
];

function NetworkDiagram() {
  const vLines = Array.from({ length: 31 }, (_, i) => 19 + i * 20);
  const hLines = Array.from({ length: 19 }, (_, i) => 24 + i * 20);

  return (
    <svg
      viewBox="0 0 640 400"
      xmlns="http://www.w3.org/2000/svg"
      className="block size-full bg-surface-1"
    >
      {/* grid */}
      <g className="stroke-text-quaternary" strokeWidth="1" opacity="0.08">
        {vLines.map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={400} />
        ))}
        {hLines.map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={640} y2={y} />
        ))}
      </g>

      {/* dashed routes */}
      <g className="stroke-accent-primary" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4">
        {ROUTES.map((d) => (
          <path key={d} d={d} fill="none" />
        ))}
      </g>

      {/* endpoint squares */}
      <g className="fill-accent-primary">
        {SQUARES.map(([x, y]) => (
          <rect key={`${x},${y}`} x={x} y={y} width="6" height="6" />
        ))}
      </g>

      {/* service nodes docked on the routes */}
      <g>
        <ServiceCard x={140} y={62} label="worker" online />
        <ServiceCard x={140} y={182} label="api" online />
        <ServiceCard x={140} y={302} label="db" online />
        <ServiceCard x={460} y={182} label="target" online={false} />
      </g>

      {/* central hub */}
      <g>
        <circle cx="319" cy="210" r="66" className="stroke-accent-primary" strokeWidth="1" opacity="0.15" />
        <circle cx="319" cy="210" r="60" className="fill-accent-primary dark:fill-[#27857d]" />
        <ZeropsLogo />
      </g>

      {/* status pill under hub */}
      <g transform="translate(239 290)">
        <rect width="160" height="20" rx="2" className="fill-surface-1 stroke-accent-primary" strokeWidth="2" />
        <text
          x="80"
          y="13.5"
          textAnchor="middle"
          fontFamily="Geist Mono, monospace"
          fontSize="10.5"
          className="fill-text-primary"
          letterSpacing="0.4"
        >
          INCIDENT #0142
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Remediation step icon + row                                         */
/* ------------------------------------------------------------------ */

function StepIcon({ online }: { online: boolean }) {
  return (
    <svg width="11" height="14" viewBox="0 0 12 15" fill="none" className="shrink-0">
      <path
        d="M1 1.5 C1 0.9 1.5 0.5 2.1 0.5 H8 L11 3.5 V13 C11 13.6 10.6 14 10 14 H2.1 C1.5 14 1 13.6 1 13 Z"
        className="fill-surface-2 stroke-border-point"
        strokeWidth="0.8"
      />
      <path d="M8 0.5 L11 3.5 H8.6 C8.2 3.5 8 3.3 8 2.9 Z" className="fill-surface-3 stroke-border-point" strokeWidth="0.8" />
      <circle cx="6" cy="9.5" r="1.7" className={online ? "fill-accent-primary" : "fill-accent-secondary"} />
    </svg>
  );
}

function StepRow({
  name,
  action,
  done,
  healthy,
  delay,
}: {
  name: string;
  action: string;
  done: boolean;
  healthy: boolean;
  delay: number;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-border px-6 py-[7px] transition-all duration-500",
        show ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
      )}
    >
      <StepIcon online={done} />
      <span className="font-mono text-[11.2px] text-text-primary">{name}</span>
      <span className="font-mono text-[11px] text-text-quaternary">{action}</span>
      <span
        className={cn(
          "ml-auto font-mono text-[11px]",
          done ? "text-accent-primary" : "text-text-quaternary",
        )}
      >
        {done ? "Applied" : "Ready"}
      </span>
      <span className="flex w-24 items-center gap-1.5 font-mono text-[11px] text-text-primary">
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: healthy ? "var(--accent-primary)" : "var(--border-point)" }}
        />
        {healthy ? "Healthy" : "Pending"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const STAGES = ["DETECTING ANOMALY", "DIAGNOSING", "APPLYING FIX", "VERIFYING HEAL"];

export function NomadNetwork() {
  const stage = useTypewriter(STAGES, 46, 20, 1000);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex w-full flex-col gap-7">
      {/* status bar */}
      <div className="flex items-center gap-2 bg-surface-3 px-2 py-[2px]">
        <span className="font-mono text-[13px] uppercase leading-[18px] tracking-[-0.4px] text-text-primary">
          #0142 / <span className="text-accent-primary">{stage}</span>
          <span className="text-text-quaternary">&gt;&gt;&gt;</span>
        </span>
        <span className="ml-auto font-mono text-[13px] uppercase leading-[18px] text-text-quaternary">
          //
        </span>
      </div>

      {/* network diagram */}
      <div className="overflow-hidden border border-border">
        <NetworkDiagram />
      </div>

      {/* progress */}
      <div className="px-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] uppercase tracking-[-0.6px] text-text-primary">
            REMEDIATION <span className="text-text-quaternary">&gt;&gt;&gt;</span>{" "}
            <span className="text-text-quaternary">{stage}...</span>
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 14 13"
            fill="none"
            className="ml-auto animate-[spin_1.2s_linear_infinite] text-accent-primary"
          >
            <path
              d="M12.5 6.5 C12.5 9.8 9.8 12.5 6.5 12.5 C3.2 12.5 0.5 9.8 0.5 6.5 C0.5 3.2 3.2 0.5 6.5 0.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path d="M9 1 L12.5 0.8 L11 4.5" fill="currentColor" />
          </svg>
          <span className="font-mono text-[12px] text-text-primary">{progress}%</span>
        </div>
        <div className="mt-1.5 h-[10px] w-full bg-surface-3">
          <div
            className="h-full bg-accent-primary transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* remediation step list */}
      <div>
        <StepRow name="worker" action=".detect" done healthy delay={0} />
        <StepRow name="api" action=".restart" done healthy delay={350} />
        <StepRow name="target" action=".rollback" done={false} healthy={false} delay={700} />
        <StepRow name="db" action=".check" done={false} healthy={false} delay={1050} />
        <StepRow name="gateway" action=".verify" done={false} healthy={false} delay={1400} />
        <StepRow name="claude" action=".diagnose" done={false} healthy={false} delay={1750} />
      </div>
    </div>
  );
}
