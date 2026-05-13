"use client";

import { CollaborationCarousel } from "@/components/collaborations/CollaborationCarousel";
import { SectionDivider } from "@/components/ui/SectionDivider";
import type { PortfolioItemWithBrand } from "@/types";

export interface CollaborationsShowcaseProps {
  activeItems: PortfolioItemWithBrand[];
  pastItems: PortfolioItemWithBrand[];
  activeBrands: string[];
}

export function CollaborationsShowcase({
  activeItems,
  pastItems,
  activeBrands,
}: CollaborationsShowcaseProps) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Active Collaborations Section */}
      <section aria-labelledby="active-collaborations-heading">
        <h2
          id="active-collaborations-heading"
          className="text-2xl font-semibold text-gray-900 mb-6 text-center"
        >
          Active Collaborations
        </h2>

        <CollaborationCarousel items={activeItems} transitionDuration={400} />

        {/* Brand logos row for active collaborations */}
        {activeBrands.length > 0 && (
          <div className="mt-10">
            <p className="text-center text-sm text-gray-400 uppercase tracking-widest mb-4">
              Current Partners
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {activeBrands.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-gold/40 hover:bg-gold/5"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <SectionDivider />

      {/* Past Collaborations Section */}
      <section aria-labelledby="past-collaborations-heading">
        <h2
          id="past-collaborations-heading"
          className="text-2xl font-semibold text-gray-900 mb-6 text-center"
        >
          Past Collaborations
        </h2>

        <CollaborationCarousel items={pastItems} transitionDuration={400} />
      </section>
    </div>
  );
}
