import { dateParts } from "@/lib/format";

/** Pastille date : gros jour + mois — voir mockup « Prochains dépistages ». */
export function DatePill({ iso }: { iso: string }) {
  const { day, month } = dateParts(iso);
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-soft text-primary">
      <span className="text-lg font-extrabold leading-none">{day}</span>
      <span className="text-[10px] font-semibold tracking-wide">{month}</span>
    </div>
  );
}
