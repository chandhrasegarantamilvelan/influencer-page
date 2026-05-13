import { HomepageSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading state for the public route group.
 * Displays skeleton placeholders within 200ms of navigation start
 * to indicate content is being fetched (Requirement 10.4).
 * Ensures progressive content rendering - no blank page (Requirement 10.5).
 */
export default function PublicLoading() {
  return <HomepageSkeleton />;
}
