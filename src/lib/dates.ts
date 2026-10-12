import "server-only";
import { connection } from "next/server";

/** Today's date in Zambia (Africa/Lusaka) as YYYY-MM-DD. Opts the caller into request-time rendering. */
export async function lusakaToday() {
  await connection();
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lusaka" }).format(new Date());
}
