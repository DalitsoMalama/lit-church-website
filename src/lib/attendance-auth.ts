import "server-only";
import { ATTENDANCE, checkPassword, configured, hasSession, tooShort } from "./staff-auth";

// The ushers' attendance report (/attendance), protected by ATTENDANCE_PIN. See staff-auth.ts.
export const MIN_PIN_LENGTH = ATTENDANCE.minLength;
export const pinConfigured = () => configured(ATTENDANCE);
export const pinTooShort = () => tooShort(ATTENDANCE);
export const checkPin = (pin: string) => checkPassword(ATTENDANCE, pin);
export const isUnlocked = () => hasSession(ATTENDANCE);
