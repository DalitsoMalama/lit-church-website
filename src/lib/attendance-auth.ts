import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";

// Interim protection for the attendance report until staff sign-in (Supabase Auth) is built.
// Kept out of the "use server" actions file so none of this is callable from the browser.

export const ATTENDANCE_COOKIE = "lit_attendance";
export const SESSION_SECONDS = 8 * 60 * 60; // one service day
export const MIN_PIN_LENGTH = 8;

const pin = () => process.env.ATTENDANCE_PIN ?? "";
export const pinConfigured = () => pin().length > 0;
export const pinTooShort = () => pinConfigured() && pin().length < MIN_PIN_LENGTH;

/** Signing key derived from the PIN (changing the PIN logs everyone out) plus a server secret. */
function key() {
  const secret = process.env.ATTENDANCE_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createHash("sha256").update(`lit-attendance:${pin()}:${secret}`).digest();
}

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPin(given: string) {
  if (!pinConfigured() || pinTooShort()) return false;
  const h = (s: string) => createHash("sha256").update(s).digest("hex");
  return safeEqual(h(given), h(pin()));
}

/** Session token: "<expiry>.<signature>". Expires on its own; can't be forged without the key. */
export function issueToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return `${exp}.${createHmac("sha256", key()).update(String(exp)).digest("base64url")}`;
}

function verifyToken(token: string | undefined) {
  if (!token || !pinConfigured() || pinTooShort()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  const expected = createHmac("sha256", key()).update(exp).digest("base64url");
  return safeEqual(sig, expected);
}

export async function isUnlocked() {
  // Read the raw Cookie header: cookies() hits a Next 16 invariant when the page re-renders
  // after a no-JS form POST to a server action.
  const header = (await headers()).get("cookie") ?? "";
  const token = header
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ATTENDANCE_COOKIE}=`))
    ?.slice(ATTENDANCE_COOKIE.length + 1);
  return verifyToken(token);
}
