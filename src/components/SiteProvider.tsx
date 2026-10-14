"use client";

import { createContext, useContext, type ReactNode } from "react";
import { site as defaults, type SiteInfo } from "@/lib/site";

// Live church details (from /admin → Details) for client components.
const SiteContext = createContext<SiteInfo>(defaults);

export function SiteProvider({ value, children }: { value: SiteInfo; children: ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
