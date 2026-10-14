import { Suspense } from "react";
import { SettingsForm } from "@/components/admin/forms";
import { AdminHeader, DbNotice, Skeleton } from "@/components/admin/page";
import { requireAdmin } from "@/lib/admin";
import { getSettings } from "@/lib/content";
import { saveSettings } from "../../actions";

export const metadata = { title: "Church details" };

async function Details() {
  await requireAdmin();
  return (
    <>
      <DbNotice />
      <SettingsForm action={saveSettings} initial={await getSettings()} />
    </>
  );
}

export default function DetailsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader
        title="Church details"
        intro="Service time and place, contact details and cell groups. Saving updates every page of the website straight away."
      />
      <Suspense fallback={<Skeleton />}>
        <Details />
      </Suspense>
    </div>
  );
}
