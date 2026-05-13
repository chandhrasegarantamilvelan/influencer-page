import { prisma } from "@/lib/prisma";
import { PortfolioManager } from "@/components/dashboard/PortfolioManager";

const ITEMS_PER_PAGE = 10;

interface PortfolioPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [items, totalCount] = await Promise.all([
    prisma.portfolioItem.findMany({
      orderBy: { sortOrder: "asc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.portfolioItem.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  return (
    <PortfolioManager
      items={items}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  );
}
