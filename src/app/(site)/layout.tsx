import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteProvider } from "@/components/SiteProvider";
import { getSite } from "@/lib/content";

// Public website shell: header, footer and the live church details (edited in /admin).
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const site = await getSite(); // cached; refreshed when details are saved in /admin
  return (
    <SiteProvider value={site}>
      <Header site={site} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </SiteProvider>
  );
}
