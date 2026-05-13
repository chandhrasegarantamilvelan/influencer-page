import { ProfilesSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading state for the profiles page.
 * Displays skeleton placeholders within 200ms of navigation start (Requirement 10.4).
 */
export default function ProfilesLoading() {
  return <ProfilesSkeleton />;
}
