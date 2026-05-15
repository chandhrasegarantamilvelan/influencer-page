import { prisma } from "@/lib/prisma";
import { ProfilesManager } from "@/components/dashboard/ProfilesManager";

export const dynamic = "force-dynamic";

export default async function ProfilesPage() {
  const profiles = await prisma.socialProfile.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-cabernet tracking-tight">
          Social Profiles
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your social media profiles displayed on the public site
        </p>
      </div>

      {/* Client-side profiles manager */}
      <ProfilesManager initialProfiles={profiles} />
    </div>
  );
}
