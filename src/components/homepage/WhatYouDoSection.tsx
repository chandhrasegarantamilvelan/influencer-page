"use client";

import { motion, type Variants } from "framer-motion";
import { StorySection } from "@/components/homepage/StorySection";

interface CategoryCard {
  icon: string;
  title: string;
  description: string;
}

const categories: CategoryCard[] = [
  {
    icon: "👗",
    title: "Fashion & Style",
    description:
      "Curating looks that blend high-end fashion with everyday wearability, from runway trends to street style.",
  },
  {
    icon: "💪",
    title: "Fitness & Wellness",
    description:
      "Sharing workout routines, nutrition tips, and holistic wellness practices for a balanced lifestyle.",
  },
  {
    icon: "✈️",
    title: "Travel & Lifestyle",
    description:
      "Exploring destinations worldwide and showcasing luxury travel experiences, hidden gems, and cultural stories.",
  },
  {
    icon: "💄",
    title: "Beauty & Skincare",
    description:
      "Honest reviews and tutorials on skincare routines, makeup techniques, and beauty product discoveries.",
  },
];

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

export function WhatYouDoSection() {
  return (
    <StorySection
      id="what-you-do"
      animationVariant="fadeUp"
      parallaxOffset={40}
      className="py-20 md:py-28 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section heading with gold spotlight glow */}
        <div className="relative text-center mb-12 md:mb-16">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] -z-10 animate-glow-pulse pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(214,178,76,0.10) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            What I Do
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 max-w-xl mx-auto">
            Creating content that inspires, educates, and connects communities across platforms.
          </p>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.title}
              className="rounded-xl border border-transparent bg-white p-6 cursor-default"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <div className="text-4xl mb-4" aria-hidden="true">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {category.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </StorySection>
  );
}
