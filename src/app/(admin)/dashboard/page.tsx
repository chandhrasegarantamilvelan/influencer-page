import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [pendingCount, totalCount, acceptedCount, recentRequests] =
    await Promise.all([
      prisma.collaborationRequest.count({
        where: { status: "PENDING" },
      }),
      prisma.collaborationRequest.count(),
      prisma.collaborationRequest.count({
        where: { status: "ACCEPTED" },
      }),
      prisma.collaborationRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          brandName: true,
          createdAt: true,
          status: true,
        },
      }),
    ]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-cabernet tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your collaboration metrics at a glance
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          label="Pending Requests"
          value={pendingCount}
          accent="gold"
        />
        <MetricCard
          label="Total Requests"
          value={totalCount}
          accent="maroon"
        />
        <MetricCard
          label="Accepted Collaborations"
          value={acceptedCount}
          accent="cabernet"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Requests
          </h2>
        </div>

        {recentRequests.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">
              No collaboration requests have been received yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentRequests.map((request) => (
              <Link
                key={request.id}
                href={`/dashboard/requests/${request.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors group"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-cabernet transition-colors">
                    {request.brandName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(request.createdAt)}
                  </span>
                </div>
                <StatusBadge status={request.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "gold" | "maroon" | "cabernet";
}) {
  const accentStyles = {
    gold: "border-gold/20 bg-gradient-to-br from-white to-gold/5",
    maroon: "border-maroon/20 bg-gradient-to-br from-white to-maroon/5",
    cabernet: "border-cabernet/20 bg-gradient-to-br from-white to-cabernet/5",
  };

  const valueStyles = {
    gold: "text-gold",
    maroon: "text-maroon",
    cabernet: "text-cabernet",
  };

  return (
    <div
      className={`rounded-2xl border p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${accentStyles[accent]}`}
    >
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${valueStyles[accent]}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const labels: Record<string, string> = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
    COMPLETED: "Completed",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}
    >
      {labels[status] || status}
    </span>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
