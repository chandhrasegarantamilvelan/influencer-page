"use client";

import { motion } from "framer-motion";
import React from "react";

export interface PremiumButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-maroon to-cabernet text-white font-semibold tracking-[0.5px] rounded-[10px] min-h-[48px] px-8 shine-overlay",
  secondary:
    "bg-transparent border-[1.5px] border-gold text-gold font-semibold tracking-[0.5px] rounded-[10px] min-h-[48px] px-8 hover:bg-gold hover:text-white transition-all duration-200",
};

const sizeStyles = {
  sm: "text-sm py-2 px-6 min-h-[40px]",
  md: "text-base py-3 px-8 min-h-[48px]",
  lg: "text-lg py-4 px-10 min-h-[56px]",
};

export function PremiumButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  asChild = false,
  onClick,
  disabled = false,
  type = "button",
}: PremiumButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.03,
              boxShadow:
                variant === "secondary"
                  ? "0 8px 25px rgba(214,178,76,0.3)"
                  : "0 8px 25px rgba(128,0,32,0.3)",
              filter: "brightness(1.1)",
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              scale: 0.97,
              transition: { duration: 0.1 },
            }
      }
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

/**
 * A wrapper that applies PremiumButton styling to any child element (e.g., Next.js Link).
 * Use this when you need the button to be a link.
 */
export function PremiumButtonLink({
  variant = "primary",
  size = "md",
  children,
  className = "",
  href,
}: Omit<PremiumButtonProps, "onClick" | "asChild"> & { href: string }) {
  return (
    <motion.a
      href={href}
      className={`inline-flex items-center justify-center cursor-pointer no-underline ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      whileHover={{
        scale: 1.03,
        boxShadow:
          variant === "secondary"
            ? "0 8px 25px rgba(214,178,76,0.3)"
            : "0 8px 25px rgba(128,0,32,0.3)",
        filter: "brightness(1.1)",
      }}
      whileTap={{
        scale: 0.97,
        transition: { duration: 0.1 },
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.a>
  );
}
