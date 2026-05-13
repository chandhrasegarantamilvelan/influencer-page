"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { LazyImage } from "@/components/ui/LazyImage";
import { LazyVideo } from "@/components/ui/LazyVideo";
import type { PortfolioItemWithBrand } from "@/types";

export interface CollaborationCarouselProps {
  items: PortfolioItemWithBrand[];
  transitionDuration?: number; // 300-500ms, default 400
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const cardHoverVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    borderColor: "rgba(214,178,76,0)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
  hover: {
    y: -4,
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    borderColor: "rgba(214,178,76,0.4)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export function CollaborationCarousel({
  items,
  transitionDuration = 400,
}: CollaborationCarouselProps) {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">
        No collaborations available in this section.
      </p>
    );
  }

  const durationInSeconds = transitionDuration / 1000;

  const paginate = (newDirection: number) => {
    const nextIndex =
      (currentIndex + newDirection + items.length) % items.length;
    setCurrentIndex([nextIndex, newDirection]);
  };

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Carousel viewport */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-white border border-transparent min-h-[320px]"
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentItem.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: durationInSeconds, ease: "easeOut" },
              opacity: { duration: durationInSeconds, ease: "easeOut" },
            }}
            className="w-full"
          >
            {/* Media - lazy loaded */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              {currentItem.mediaType === "video" ? (
                <LazyVideo
                  src={currentItem.mediaUrl}
                  className="w-full h-full object-cover"
                  ariaLabel={`Video for ${currentItem.title}`}
                />
              ) : (
                <LazyImage
                  src={currentItem.mediaUrl}
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {currentItem.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {currentItem.brand}
              </p>
              <span className="mt-2 inline-block text-xs font-medium text-maroon bg-maroon/5 px-2 py-0.5 rounded-full">
                {currentItem.category}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation buttons */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="absolute left-1 sm:left-2 top-1/3 sm:top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm text-gray-700 hover:bg-white hover:border-gold/40 transition-all duration-200"
            aria-label="Previous item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-1 sm:right-2 top-1/3 sm:top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm text-gray-700 hover:bg-white hover:border-gold/40 transition-all duration-200"
            aria-label="Next item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex([index, index > currentIndex ? 1 : -1])}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-maroon w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to item ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
