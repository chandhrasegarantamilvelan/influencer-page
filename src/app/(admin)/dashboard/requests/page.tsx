import { prisma } from "@/lib/prisma";
import { RequestsTable } from "@/components/dashboard/RequestsTable";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const requests = await prisma.collaborationRequest.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      brandName: true,
      contactEmail: true,
      collaborationType: true,
      createdAt: true,
      status: true,
    },
  });

  // Serialize dates for client component
  const serializedRequests = requests.map((req) => ({
    ...req,
    createdAt: req.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-cabernet tracking-tight">
          Collaboration Requests
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and review incoming collaboration proposals
        </p>
      </div>

      {/* Requests Table with Client-Side Filtering */}
      <RequestsTable requests={serializedRequests} />
    </div>
  );
}
