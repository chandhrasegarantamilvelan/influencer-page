import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Loading state for the admin dashboard.
 * Displays skeleton placeholders within 200ms of navigation start (Requirement 10.4).
 */
export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Metrics row skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-6 space-y-3"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Recent requests skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
