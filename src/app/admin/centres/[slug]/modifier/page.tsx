import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { EntityForm } from "@/components/admin/EntityForm";
import { centerFields } from "@/lib/adminForms";
import { getCenter } from "@/lib/repo/centers";

export const metadata = { title: "Modifier le centre" };

export default async function ModifierCentrePage({ params }: { params: { slug: string } }) {
  await requirePermission(PERMISSIONS.CENTERS_MANAGE);
  const center = await getCenter(params.slug);
  if (!center) notFound();

  return (
    <div>
      <AdminPageHeader title="Modifier le centre" description={center.name} />
      <EntityForm
        fields={centerFields}
        initial={{
          ...center,
          services: center.services.join(", "),
          products: center.products.join(", "),
        }}
        method="PUT"
        action={`/api/v1/admin/centers/${center.slug}`}
        backTo="/admin/centres"
        submitLabel="Enregistrer"
      />
    </div>
  );
}
