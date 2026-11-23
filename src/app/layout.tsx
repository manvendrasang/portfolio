import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./splash.css";
import Shell from "@/components/Shell";
import Splash from "@/components/Splash";
import LiquidGlassFx from "@/components/LiquidGlassFx";
import { person } from "@/lib/content";
import { asset } from "@/lib/asset";

const site = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(site ? { metadataBase: new URL(site) } : {}),
  title: { default: `${person.name} | ${person.role}`, template: `%s | ${person.name}` },
  description:
    "Portfolio of Manvendra Sang: full-stack web development, AI/ML research, and 3D work, laid out as a cosmic amusement park.",
  openGraph: {
    title: `${person.name} | ${person.role}`,
    description: "Full-stack developer and AI/ML builder. Explore the worlds: AI, web, 3D, and contact.",
    type: "website",
    ...(site ? { images: [{ url: asset("/og.png"), width: 1200, height: 630, alt: `${person.name}, portfolio` }] } : {}),
  },
  ...(site ? { twitter: { card: "summary_large_image" as const } } : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070817",
};

/**
 * Runs before first paint. Holds the page's entrance animation until the splash opens, and records
 * the start time so the splash's JS and CSS share one clock. A timeout releases the hold if scripts fail.
 */
const SPLASH_GATE =
  'var d=document.documentElement;d.dataset.splash="on";window.__spStart=performance.now();setTimeout(function(){delete d.dataset.splash},9000);';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_GATE }} />
      </head>
      <body>
        <Splash />
        <LiquidGlassFx />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
