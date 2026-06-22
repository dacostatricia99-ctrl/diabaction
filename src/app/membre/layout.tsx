import type { Metadata } from "next";
import { SpaceShell } from "@/components/space/SpaceShell";

export const metadata: Metadata = {
  title: { default: "Espace membre", template: "%s — Espace membre Diabaction" },
  robots: { index: false, follow: false },
};

export default function MembreLayout({ children }: { children: React.ReactNode }) {
  return <SpaceShell area="membre">{children}</SpaceShell>;
}
