import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { EntityForm } from "@/components/admin/EntityForm";
import { resourceFields } from "@/lib/adminForms";
import { getResource } from "@/lib/repo/resources";

export const metadata = { title: "Modifier la ressource" };

export default async function ModifierRessourcePage({ params }: { params: { slug: string } }) {
  await requirePermission(PERMISSIONS.RESOURCES_MANAGE);
  const resource = await getResource(params.slug);
  if (!resource) notFound();

  return (
    <div>
      <AdminPageHeader title="Modifier la ressource" description={resource.title} />
      <EntityForm
        fields={resourceFields}
        initial={{ ...resource, readingTime: resource.readingTime ?? "" }}
        method="PUT"
        action={`/api/v1/admin/resources/${resource.slug}`}
        backTo="/admin/ressources"
        submitLabel="Enregistrer"
      />
    </div>
  );
}
