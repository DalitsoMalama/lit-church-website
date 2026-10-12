import type { Metadata } from "next";
import QRCode from "qrcode";
import { Suspense } from "react";
import { PrintButton } from "@/components/PrintButton";
import { Flame } from "@/components/street";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Check-in poster", robots: { index: false } };

async function Poster({ searchParams }: { searchParams: PageProps<"/checkin/poster">["searchParams"] }) {
  const raw = (await searchParams).service;
  const service = typeof raw === "string" ? raw.slice(0, 60) : "";
  const url = `${site.url}/checkin${service ? `?service=${encodeURIComponent(service)}` : ""}`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#1c1a19" } });

  return (
    <div className="mx-auto flex aspect-[210/297] w-full max-w-[560px] flex-col items-center justify-between rounded-[6px] border-[10px] border-white bg-lit-green p-10 text-center text-white shadow-2xl print:max-w-none print:rounded-none print:border-0 print:shadow-none">
      <div className="flex items-center gap-2 text-street-label">
        <Flame className="h-6 w-auto" /> Living Temples Church
      </div>
      <div>
        <p lang="bem" className="font-display text-3xl italic text-flyer-yellow">
          Mwaiseni!
        </p>
        <p className="text-street mt-2 text-6xl">
          Check in
          <br />
          <span className="text-flyer-yellow">here</span>
        </p>
        {service && <p className="text-street-label mt-4">{service}</p>}
      </div>
      <div className="rounded-xl bg-white p-4">
        {/* QR is generated on the server from our own URL */}
        <div className="size-56 [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <div className="space-y-2">
        <p className="text-street-label">Scan with your phone camera</p>
        <p className="text-sm text-white/80">{url.replace(/^https?:\/\//, "")}</p>
      </div>
    </div>
  );
}

export default function PosterPage({ searchParams }: PageProps<"/checkin/poster">) {
  return (
    <div className="px-5 py-12 print:p-0">
      <div className="mx-auto mb-8 flex max-w-[560px] flex-wrap items-center justify-between gap-4 print:hidden">
        <p className="text-sm text-muted">
          Print and place at the entrance. For a special event, add <code>?service=Youth+Night</code> to this
          page’s address.
        </p>
        <PrintButton />
      </div>
      <Suspense fallback={<div className="mx-auto aspect-[210/297] max-w-[560px] animate-pulse rounded bg-lit-green/30" />}>
        <Poster searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
