import type { Metadata, Viewport } from "next";
import "./globals.css";
import Shell from "@/components/Shell";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
