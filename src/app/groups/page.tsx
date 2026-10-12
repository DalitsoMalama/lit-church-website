import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cell Groups",
  description: "Find a Living Temples Church cell group near you in Kitwe: Chimwemwe, Riverside, Ndeke and Buchi.",
};

export default function GroupsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-5 py-16 sm:py-24">
      <header data-reveal className="max-w-2xl space-y-5">
        <p className="eyebrow">Cell groups</p>
        <h1 className="text-h1">Grow together, close to home.</h1>
        <p className="text-lead measure">
          Church is not only on Sunday. Our cell groups meet during the week in homes across Kitwe to pray, study
          the Word and care for one another.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {site.cellGroups.map((g) => (
          <li key={g.area} data-reveal className="card lift space-y-3">
            <h2 className="text-h3">{g.area}</h2>
            <p className="text-sm text-muted">Leader: {g.leader}</p>
            <a
              href={whatsappLink(`Hello LIT Church, I would like to join the ${g.area} cell group.`)}
              className="btn-green"
            >
              Join the {g.area} group
            </a>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted">
        Don’t see your area?{" "}
        <a href={whatsappLink("Hello LIT Church, is there a cell group near me?")} className="underline">
          Message us
        </a>{" "}
        and we’ll connect you with the closest group.
      </p>
    </div>
  );
}
