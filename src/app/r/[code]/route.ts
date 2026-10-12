import { redirect } from "next/navigation";

// QR invite cards: lit.church/r/ABC123 → Know Jesus page, credited to the evangelist.
export async function GET(_req: Request, ctx: RouteContext<"/r/[code]">) {
  const { code } = await ctx.params;
  const safe = code.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 20);
  redirect(`/know-jesus?ref=${safe}`);
}
