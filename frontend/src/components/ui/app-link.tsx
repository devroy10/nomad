import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Inline link - renders `<a>` with hover color shift.
 * Internal links use next/link; external get target=_blank.
 */
export function AppLink({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Link>) {
  const external =
    typeof props.href === "string" && /^https?:/.test(props.href);
  return (
    <Link
      className={cn("transition-colors hover:text-text-primary", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </Link>
  );
}
