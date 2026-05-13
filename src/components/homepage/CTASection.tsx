"use client";

import { StorySection } from "@/components/homepage/StorySection";
import { PremiumButtonLink } from "@/components/ui/PremiumButton";

export function CTASection() {
  return (
    <StorySection
      id="cta"
      animationVariant="fadeUp"
      parallaxOffset={30}
      className="relative py-24 md:py-32 flex items-center justify-center"
    >
      <div className="flex flex-col items-center text-center px-4 max-w-2xl mx-auto">
        {/* Gold spotlight glow behind heading */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] h-[200px] -z-10 animate-glow-pulse pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(214,178,76,0.10) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
          Ready to Collaborate?
        </h2>

        <p className="mt-4 text-base sm:text-lg md:text-xl text-foreground/70 max-w-lg">
          Let&apos;s create something extraordinary together. Reach out and
          let&apos;s discuss your next campaign.
        </p>

        {/* Premium CTA Button linking to /collaborate */}
        <div className="mt-10">
          <PremiumButtonLink
            variant="primary"
            size="lg"
            href="/collaborate"
            className="min-w-[200px]"
          >
            Let&apos;s Work Together
          </PremiumButtonLink>
        </div>
      </div>
    </StorySection>
  );
}
