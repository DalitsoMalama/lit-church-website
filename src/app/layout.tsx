import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServiceWorker } from "@/components/InstallApp";
import { site } from "@/lib/site";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"], weight: ["500", "600", "700"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} (LIT) | Church in Kitwe, Zambia`,
    template: `%s | ${site.shortName}`,
  },
  description: `${site.mission} Join us every ${site.service.day} at ${site.service.time}, ${site.service.venue}, ${site.service.address}.`,
  openGraph: { siteName: site.name, locale: "en_ZM", type: "website" },
  applicationName: site.shortName,
  // iPhone "Add to Home Screen": open full-screen like an app
  appleWebApp: { capable: true, title: site.shortName, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#e8601a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} ${oswald.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: restore a saved dark-mode choice so it never flashes light.
            Light is the default for everyone. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ServiceWorker />
      </body>
    </html>
  );
}
