import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/rbac";
import { getMemberProfile } from "@/data/space";
import { ProfileForm } from "@/components/space/ProfileForm";

export const metadata: Metadata = { title: "Mon profil" };

export default async function MembreProfilPage() {
  const user = await requirePermission(PERMISSIONS.PROFILE_MANAGE, "/membre");
  const profile = getMemberProfile(user.id, { fullName: user.name, email: user.email });

  return (
    <div>
      <h2 className="text-lg font-bold text-ink">Mon profil</h2>
      <p className="mt-1 text-sm text-ink/70">Tenez vos coordonnées à jour pour faciliter votre suivi.</p>
      <div className="mt-4">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
