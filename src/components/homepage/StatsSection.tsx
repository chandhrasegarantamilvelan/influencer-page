"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { StorySection } from "./StorySection";

interface AnimatedCounterProps {
  target: number;
  duration?: number; // 1-2 seconds
  prefix?: string;
  suffix?: string;
  formatNumber?: boolean;
}

function AnimatedCounter({
  target,
  duration = 1.5,
  prefix = "",
  suffix = "",
  formatNumber = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    const value = Math.round(latest);
    if (formatNumber) {
      return value.toLocaleString();
    }
    return value.toString();
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, target, {
        duration,
        ease: "easeOut",
      });
      return () => controls.stop();
    }
  }, [isInView, motionValue, target, duration]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      {prefix && <span>{prefix}</span>}
      <motion.span>{rounded}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

interface StatItemProps {
  target: number;
  label: string;
  prefix?: string;
  suffix?: string;
  formatNumber?: boolean;
  duration?: number;
}

function StatItem({
  target,
  label,
  prefix,
  suffix,
  formatNumber,
  duration,
}: StatItemProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
        <AnimatedCounter
          target={target}
          prefix={prefix}
          suffix={suffix}
          formatNumber={formatNumber}
          duration={duration}
        />
      </div>
      <p className="text-xs sm:text-sm md:text-base text-white/80 uppercase tracking-widest font-medium">
        {label}
      </p>
    </div>
  );
}

export function StatsSection() {
  return (
    <StorySection
      id="stats-and-reach"
      animationVariant="fadeUp"
      className="relative py-20 md:py-28 bg-maroon/10"
    >
      {/* Subtle accent background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cabernet/90 to-maroon/90 -z-10" />
      <div className="absolute inset-0 premium-texture -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-12 sm:mb-16 relative">
          <span className="relative z-10">Stats &amp; Reach</span>
          {/* Gold spotlight glow behind heading */}
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] -z-[1] animate-glow-pulse"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(214,178,76,0.10) 0%, transparent 70%)",
            }}
          />
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-8">
          <StatItem
            target={900}
            suffix="K+"
            label="Total Followers"
            duration={1.5}
          />
          <StatItem
            target={50}
            suffix="+"
            label="Collaborations Completed"
            duration={1.8}
          />
          <StatItem
            target={500}
            suffix="+"
            label="Content Pieces Produced"
            duration={2}
          />
        </div>
      </div>
    </StorySection>
  );
}
