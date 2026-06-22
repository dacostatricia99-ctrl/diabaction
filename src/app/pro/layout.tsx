import type { Metadata } from "next";
import { SpaceShell } from "@/components/space/SpaceShell";

export const metadata: Metadata = {
  title: { default: "Espace professionnel", template: "%s — Espace professionnel Diabaction" },
  robots: { index: false, follow: false },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return <SpaceShell area="pro">{children}</SpaceShell>;
}
