import { cn } from "@/lib/utils";

/** The four 4px corner dots used on every bordered section. */
export function CornerDots({ className }: { className?: string }) {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "absolute left-0 top-0 z-20 size-1 -translate-x-1/2 -translate-y-1/2 bg-surface-4",
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute right-0 top-0 z-20 size-1 translate-x-1/2 -translate-y-1/2 bg-surface-4",
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute bottom-0 left-0 z-20 size-1 -translate-x-1/2 translate-y-1/2 bg-surface-4",
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute bottom-0 right-0 z-20 size-1 translate-x-1/2 translate-y-1/2 bg-surface-4",
          className,
        )}
      />
    </>
  );
}
