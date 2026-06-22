"use client";

import { useState } from "react";
import Link from "next/link";
import { productStatusLabels, type Product } from "@/data/demo";

type Row = Product & { archived?: boolean };

export function ProductsAdminTable({ initial }: { initial: Product[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function archive(slug: string) {
    if (!confirm("Archiver ce produit ? (suppression logique)")) return;
    setBusy(slug);
    try {
      const res = await fetch(`/api/v1/admin/products/${slug}/archive`, { method: "POST" });
      if (res.ok) setRows((r) => r.map((p) => (p.slug === slug ? { ...p, archived: true } : p)));
      else alert("Action refusée.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="px-4 py-3">Produit</th>
            <th className="px-4 py-3">Catégorie</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Avantage membre</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((p) => (
            <tr key={p.slug} className={p.archived ? "opacity-50" : ""}>
              <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
              <td className="px-4 py-3 text-ink/70">{p.category}</td>
              <td className="px-4 py-3 text-ink/70">{productStatusLabels[p.status]}</td>
              <td className="px-4 py-3 text-ink/70">{p.memberBenefit}</td>
              <td className="px-4 py-3 text-right">
                {p.archived ? (
                  <span className="badge-muted">Archivé</span>
                ) : (
                  <div className="inline-flex gap-3">
                    <Link
                      href={`/admin/produits/${p.slug}/modifier`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => archive(p.slug)}
                      disabled={busy === p.slug}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Archiver
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
