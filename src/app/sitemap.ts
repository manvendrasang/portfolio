import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return [];
  const base = site.replace(/\/$/, "");
  const paths = ["/", "/ai/", "/web/", "/3d/", "/contact/", ...projects.map((p) => `/projects/${p.slug}/`)];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
