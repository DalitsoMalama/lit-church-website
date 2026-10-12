"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/** <details> menu that closes itself after navigating (the header persists across pages). */
export function MobileMenu({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);
  return (
    <details ref={ref} className={className}>
      {children}
    </details>
  );
}
