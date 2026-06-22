"use client";

import { useState } from "react";
import { products, type ProductCategory } from "@/data/demo";
import { ProductCard } from "@/components/cards/ProductCard";

const ALL = "Tous";
const categoryLabels: Record<ProductCategory, string> = {
  insuline: "Insuline",
  bandelettes: "Bandelettes",
  glucometres: "Glucomètres",
  aiguilles: "Aiguilles",
  consommables: "Consommables",
};

export function ProductsExplorer() {
  const [category, setCategory] = useState<string>(ALL);
  const categories = [ALL, ...Array.from(new Set(products.map((p) => p.category)))];
  const results = category === ALL ? products : products.filter((p) => p.category === category);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`badge min-h-[36px] px-3 ${
              category === c ? "bg-primary text-white" : "bg-white text-ink/70 border border-line"
            }`}
          >
            {c === ALL ? "Tous" : categoryLabels[c as ProductCategory]}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
