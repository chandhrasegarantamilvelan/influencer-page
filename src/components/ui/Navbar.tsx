"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Profiles", href: "/profiles" },
  { label: "Collaborations", href: "/collaborations" },
  { label: "Collaborate", href: "/collaborate" },
];

const navContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Activate glass effect when scrolled past hero section (~100vh)
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
      style={
        isScrolled || isMobileMenuOpen
          ? {
              backdropFilter: "blur(14px)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            }
          : {
              backdropFilter: "none",
              backgroundColor: "transparent",
              borderBottom: "1px solid transparent",
            }
      }
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-cabernet"
        >
          Portfolio
        </Link>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100/50 transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`block w-5 h-0.5 bg-cabernet transition-all duration-200 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[3px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-cabernet mt-1 transition-all duration-200 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[2px]" : ""
            }`}
          />
        </button>

        {/* Desktop navigation */}
        <motion.ul
          className="hidden md:flex items-center gap-8"
          variants={navContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {navLinks.map((link) => (
            <motion.li key={link.href} variants={navItemVariants}>
              <Link
                href={link.href}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-gold after:to-gold/50 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full ${
                  pathname === link.href
                    ? "text-cabernet after:w-full"
                    : "text-foreground/80 hover:text-cabernet"
                }`}
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      {/* Mobile navigation menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul className="flex flex-col gap-1 px-4 pb-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-cabernet bg-cabernet/5"
                        : "text-foreground/80 hover:text-cabernet hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
