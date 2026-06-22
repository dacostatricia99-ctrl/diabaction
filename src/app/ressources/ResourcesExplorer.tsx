"use client";

import { useState } from "react";
import { resources, resourceCategoryLabels, type ResourceCategory } from "@/data/demo";
import { ResourceCard } from "@/components/cards/ResourceCard";

const ALL = "Toutes";

export function ResourcesExplorer() {
  const [category, setCategory] = useState<string>(ALL);
  const categories = [ALL, ...Array.from(new Set(resources.map((r) => r.category)))];
  const results = category === ALL ? resources : resources.filter((r) => r.category === category);

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
            {c === ALL ? "Toutes" : resourceCategoryLabels[c as ResourceCategory]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <ResourceCard key={r.slug} resource={r} />
        ))}
      </div>
    </div>
  );
}
