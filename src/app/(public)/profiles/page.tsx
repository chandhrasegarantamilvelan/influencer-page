import { prisma } from "@/lib/prisma";
import { ProfilesClient } from "@/components/profiles/ProfilesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Social Profiles",
  description:
    "Browse social media profiles and connect across platforms.",
};

export default async function ProfilesPage() {
  const profiles = await prisma.socialProfile.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      platformName: true,
      handle: true,
      profileUrl: true,
      followerCount: true,
      bioExcerpt: true,
      iconUrl: true,
    },
  });

  return (
    <section className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Social Profiles
        </h1>
        <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto">
          Connect with me across platforms and stay up to date with my latest
          content.
        </p>
      </div>

      <ProfilesClient profiles={profiles} />
    </section>
  );
}
