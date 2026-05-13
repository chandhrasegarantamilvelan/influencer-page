"use client";

import { useRef, useState, useEffect } from "react";

export interface LazyVideoProps {
  src: string;
  className?: string;
  muted?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  /** Root margin for intersection observer trigger distance */
  rootMargin?: string;
  /** If true, loads immediately without intersection observer */
  priority?: boolean;
  /** Accessible label for the video */
  ariaLabel?: string;
}

/**
 * LazyVideo component that uses IntersectionObserver to defer loading
 * videos until they are within 200px of the viewport.
 * Shows a skeleton placeholder until the video loads.
 */
export function LazyVideo({
  src,
  className = "",
  muted = true,
  playsInline = true,
  autoPlay = false,
  loop = false,
  rootMargin = "200px",
  priority = false,
  ariaLabel,
}: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority, rootMargin]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Skeleton placeholder shown until video loads */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          aria-hidden="true"
        />
      )}

      {isInView && (
        <video
          src={src}
          className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
          muted={muted}
          playsInline={playsInline}
          autoPlay={autoPlay}
          loop={loop}
          onLoadedData={() => setIsLoaded(true)}
          aria-label={ariaLabel}
        />
      )}
    </div>
  );
}
