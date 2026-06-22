export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-extrabold text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink/70">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Module non encore implémenté en CRUD — structure gardée par RBAC. */
export function ModulePlaceholder({ note }: { note: string }) {
  return (
    <div className="card p-6 text-sm text-ink/70">
      <p>{note}</p>
      <p className="mt-2 text-ink/50">
        Les opérations (création, modification, archivage, export) seront branchées sur l'API
        <code className="mx-1 rounded bg-canvas px-1">/api/v1/admin</code> et la base PostgreSQL.
        Chaque action sera enregistrée dans le journal d'audit.
      </p>
    </div>
  );
}
