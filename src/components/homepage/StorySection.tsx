"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

export interface StorySectionProps {
  id: string;
  children: React.ReactNode;
  animationVariant?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight";
  parallaxOffset?: number; // 20-60px
  threshold?: number; // 0.25 default (25% visibility trigger)
  className?: string;
}

const ANIMATION_DURATION = 0.5; // 500ms default (within 300-600ms range)

export function StorySection({
  id,
  children,
  animationVariant = "fadeUp",
  parallaxOffset = 40,
  threshold = 0.25,
  className = "",
}: StorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: threshold,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxOffset, -parallaxOffset]
  );

  const getInitialStyles = () => {
    switch (animationVariant) {
      case "fadeUp":
        return { opacity: 0, y: parallaxOffset };
      case "fadeIn":
        return { opacity: 0 };
      case "slideLeft":
        return { opacity: 0, x: -parallaxOffset };
      case "slideRight":
        return { opacity: 0, x: parallaxOffset };
    }
  };

  const getAnimateStyles = () => {
    switch (animationVariant) {
      case "fadeUp":
        return { opacity: 1, y: 0 };
      case "fadeIn":
        return { opacity: 1 };
      case "slideLeft":
        return { opacity: 1, x: 0 };
      case "slideRight":
        return { opacity: 1, x: 0 };
    }
  };

  return (
    <motion.section
      id={id}
      ref={sectionRef}
      className={className}
      initial={getInitialStyles()}
      animate={isInView ? getAnimateStyles() : getInitialStyles()}
      transition={{
        duration: ANIMATION_DURATION,
        ease: "easeOut",
      }}
      style={{
        y: animationVariant === "fadeUp" ? parallaxY : undefined,
      }}
    >
      {children}
    </motion.section>
  );
}
