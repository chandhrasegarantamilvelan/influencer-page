import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatsSection } from "./StatsSection";

// Mock framer-motion to make testing deterministic
vi.mock("framer-motion", () => {
  const React = require("react");

  return {
    motion: {
      section: React.forwardRef(
        (
          {
            children,
            initial,
            animate,
            transition,
            style,
            ...props
          }: Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) =>
          React.createElement(
            "section",
            {
              ...props,
              ref,
              "data-initial": JSON.stringify(initial),
              "data-animate": JSON.stringify(animate),
              "data-transition": JSON.stringify(transition),
            },
            children
          )
      ),
      span: React.forwardRef(
        (
          { children, ...props }: Record<string, unknown>,
          ref: React.Ref<HTMLSpanElement>
        ) => React.createElement("span", { ...props, ref }, children)
      ),
    },
    useInView: () => true,
    useScroll: () => ({
      scrollYProgress: { get: () => 0 },
    }),
    useTransform: (_motionValue: unknown, fn: (v: number) => string) => {
      // Return the transformed value for the current motionValue (which starts at 0)
      if (typeof fn === "function") {
        return fn(0);
      }
      return { get: () => 0 };
    },
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: () => {},
    }),
    animate: () => ({ stop: () => {} }),
  };
});

describe("StatsSection", () => {
  it("renders the Stats & Reach heading", () => {
    render(<StatsSection />);
    expect(screen.getByText("Stats & Reach")).toBeInTheDocument();
  });

  it("renders the section with correct id", () => {
    render(<StatsSection />);
    const section = document.getElementById("stats-and-reach");
    expect(section).toBeInTheDocument();
  });

  it("displays Total Followers stat label", () => {
    render(<StatsSection />);
    expect(screen.getByText("Total Followers")).toBeInTheDocument();
  });

  it("displays Collaborations Completed stat label", () => {
    render(<StatsSection />);
    expect(screen.getByText("Collaborations Completed")).toBeInTheDocument();
  });

  it("displays Content Pieces Produced stat label", () => {
    render(<StatsSection />);
    expect(screen.getByText("Content Pieces Produced")).toBeInTheDocument();
  });

  it("renders three stat items", () => {
    render(<StatsSection />);
    const labels = [
      "Total Followers",
      "Collaborations Completed",
      "Content Pieces Produced",
    ];
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders suffix indicators for each stat", () => {
    render(<StatsSection />);
    // All three stats have "+" suffix (K+, +, +)
    const suffixes = screen.getAllByText("+");
    expect(suffixes.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the K suffix for followers", () => {
    render(<StatsSection />);
    expect(screen.getByText("K+")).toBeInTheDocument();
  });

  it("applies accent background styling", () => {
    render(<StatsSection />);
    const section = document.getElementById("stats-and-reach");
    // The section should have the maroon/cabernet background class
    const bgOverlay = section?.querySelector(
      ".bg-gradient-to-br"
    );
    expect(bgOverlay).toBeInTheDocument();
  });
});
