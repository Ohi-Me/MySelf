import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { CommandPalette } from "@/components/site/CommandPalette";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { profile } from "@/content/site";
import { buildSearchIndex } from "@/lib/search";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/** Display face for page titles and section headings only. */
const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Every route must prerender completely; the build fails otherwise. */
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Machine learning research and engineering`,
    template: `%s · ${SITE_NAME}`,
  },
  description: profile.description,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
    title: `${SITE_NAME} · Machine learning research and engineering`,
    description: profile.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f0e3" },
    { media: "(prefers-color-scheme: dark)", color: "#110e0a" },
  ],
  colorScheme: "light dark",
};

/** Applies a saved theme before first paint, so there is no flash. */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable} ${plexSerif.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top" className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CommandPalette items={buildSearchIndex()} />
      </body>
    </html>
  );
}
