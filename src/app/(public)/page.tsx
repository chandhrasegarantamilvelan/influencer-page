import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/homepage/HeroSection";
import { WhatYouDoSection } from "@/components/homepage/WhatYouDoSection";
import { StatsSection } from "@/components/homepage/StatsSection";
import { FeaturedSection } from "@/components/homepage/FeaturedSection";
import { CTASection } from "@/components/homepage/CTASection";
import { SectionDivider } from "@/components/ui/SectionDivider";
import type { PortfolioItemWithBrand } from "@/types";

export default async function HomePage() {
  const portfolioItems = await prisma.portfolioItem.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
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

  // Map Prisma result to the PortfolioItemWithBrand type (lowercase mediaType)
  const items: PortfolioItemWithBrand[] = portfolioItems.map((item) => ({
    id: item.id,
    title: item.title,
    mediaUrl: item.mediaUrl,
    mediaType: item.mediaType === "IMAGE" ? "image" : "video",
    brand: item.brand,
    category: item.category,
    active: item.active,
    sortOrder: item.sortOrder,
  }));

  return (
    <div className="relative">
      {/* Noise texture overlay on colored background sections */}
      <HeroSection />

      <SectionDivider />

      <WhatYouDoSection />

      <SectionDivider />

      <StatsSection />

      <SectionDivider />

      <FeaturedSection items={items} />

      <SectionDivider />

      <CTASection />
    </div>
  );
}
