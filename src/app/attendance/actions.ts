"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ATTENDANCE_COOKIE, checkPin, issueToken, SESSION_SECONDS } from "@/lib/attendance-auth";
import { rateLimit } from "@/lib/rate-limit";

export async function unlockAttendance(_prev: { error: string }, formData: FormData) {
  // 5 attempts per 15 minutes per connection, then locked out
  if (!(await rateLimit("attendance-pin", 5, 15 * 60 * 1000))) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }
  if (!checkPin(String(formData.get("pin") ?? ""))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "That PIN is not correct." };
  }
  (await cookies()).set(ATTENDANCE_COOKIE, issueToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/attendance",
    maxAge: SESSION_SECONDS,
  });
  redirect("/attendance");
}

export async function lockAttendance() {
  (await cookies()).delete({ name: ATTENDANCE_COOKIE, path: "/attendance" });
  redirect("/attendance");
}
