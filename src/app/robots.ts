import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/attendance", "/checkin", "/r/", "/calendar"] },
    host: site.url,
    sitemap: `${site.url}/sitemap.xml`,
  };
}
