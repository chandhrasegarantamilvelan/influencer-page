/**
 * Reusable skeleton placeholder components for loading states.
 * These display within 200ms of navigation start to indicate content is being fetched.
 */

interface SkeletonProps {
  className?: string;
}

/** Generic rectangular skeleton block */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded ${className}`}
      aria-hidden="true"
    />
  );
}

/** Skeleton for the homepage hero section */
export function HeroSkeleton() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 animate-pulse">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-72 bg-gray-300 rounded" />
        <div className="h-6 w-96 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

/** Skeleton for a card grid (e.g., featured collaborations, category cards) */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-100 bg-white overflow-hidden"
        >
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for the profiles page layout */
export function ProfilesSkeleton() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded mx-auto mb-4" />
        <div className="h-5 w-96 bg-gray-200 animate-pulse rounded mx-auto" />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left panel skeleton */}
        <div className="w-full md:w-[30%] space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
        {/* Right panel skeleton */}
        <div className="w-full md:w-[70%]">
          <div className="rounded-xl border border-gray-100 bg-white p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
              <div className="h-7 w-40 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-5 w-48 bg-gray-200 animate-pulse rounded" />
            <div className="h-16 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-5 w-28 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the collaborations page */
export function CollaborationsSkeleton() {
  return (
    <div className="min-h-screen py-16 px-4 md:px-8 lg:px-16">
      <div className="text-center mb-12">
        <div className="h-10 w-56 bg-gray-200 animate-pulse rounded mx-auto mb-3" />
        <div className="h-5 w-80 bg-gray-200 animate-pulse rounded mx-auto" />
      </div>
      {/* Carousel skeleton */}
      <div className="max-w-3xl mx-auto">
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden min-h-[320px]">
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <div className="p-6 space-y-3">
            <div className="h-6 w-2/3 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the homepage (full page) */
export function HomepageSkeleton() {
  return (
    <div className="relative">
      <HeroSkeleton />
      <div className="py-20 px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <div className="h-9 w-64 bg-gray-200 animate-pulse rounded mx-auto mb-3" />
          <div className="h-5 w-80 bg-gray-200 animate-pulse rounded mx-auto" />
        </div>
        <CardGridSkeleton count={4} />
      </div>
    </div>
  );
}
