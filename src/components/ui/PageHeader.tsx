export function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <div className="bg-primary text-white">
      <div className="container-page py-8 sm:py-10">
        {eyebrow && <p className="text-sm font-semibold text-white/70">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-white/85">{subtitle}</p>}
      </div>
    </div>
  );
}
