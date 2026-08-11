import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Full-width section that centers an inner column with `containers`
 * gutter padding and `border-x` side borders:
 *
 *   <div class="... containers isolate">
 *     <div class="border-x border-border flex flex-col flex-1 w-full">
 *       <div class="isolate">{children}</div>
 *     </div>
 *   </div>
 */
export function Section({
  className,
  innerClassName,
  children,
  ...props
}: ComponentPropsWithoutRef<"section"> & { innerClassName?: string }) {
  return (
    <section className={cn("containers isolate", className)} {...props}>
      <div className="w-full flex-1 flex-col border-x border-border flex">
        <div className={cn("isolate", innerClassName)}>{children}</div>
      </div>
    </section>
  );
}
