import { CollaborationsSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading state for the collaborations page.
 * Displays skeleton placeholders within 200ms of navigation start (Requirement 10.4).
 */
export default function CollaborationsLoading() {
  return <CollaborationsSkeleton />;
}
