import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server code only (e.g. the PIN-protected attendance
 * report, until staff sign-in exists). Bypasses RLS, so never import it into client code.
 */
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
