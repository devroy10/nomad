import Link from "next/link";
import { Wordmark } from "@/components/ui/wordmark";

const links = [
  { href: "/dashboard/incidents", label: "Incidents" },
  { href: "/dashboard/logs", label: "Logs" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-foreground transition-colors hover:text-foreground/80"
          >
            <Wordmark />
          </Link>
          <div className="flex items-center gap-6 font-sans text-[14px] font-medium -tracking-[0.03em] text-muted-foreground">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
