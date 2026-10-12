import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatServiceDate, nextService, serviceLabel } from "../src/lib/service";

// Sunday service 08:00–10:30 in Kitwe (UTC+2) = 06:00–08:30 UTC
const at = (iso: string) => new Date(iso);

describe("nextService", () => {
  const cases: [string, string, string, boolean, string][] = [
    ["Saturday 23:00", "2026-10-17T21:00:00Z", "Sun 18 Oct", false, "Tomorrow"],
    ["Sunday 00:30", "2026-10-17T22:30:00Z", "Sun 18 Oct", false, "Today"],
    ["Sunday 07:59", "2026-10-18T05:59:00Z", "Sun 18 Oct", false, "Today"],
    ["Sunday 08:30 (live)", "2026-10-18T06:30:00Z", "Sun 18 Oct", true, "Happening now"],
    ["Sunday 10:31 (ended)", "2026-10-18T08:31:00Z", "Sun 25 Oct", false, "Next Sunday"],
    ["Wednesday", "2026-10-21T10:00:00Z", "Sun 25 Oct", false, "This Sunday"],
  ];
  for (const [label, iso, date, live, text] of cases) {
    it(label, () => {
      const s = nextService(at(iso));
      assert.equal(formatServiceDate(s.start), date);
      assert.equal(s.live, live);
      assert.equal(serviceLabel(s, at(iso)), text);
    });
  }
  it("starts at 06:00 UTC (08:00 in Kitwe)", () => {
    assert.equal(nextService(at("2026-10-14T12:00:00Z")).start.toISOString(), "2026-10-18T06:00:00.000Z");
  });
});
