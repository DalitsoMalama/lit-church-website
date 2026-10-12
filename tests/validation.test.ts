import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkInSchema, normalizePhone, prayerSchema, responseSchema, visitSchema } from "../src/lib/validation";

describe("normalizePhone", () => {
  for (const [input, expected] of [
    ["097 123 4567", "+260971234567"],
    ["0971234567", "+260971234567"],
    ["97 123 4567", "+260971234567"],
    ["+260 97 123 4567", "+260971234567"],
    ["260971234567", "+260971234567"],
    ["(097) 123-4567", "+260971234567"],
    ["+44 7700 900123", "+447700900123"],
  ]) {
    it(`${input} → ${expected}`, () => assert.equal(normalizePhone(input), expected));
  }
});

const person = { name: "Mary Banda", phone: "097 123 4567", consent: "on" };

describe("visit / response forms", () => {
  it("accepts a valid visit and normalises the phone", () => {
    const r = visitSchema.safeParse({ ...person, adults: "2", kids: "1", visitDate: "2026-10-18" });
    assert.ok(r.success);
    assert.equal(r.data.phone, "+260971234567");
    assert.equal(r.data.adults, 2);
  });
  it("requires consent", () => assert.ok(!visitSchema.safeParse({ ...person, consent: undefined }).success));
  it("rejects a phone made of symbols only", () => assert.ok(!visitSchema.safeParse({ ...person, phone: "+++ +++ +++" }).success));
  it("rejects letters in the phone", () => assert.ok(!visitSchema.safeParse({ ...person, phone: "097-CALL-ME" }).success));
  it("rejects a too-short name", () => assert.ok(!visitSchema.safeParse({ ...person, name: " A " }).success));
  it("rejects absurd party sizes", () => assert.ok(!visitSchema.safeParse({ ...person, adults: "500" }).success));
  it("drops a malformed visit date instead of storing it", () => {
    const r = visitSchema.safeParse({ ...person, visitDate: "<script>" });
    assert.ok(r.success);
    assert.equal(r.data.visitDate, undefined);
  });
  it("drops a malformed referral code", () => {
    assert.equal(visitSchema.parse({ ...person, ref: "ABC123" }).ref, "ABC123");
    assert.equal(visitSchema.parse({ ...person, ref: "x'); drop table" }).ref, undefined);
  });
  it("strips control characters from free text", () => {
    assert.equal(visitSchema.parse({ ...person, notes: "Hello\u0000\u0007 there" }).notes, "Hello there");
  });
  it("rejects an unknown decision", () => assert.ok(!responseSchema.safeParse({ ...person, decision: "admin" }).success));
  it("rejects a 1,000-character note", () => assert.ok(!responseSchema.safeParse({ ...person, decision: "has_questions", notes: "x".repeat(1000) }).success));
});

describe("prayer form", () => {
  it("allows an anonymous request without a phone", () => {
    const r = prayerSchema.safeParse({ category: "healing", request: "Please pray for my mother", consent: "on", phone: "" });
    assert.ok(r.success);
    assert.equal(r.data.phone, undefined);
  });
  it("cannot be made public from the form", () =>
    assert.ok(!prayerSchema.safeParse({ category: "other", request: "Pray for me", consent: "on", visibility: "public" }).success));
  it("rejects a tiny request", () => assert.ok(!prayerSchema.safeParse({ category: "other", request: "hi", consent: "on" }).success));
});

describe("check-in form", () => {
  const ok = { ...person, firstTime: "yes", adults: "1", children: "0" };
  it("accepts a first-time guest", () => assert.ok(checkInSchema.safeParse(ok).success));
  it("requires the first-time answer", () => assert.ok(!checkInSchema.safeParse({ ...ok, firstTime: undefined }).success));
  it("treats an empty 'heard from' as not given", () => assert.equal(checkInSchema.parse({ ...ok, heardFrom: "" }).heardFrom, undefined));
  it("sanitises a special-event name from the QR link", () => {
    assert.equal(checkInSchema.parse({ ...ok, service: "Youth Night <script>alert(1)</script>" }).service, "Youth Night scriptalert1script");
    assert.equal(checkInSchema.parse({ ...ok, service: "   " }).service, undefined);
    assert.equal(checkInSchema.parse({ ...ok, service: "x".repeat(200) }).service?.length, 60);
  });
  it("rejects negative children", () => assert.ok(!checkInSchema.safeParse({ ...ok, children: "-1" }).success));
});
