"use client";

import { usePathname } from "next/navigation";
import { isPrivateArea } from "@/lib/spaces";

/** Masque ses enfants dans les zones privées (admin, espaces connectés),
 *  qui possèdent leur propre chrome. */
export function HideOnPrivate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isPrivateArea(pathname)) return null;
  return <>{children}</>;
}
