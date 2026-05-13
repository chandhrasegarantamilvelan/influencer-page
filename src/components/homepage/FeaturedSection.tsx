"use client";

import { StorySection } from "@/components/homepage/StorySection";
import { LazyImage } from "@/components/ui/LazyImage";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { PortfolioItemWithBrand } from "@/types";

export interface FeaturedSectionProps {
  items: PortfolioItemWithBrand[];
}

export function FeaturedSection({ items }: FeaturedSectionProps) {
  // Display 3–6 active portfolio items
  const displayItems = items.filter((item) => item.active).slice(0, 6);

  // Extract unique brand names for the logo row
  const uniqueBrands = Array.from(
    new Set(displayItems.map((item) => item.brand))
  );

  return (
    <StorySection
      id="featured-collaborations"
      animationVariant="fadeUp"
      className="py-20 px-4 md:px-8 lg:px-16"
    >
      {/* Section title with gold spotlight glow */}
      <div className="relative text-center mb-12">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] -z-10 animate-glow-pulse pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(214,178,76,0.10) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <h2 className="text-3xl md:text-4xl font-bold text-cabernet tracking-tight">
          Featured Collaborations
        </h2>
        <p className="mt-3 text-lg text-gray-600 max-w-xl mx-auto">
          A selection of recent brand partnerships and creative projects.
        </p>
      </div>

      {/* Portfolio items grid */}
      {displayItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:border-gold/40"
            >
              {/* Media thumbnail - lazy loaded (below fold) */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {item.mediaType === "video" ? (
                  <LazyVideo
                    src={item.mediaUrl}
                    className="w-full h-full object-cover"
                    ariaLabel={`Video for ${item.title}`}
                  />
                ) : (
                  <LazyImage
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                <span className="mt-2 inline-block text-xs font-medium text-maroon bg-maroon/5 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No featured collaborations available at this time.
        </p>
      )}

      {/* Brand logos row */}
      {uniqueBrands.length > 0 && (
        <div className="mt-12 max-w-4xl mx-auto">
          <p className="text-center text-sm text-gray-400 uppercase tracking-widest mb-4">
            Trusted by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {uniqueBrands.map((brand) => (
              <div
                key={brand}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700 transition-colors hover:border-gold/40 hover:bg-gold/5"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      )}
    </StorySection>
  );
}
