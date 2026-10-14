// Points .env.local at the local database (npm run db:start) and makes sure an admin
// password exists. Keeps any other lines already in .env.local.
import { createHmac, randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const SECRET = "local-development-only-jwt-secret-not-for-production"; // matches docker-compose.yml
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (role) => {
  const head = b64({ alg: "HS256", typ: "JWT" });
  const body = b64({ role, iss: "lit-local", iat: 1760000000, exp: 2000000000 });
  return `${head}.${body}.${createHmac("sha256", SECRET).update(`${head}.${body}`).digest("base64url")}`;
};

const file = ".env.local";
const lines = existsSync(file) ? readFileSync(file, "utf8").split(/\r?\n/) : ["# Local development only (git-ignored)"];
const env = new Map(lines.filter((l) => /^[A-Z0-9_]+=/.test(l)).map((l) => [l.split("=")[0], l]));
const set = (k, v, keep = false) => {
  if (keep && env.has(k)) return;
  const line = `${k}=${v}`;
  const i = lines.findIndex((l) => l.startsWith(`${k}=`));
  if (i >= 0) lines[i] = line;
  else lines.push(line);
};

set("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:54321");
set("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", jwt("anon"));
set("SUPABASE_SERVICE_ROLE_KEY", jwt("service_role"));
set("ADMIN_PASSWORD", randomBytes(12).toString("base64url"), true);
set("ADMIN_SECRET", randomBytes(32).toString("hex"), true);
set("ATTENDANCE_PIN", randomBytes(9).toString("base64url"), true);
set("ATTENDANCE_SECRET", randomBytes(32).toString("hex"), true);

writeFileSync(file, lines.filter((l, i) => l !== "" || i < lines.length - 1).join("\n") + "\n");
console.log("✓ .env.local now points at the local database (http://localhost:54321).");
console.log("  Your admin password is the ADMIN_PASSWORD line in .env.local. Restart `npm run dev` to pick it up.");
