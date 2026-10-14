import "server-only";
import { headers } from "next/headers";
import { readCookie, verifyToken, type Gate } from "./staff-token";

/*
 * Shared-password staff sessions for the admin side (/admin) and the ushers' attendance
 * report (/attendance), until individual staff accounts exist. Token logic is in
 * staff-token.ts; this file adds the request-time helpers.
 */
export { ADMIN, ATTENDANCE, checkPassword, configured, issueToken, safeEqual, tooShort, type Gate } from "./staff-token";

export async function hasSession(g: Gate) {
  // Raw Cookie header: cookies() hits a Next 16 invariant when a page re-renders after a
  // no-JS form POST to a server action.
  return verifyToken(g, readCookie((await headers()).get("cookie"), g.cookie));
}

export const cookieOptions = (g: Gate) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: g.path,
  maxAge: g.sessionSeconds,
});
