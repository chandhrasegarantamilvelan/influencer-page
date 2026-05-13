"use client";

import { useRef, useState, useEffect } from "react";

export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  /** Root margin for intersection observer trigger distance */
  rootMargin?: string;
  /** If true, loads immediately without intersection observer */
  priority?: boolean;
}

/**
 * LazyImage component that uses IntersectionObserver to defer loading
 * images until they are within 200px of the viewport.
 * Shows a skeleton placeholder until the image loads.
 */
export function LazyImage({
  src,
  alt,
  className = "",
  width,
  height,
  rootMargin = "200px",
  priority = false,
}: LazyImageProps) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority, rootMargin]);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Skeleton placeholder shown until image loads */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          aria-hidden="true"
        />
      )}

      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        />
      )}
    </div>
  );
}
