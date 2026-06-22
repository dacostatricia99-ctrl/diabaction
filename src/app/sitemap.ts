import type { MetadataRoute } from "next";
import { centers, products, resources, publishedEvents } from "@/data/demo";

const BASE = "https://diabaction.cg";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/centres",
    "/evenements",
    "/programme-enfants",
    "/produits",
    "/ressources",
    "/devenir-membre",
    "/contact",
    "/a-propos",
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));

  const dynamic = [
    ...centers.map((c) => `/centres/${c.slug}`),
    ...publishedEvents().map((e) => `/evenements/${e.slug}`),
    ...products.map((p) => `/produits/${p.slug}`),
    ...resources.map((r) => `/ressources/${r.slug}`),
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date() }));

  return [...staticRoutes, ...dynamic];
}
