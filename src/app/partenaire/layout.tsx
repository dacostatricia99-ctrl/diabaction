import type { Metadata } from "next";
import { SpaceShell } from "@/components/space/SpaceShell";

export const metadata: Metadata = {
  title: { default: "Espace partenaire", template: "%s — Espace partenaire Diabaction" },
  robots: { index: false, follow: false },
};

export default function PartenaireLayout({ children }: { children: React.ReactNode }) {
  return <SpaceShell area="partenaire">{children}</SpaceShell>;
}
