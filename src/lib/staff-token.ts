import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/*
 * Pure session-token logic for shared-password staff areas (no Next.js request APIs),
 * so it can run both in server components/actions and in src/proxy.ts.
 * Token: "<expiry>.<hmac>" signed with a key derived from the password + a server secret.
 */

export type Gate = {
  cookie: string;
  path: string; // cookie path: only sent to this part of the site
  passwordEnv: string;
  secretEnv: string;
  minLength: number;
  sessionSeconds: number;
};

export const ADMIN: Gate = {
  cookie: "lit_admin",
  path: "/admin",
  passwordEnv: "ADMIN_PASSWORD",
  secretEnv: "ADMIN_SECRET",
  minLength: 12,
  sessionSeconds: 12 * 60 * 60,
};

export const ATTENDANCE: Gate = {
  cookie: "lit_attendance",
  path: "/attendance",
  passwordEnv: "ATTENDANCE_PIN",
  secretEnv: "ATTENDANCE_SECRET",
  minLength: 8,
  sessionSeconds: 8 * 60 * 60,
};

const password = (g: Gate) => process.env[g.passwordEnv] ?? "";
export const configured = (g: Gate) => password(g).length > 0;
export const tooShort = (g: Gate) => configured(g) && password(g).length < g.minLength;

function key(g: Gate) {
  const secret = process.env[g.secretEnv] ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createHash("sha256").update(`lit:${g.cookie}:${password(g)}:${secret}`).digest();
}

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(g: Gate, given: string) {
  if (!configured(g) || tooShort(g)) return false;
  const h = (s: string) => createHash("sha256").update(s).digest("hex");
  return safeEqual(h(given), h(password(g)));
}

export function issueToken(g: Gate) {
  const exp = Math.floor(Date.now() / 1000) + g.sessionSeconds;
  return `${exp}.${createHmac("sha256", key(g)).update(String(exp)).digest("base64url")}`;
}

export function verifyToken(g: Gate, token: string | undefined) {
  if (!token || !configured(g) || tooShort(g)) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, createHmac("sha256", key(g)).update(exp).digest("base64url"));
}

/** Reads one cookie from a raw Cookie header. */
export function readCookie(header: string | null, name: string) {
  return (header ?? "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
