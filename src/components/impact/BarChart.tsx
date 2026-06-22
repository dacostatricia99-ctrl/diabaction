// Histogramme inline SVG — léger, sans dépendance (budget perf 2G/3G).
// Rendu serveur, accessible (table de secours en lecteur d'écran).

export type BarDatum = { label: string; value: number };

export function BarChart({
  data,
  title,
  unit = "",
  height = 160,
}: {
  data: BarDatum[];
  title: string;
  unit?: string;
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = 100 / (data.length * 1.6);
  const gap = barW * 0.6;

  return (
    <figure className="card p-5">
      <figcaption className="mb-3 text-sm font-bold text-ink">{title}</figcaption>
      <svg
        viewBox={`0 0 100 ${height / 2}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={title}
        className="h-40 w-full"
      >
        {data.map((d, i) => {
          const h = (d.value / max) * (height / 2 - 10);
          const x = i * (barW + gap) + gap;
          const y = height / 2 - h;
          return (
            <rect
              key={d.label}
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={0.6}
              className="fill-primary"
            >
              <title>{`${d.label} : ${d.value.toLocaleString("fr-FR")}${unit ? " " + unit : ""}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-ink/50">
        {data.map((d, i) =>
          i % Math.ceil(data.length / 6) === 0 ? <span key={d.label}>{d.label}</span> : <span key={d.label} />
        )}
      </div>
      {/* Repli accessible / sans JS pour les lecteurs d'écran. */}
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
