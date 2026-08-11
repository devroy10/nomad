import { cn } from "@/lib/utils";
import { CornerDots } from "@/components/ui/corner-dots";

/**
 * The `[ Label ]` eyebrow bar at the top of each content section.
 * Renders inside a `border-dashed-b` parent in the payload; callers
 * wrap it with `border-dashed-b`.
 */
export function HeaderBar({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-x border-border relative mx-auto flex max-w-[1160px] gap-2 bg-surface-1 py-3.5 pl-[29px] desktop:py-5",
        className,
      )}
    >
      <span className=" text-[14px] font-medium leading-[1.3] tracking-[-0.03em] text-text-tertiary/80">
        {label}
      </span>
      <div className="bg-border absolute left-0 right-0 -top-px z-20 h-px" />
      <div className="bg-border absolute bottom-0 left-0 right-0 z-20 h-px" />
      <CornerDots />
    </div>
  );
}
