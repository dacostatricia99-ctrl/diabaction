import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { HideOnPrivate } from "@/components/layout/HideOnPrivate";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const siteName = "Diabaction Congo";
const description =
  "Ensemble contre le diabète en République du Congo : trouvez un centre, les dépistages, le programme enfants, les produits à tarif solidaire et des ressources.";

export const metadata: Metadata = {
  metadataBase: new URL("https://diabaction.cg"),
  title: {
    default: `${siteName} — Ensemble contre le diabète au Congo`,
    template: `%s — ${siteName}`,
  },
  description,
  applicationName: siteName,
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: siteName },
  openGraph: { type: "website", locale: "fr_CG", siteName, title: siteName, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1B3FA8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" className="pb-20 lg:pb-0">
          {children}
        </main>
        <HideOnPrivate>
          <Footer />
        </HideOnPrivate>
        <MobileTabBar />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
