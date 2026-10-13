import type { MetadataRoute } from "next";
import { devotionals } from "@/content/devotionals";
import { site } from "@/lib/site";

// Public pages for search engines. Staff and check-in pages are excluded (see robots.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["", 1],
    ["/know-jesus", 0.9],
    ["/visit", 0.9],
    ["/devotional", 0.8],
    ["/sermons", 0.7],
    ["/groups", 0.6],
    ["/prayer", 0.6],
    ["/about", 0.6],
    ["/give", 0.5],
    ["/privacy", 0.2],
  ];
  return [
    ...pages.map(([path, priority]) => ({ url: `${site.url}${path}`, priority })),
    ...devotionals.map((d) => ({ url: `${site.url}/devotional/${d.day}`, priority: 0.5 })),
  ];
}
