import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RequestDetailActions } from "@/components/dashboard/RequestDetailActions";

const collaborationTypeLabels: Record<string, string> = {
  SPONSORED_POST: "Sponsored Post",
  PRODUCT_REVIEW: "Product Review",
  BRAND_AMBASSADOR: "Brand Ambassador",
  GIVEAWAY: "Giveaway",
  EVENT_APPEARANCE: "Event Appearance",
  OTHER: "Other",
};

const budgetRangeLabels: Record<string, string> = {
  UNDER_500: "Under $500",
  RANGE_500_1000: "$500 – $1,000",
  RANGE_1000_5000: "$1,000 – $5,000",
  RANGE_5000_10000: "$5,000 – $10,000",
  OVER_10000: "Over $10,000",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request = await prisma.collaborationRequest.findUnique({
    where: { id },
  });

  if (!request) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/requests"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-cabernet transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Back to Requests
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cabernet tracking-tight">
            {request.brandName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Submitted {formatDate(request.createdAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center self-start px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[request.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}
        >
          {statusLabels[request.status] || request.status}
        </span>
      </div>

      {/* Detail Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Left column */}
          <div className="p-6 space-y-5">
            <DetailField label="Brand Name" value={request.brandName} />
            <DetailField label="Contact Person" value={request.contactName} />
            <DetailField label="Contact Email" value={request.contactEmail} />
            <DetailField
              label="Collaboration Type"
              value={
                collaborationTypeLabels[request.collaborationType] ||
                request.collaborationType
              }
            />
          </div>

          {/* Right column */}
          <div className="p-6 space-y-5">
            <DetailField
              label="Budget Range"
              value={
                budgetRangeLabels[request.budgetRange] || request.budgetRange
              }
            />
            <DetailField
              label="Start Date"
              value={formatDate(request.startDate)}
            />
            <DetailField
              label="End Date"
              value={formatDate(request.endDate)}
            />
            <DetailField
              label="Submitted"
              value={formatDate(request.createdAt)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-gray-100 p-6">
          <DetailField label="Description" value={request.description} />
        </div>
      </div>

      {/* Actions */}
      {request.status === "PENDING" && (
        <RequestDetailActions
          requestId={request.id}
          brandName={request.brandName}
        />
      )}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
}
