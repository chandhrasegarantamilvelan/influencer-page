"use client";

import { motion, type Variants } from "framer-motion";
import { formatNumber } from "@/lib/utils";

export interface ProfileCardProps {
  platform: string;
  handle: string | null;
  followerCount: number | null;
  bioExcerpt: string | null; // max 150 chars displayed
  profileUrl: string;
  iconUrl?: string;
}

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

export function ProfileCard({
  platform,
  handle,
  followerCount,
  bioExcerpt,
  profileUrl,
  iconUrl,
}: ProfileCardProps) {
  const displayBio =
    bioExcerpt && bioExcerpt.length > 150
      ? bioExcerpt.slice(0, 150) + "…"
      : bioExcerpt;

  return (
    <motion.div
      className="rounded-xl border border-transparent bg-white p-8 w-full"
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* Platform name and optional icon */}
      <div className="flex items-center gap-3 mb-6">
        {iconUrl && (
          <img
            src={iconUrl}
            alt={`${platform} icon`}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        )}
        <h3 className="text-2xl font-bold text-foreground">{platform}</h3>
      </div>

      {/* Handle - only shown if available */}
      {handle && (
        <p className="text-lg text-zinc-600 mb-3">
          <span className="text-gold font-medium">@{handle}</span>
        </p>
      )}

      {/* Follower count - only shown if available */}
      {followerCount !== null && (
        <p className="text-zinc-700 mb-3">
          <span className="font-semibold text-foreground">
            {formatNumber(followerCount)}
          </span>{" "}
          followers
        </p>
      )}

      {/* Bio excerpt - only shown if available */}
      {displayBio && (
        <p className="text-sm text-zinc-600 leading-relaxed mb-6">
          {displayBio}
        </p>
      )}

      {/* External link - opens in new tab */}
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-maroon font-semibold hover:text-cabernet transition-colors duration-200"
      >
        Visit Profile
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </motion.div>
  );
}
