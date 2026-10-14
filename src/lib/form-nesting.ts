// Plain module (no server-only imports) so it can be unit-tested.

/** Turns flat form names like "service.weekday" or "cellGroups.0.area" into nested objects/arrays. */
export function nestFields(data: Record<string, string>) {
  const out: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(data)) {
    const keys = path.split(".");
    if (keys.some((k) => k === "__proto__" || k === "constructor" || k === "prototype")) continue;
    let node = out as Record<string, unknown>;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) node[k] = value;
      else node = (node[k] ??= /^\d+$/.test(keys[i + 1]) ? [] : {}) as Record<string, unknown>;
    });
  }
  // Arrays built from indices may have gaps (removed rows); drop them
  for (const v of Object.values(out)) if (Array.isArray(v)) v.splice(0, v.length, ...v.filter(Boolean));
  return out;
}
