import { cn } from "@/lib/utils";

export function ChevronDownDouble({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.00208 8.47488V1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 5.5L6 8.5L3 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 10.5H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The vertical down-chevron used in download/newsletter strips. */
export function ChevronDown({
  className,
  muted = false,
}: {
  className?: string;
  muted?: boolean;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        muted ? "text-text-muted" : "text-text-tertiary",
        className,
      )}
    >
      <path
        d="M12 3.85712V20.1428M12 20.1428L6 14.3263M12 20.1428L18 14.3263"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.25 7H1.75"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 3.5L12.25 7L8.75 10.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExternalLink({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.16663 1.75H12.25V5.83333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 8.5965V11.375C12.25 11.8583 11.8583 12.25 11.375 12.25H2.625C2.14175 12.25 1.75 11.8583 1.75 11.375V2.625C1.75 2.14175 2.14175 1.75 2.625 1.75H5.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5249 6.4752L11.9874 2.0127"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
