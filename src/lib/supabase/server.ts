import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && key);

/**
 * Anonymous client for public form submissions. RLS only allows INSERT
 * into the intake tables (see supabase/migrations), never SELECT.
 * Signed-in member/staff clients (via @supabase/ssr) arrive with phase 3.
 */
export function publicClient() {
  if (!url || !key) throw new Error("Supabase is not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}
