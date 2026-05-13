"use client";

import { useState } from "react";
import { StorySection } from "@/components/homepage/StorySection";

interface HeroSectionProps {
  name?: string;
  tagline?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
}

export function HeroSection({
  name = "Alexandra Chen",
  tagline = "Lifestyle Creator | Brand Storyteller | Fitness Enthusiast",
  backgroundImage = "/hero-bg.jpg",
  backgroundVideo,
}: HeroSectionProps) {
  const [mediaFailed, setMediaFailed] = useState(false);

  // Ensure tagline is max 120 characters
  const displayTagline = tagline.length > 120 ? tagline.slice(0, 120) : tagline;

  return (
    <StorySection
      id="hero"
      animationVariant="fadeIn"
      parallaxOffset={30}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layer */}
      {mediaFailed ? (
        <div
          className="absolute inset-0 bg-cabernet shine-overlay"
          aria-hidden="true"
        />
      ) : backgroundVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setMediaFailed(true)}
          aria-hidden="true"
        />
      ) : (
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundImage}
          alt=""
          fetchPriority="high"
          onError={() => setMediaFailed(true)}
          aria-hidden="true"
        />
      )}

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Gold spotlight glow behind heading */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] h-[200px] -z-10 animate-glow-pulse pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(214,178,76,0.10) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
          {name}
        </h1>

        <p className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl font-medium tracking-wide">
          {displayTagline}
        </p>
      </div>
    </StorySection>
  );
}
