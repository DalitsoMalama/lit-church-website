import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nestFields } from "../src/lib/form-nesting";
import { settingsSchema } from "../src/lib/validation";
import { buildSite, defaultSettings, timeLabel } from "../src/lib/site";

describe("nestFields (admin form names → objects)", () => {
  it("nests dotted names and arrays", () => {
    assert.deepEqual(nestFields({ "service.venue": "Hall", "cellGroups.0.area": "Ndeke", "cellGroups.1.area": "Buchi", mission: "m" }), {
      service: { venue: "Hall" },
      cellGroups: [{ area: "Ndeke" }, { area: "Buchi" }],
      mission: "m",
    });
  });
  it("drops gaps left by removed cell-group rows", () => {
    assert.deepEqual(nestFields({ "cellGroups.0.area": "A", "cellGroups.2.area": "C" }).cellGroups, [{ area: "A" }, { area: "C" }]);
  });
  it("ignores prototype-pollution keys", () => {
    nestFields({ "__proto__.polluted": "yes", "constructor.prototype.polluted": "yes" });
    assert.equal(({} as Record<string, unknown>).polluted, undefined);
  });
});

describe("church details validation", () => {
  const valid = {
    ...defaultSettings,
    whatsapp: { number: "260 97 123 4567", communityUrl: "https://chat.whatsapp.com/AbC123" },
  };
  it("accepts the defaults and normalises the WhatsApp number", () => {
    const r = settingsSchema.safeParse(valid);
    assert.ok(r.success);
    assert.equal(r.data.whatsapp.number, "260971234567");
  });
  it("rejects a non-WhatsApp community link", () =>
    assert.ok(!settingsSchema.safeParse({ ...valid, whatsapp: { number: "", communityUrl: "https://evil.example/x" } }).success));
  it("rejects javascript: links", () =>
    assert.ok(!settingsSchema.safeParse({ ...valid, whatsapp: { number: "", communityUrl: "javascript:alert(1)" } }).success));
  it("rejects an impossible start time", () =>
    assert.ok(!settingsSchema.safeParse({ ...valid, service: { ...valid.service, startHour: 25 } }).success));
  it("rejects an empty venue", () => assert.ok(!settingsSchema.safeParse({ ...valid, service: { ...valid.service, venue: " " } }).success));
});

describe("derived labels", () => {
  it("formats service times", () => {
    assert.equal(timeLabel(8, 0), "8:00 AM");
    assert.equal(timeLabel(9, 30), "9:30 AM");
    assert.equal(timeLabel(12, 0), "12:00 PM");
    assert.equal(timeLabel(18, 5), "6:05 PM");
    assert.equal(timeLabel(0, 0), "12:00 AM");
  });
  it("builds day name and map links from settings", () => {
    const site = buildSite({ ...defaultSettings, service: { ...defaultSettings.service, weekday: 3 } });
    assert.equal(site.service.day, "Wednesday");
    assert.match(site.service.mapUrl, /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=Havemore/);
  });
});
