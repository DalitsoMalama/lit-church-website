import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ADMIN, hasSession } from "./staff-auth";
import { adminClient } from "./supabase/admin";

/** Every admin page and action calls this first. Not signed in → sign-in page. */
export async function requireAdmin() {
  await connection(); // admin pages are always rendered per request, never prerendered
  if (!(await hasSession(ADMIN))) redirect("/admin/login");
}

/** Service-role database client for the admin side (bypasses RLS: only use after requireAdmin). */
export function adminDb() {
  const db = adminClient();
  if (!db) throw new DatabaseNotConnected();
  return db;
}

export class DatabaseNotConnected extends Error {
  constructor() {
    super("Database not connected");
  }
}

export const dbConnected = () => adminClient() !== null;

export { nestFields } from "./form-nesting";
