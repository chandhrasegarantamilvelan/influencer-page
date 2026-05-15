import { prisma } from "@/lib/prisma";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { CollaborationsShowcase } from "@/components/collaborations/CollaborationsShowcase";
import type { PortfolioItemWithBrand } from "@/types";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Collaborations | Influencer Portfolio",
  description:
    "View current and past brand collaborations and partnerships.",
};

export default async function CollaborationsPage() {
  // Fetch all active portfolio items
  const portfolioItems = await prisma.portfolioItem.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      mediaUrl: true,
      mediaType: true,
      brand: true,
      category: true,
      active: true,
      sortOrder: true,
    },
  });

  // Fetch collaboration requests to determine brand statuses
  const collaborationRequests = await prisma.collaborationRequest.findMany({
    where: {
      status: { in: ["ACCEPTED", "REJECTED", "COMPLETED"] },
    },
    select: {
      brandName: true,
      status: true,
    },
  });

  // Build a map of brand -> statuses
  const brandStatusMap = new Map<string, Set<string>>();
  for (const req of collaborationRequests) {
    const existing = brandStatusMap.get(req.brandName) ?? new Set();
    existing.add(req.status);
    brandStatusMap.set(req.brandName, existing);
  }

  // Categorize portfolio items by their brand's collaboration status
  const activeItems: PortfolioItemWithBrand[] = [];
  const pastItems: PortfolioItemWithBrand[] = [];

  for (const item of portfolioItems) {
    const mapped: PortfolioItemWithBrand = {
      id: item.id,
      title: item.title,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType === "IMAGE" ? "image" : "video",
      brand: item.brand,
      category: item.category,
      active: item.active,
      sortOrder: item.sortOrder,
    };

    const statuses = brandStatusMap.get(item.brand);
    if (statuses?.has("ACCEPTED")) {
      activeItems.push(mapped);
    } else if (statuses?.has("REJECTED") || statuses?.has("COMPLETED")) {
      pastItems.push(mapped);
    }
  }

  // Extract unique brand names from active items for the logo row (max 10)
  const activeBrands = Array.from(
    new Set(activeItems.map((item) => item.brand))
  ).slice(0, 10);

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 lg:px-16">
      {/* Page header */}
      <div className="relative text-center mb-12">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] -z-10 animate-glow-pulse pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(214,178,76,0.10) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cabernet tracking-tight">
          Collaborations
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
          Explore current and past brand partnerships and creative projects.
        </p>
      </div>

      <CollaborationsShowcase
        activeItems={activeItems}
        pastItems={pastItems}
        activeBrands={activeBrands}
      />

      <SectionDivider />
    </div>
  );
}
