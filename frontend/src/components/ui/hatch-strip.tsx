import { cn } from "@/lib/utils";

export type HatchPattern = "diagonal" | "vertical" | "grid" | "solid";

const PATTERN_CLASS: Record<HatchPattern, string> = {
  diagonal:
    "[background-image:repeating-linear-gradient(-45deg,var(--color-border)_0,var(--color-border)_1px,transparent_1px,transparent_10px)]",
  vertical:
    "[background-image:repeating-linear-gradient(to_right,var(--color-border)_0,var(--color-border)_1px,transparent_1px,transparent_10px)]",
  grid: "[background-image:repeating-linear-gradient(to_right,transparent_0,transparent_20px,var(--color-border)_20px,var(--color-border)_21px),repeating-linear-gradient(to_bottom,transparent_0,transparent_20px,var(--color-border)_20px,var(--color-border)_21px)]",
  solid: "",
};

/**
 * Horizontal divider strip lifted from cartesia.ai: a full-bleed bar
 * (hatched by default) with solid corner notches at the edges of the
 * content column. The outer wrapper is a grid whose named lines mirror
 * cartesia's `.site-cols` layout, so the notches always align with the
 * content edges regardless of width.
 *
 *   <HatchStrip />                              // 45° hatch, 1160px content col
 *   <HatchStrip pattern="vertical" />           // vertical rules
 *   <HatchStrip pattern="grid" />               // 20px grid
 *   <HatchStrip pattern="solid" />              // plain 1px rule
 */
export function HatchStrip({
  pattern = "diagonal",
  contentMax = "1160px",
  gutter = "calc(var(--spacing) * 4)",
  className,
}: {
  pattern?: HatchPattern;
  /** Width of the inner content column the notches align to. */
  contentMax?: string;
  /** Full-bleed gutter either side of the content column. */
  gutter?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `[full-start] minmax(${gutter},1fr) [content-start] minmax(0,${contentMax}) [content-end] minmax(${gutter},1fr) [full-end]`,
      }}
    >
      <div
        className={cn(
          "col-[full] h-10 border-b border-border",
          PATTERN_CLASS[pattern],
          pattern === "solid" && "h-px bg-border",
        )}
      />
      <div className="relative col-[content]">
        {/* <StripNotch side="left" /> */}
        {/* <StripNotch side="right" /> */}
      </div>
    </div>
  );
}

function StripNotch({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute top-1/2 z-2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center mt-[-0.5px]",
        side === "left" ? "left-0 ml-[0.5px]" : "left-full ml-[-0.5px]",
      )}
    >
      <div className="size-3 rotate-45 bg-border supports-[corner-shape:scoop]:rotate-0 supports-[corner-shape:scoop]:rounded-[5px] [corner-shape:scoop]" />
    </div>
  );
}
