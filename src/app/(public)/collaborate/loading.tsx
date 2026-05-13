import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Loading state for the collaborate (form) page.
 * Displays skeleton placeholders within 200ms of navigation start (Requirement 10.4).
 */
export default function CollaborateLoading() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        {/* Form card skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          {/* Form fields */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          {/* Submit button */}
          <Skeleton className="h-12 w-full rounded-[10px]" />
        </div>
      </div>
    </main>
  );
}
