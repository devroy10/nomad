import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@wrksz/themes/next";
import { ReactQueryProvider } from "@/lib/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const commitMono = localFont({
  src: "../../public/fonts/CommitMono-Regular.otf",
  variable: "--font-commit-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://frontend-1f0-3000.ny1.zerops.app"),
  title: "Nomad | The Agentic SRE for Zerops Cloud deployments",
  description:
    "Nomad watches a live Zerops deployment, detects anomalies in forwarded syslog, diagnoses failures with Claude, and applies real fixes through the Zerops REST API.",
  applicationName: "Nomad",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nomad",
    title: "Nomad | The Agentic SRE for Zerops Cloud deployments",
    description:
      "Nomad watches a live Zerops deployment, detects anomalies in forwarded syslog, diagnoses failures with Claude, and applies real fixes through the Zerops REST API.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nomad | The Agentic SRE for Zerops Cloud deployments",
    description:
      "Nomad watches a live Zerops deployment, detects anomalies in forwarded syslog, diagnoses failures with Claude, and applies real fixes through the Zerops REST API.",
  },
  icons: {
    icon: [
      { url: "/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/favicon.ico"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistMono.variable} ${commitMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-screen flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <NuqsAdapter>
              {children}
              <Toaster richColors />
            </NuqsAdapter>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
