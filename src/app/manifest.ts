import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

// Makes the site installable as an app on phones (home-screen icon, opens without browser bars).
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSite();
  return {
    id: "/",
    name: `${site.shortName}: ${site.name}`,
    short_name: site.shortName,
    description: site.mission,
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1c1a19",
    theme_color: "#e8601a",
    categories: ["lifestyle", "education", "books"],
    lang: "en-ZM",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Long-press the app icon for these
    shortcuts: [
      { name: "Today’s devotional", url: "/devotional", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Know Jesus", url: "/know-jesus", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Check in to service", url: "/checkin", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Prayer request", url: "/prayer", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
