import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WhatYouDoSection } from "./WhatYouDoSection";

// Mock framer-motion to make testing deterministic
vi.mock("framer-motion", () => {
  const React = require("react");

  return {
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            variants,
            initial,
            whileHover,
            animate,
            ...props
          }: Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) =>
          React.createElement(
            "div",
            {
              ...props,
              ref,
              "data-variants": JSON.stringify(variants),
              "data-initial": initial,
              "data-while-hover": whileHover,
              "data-animate": animate,
            },
            children
          )
      ),
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
            },
            children
          )
      ),
    },
    useInView: () => true,
    useScroll: () => ({
      scrollYProgress: { get: () => 0 },
    }),
    useTransform: () => ({ get: () => 0 }),
  };
});

describe("WhatYouDoSection", () => {
  it("renders the section title 'What I Do'", () => {
    render(<WhatYouDoSection />);
    expect(screen.getByText("What I Do")).toBeInTheDocument();
  });

  it("renders exactly 4 category cards", () => {
    render(<WhatYouDoSection />);
    const titles = [
      "Fashion & Style",
      "Fitness & Wellness",
      "Travel & Lifestyle",
      "Beauty & Skincare",
    ];
    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("renders descriptions for each category card", () => {
    render(<WhatYouDoSection />);
    expect(
      screen.getByText(/Curating looks that blend high-end fashion/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sharing workout routines, nutrition tips/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Exploring destinations worldwide/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Honest reviews and tutorials on skincare/)
    ).toBeInTheDocument();
  });

  it("renders emoji icons for each category", () => {
    render(<WhatYouDoSection />);
    expect(screen.getByText("👗")).toBeInTheDocument();
    expect(screen.getByText("💪")).toBeInTheDocument();
    expect(screen.getByText("✈️")).toBeInTheDocument();
    expect(screen.getByText("💄")).toBeInTheDocument();
  });

  it("applies card hover variants with correct translateY and box-shadow", () => {
    render(<WhatYouDoSection />);
    const card = screen.getByText("Fashion & Style").closest("div[data-variants]");
    expect(card).not.toBeNull();

    const variants = JSON.parse(card?.getAttribute("data-variants") || "{}");
    expect(variants.hover.y).toBe(-4);
    expect(variants.hover.boxShadow).toBe("0 12px 30px rgba(0,0,0,0.12)");
    expect(variants.hover.borderColor).toBe("rgba(214,178,76,0.4)");
    expect(variants.hover.transition.duration).toBe(0.25);
  });

  it("applies rest state with no elevation", () => {
    render(<WhatYouDoSection />);
    const card = screen.getByText("Fashion & Style").closest("div[data-variants]");
    const variants = JSON.parse(card?.getAttribute("data-variants") || "{}");
    expect(variants.rest.y).toBe(0);
    expect(variants.rest.boxShadow).toBe("0 4px 12px rgba(0,0,0,0.06)");
    expect(variants.rest.borderColor).toBe("rgba(214,178,76,0)");
  });

  it("wraps content in a StorySection with id 'what-you-do'", () => {
    render(<WhatYouDoSection />);
    const section = screen.getByText("What I Do").closest("section");
    expect(section).toHaveAttribute("id", "what-you-do");
  });

  it("uses responsive grid classes for cards", () => {
    render(<WhatYouDoSection />);
    const grid = screen.getByText("Fashion & Style").closest("div[data-variants]")?.parentElement;
    expect(grid).toHaveClass("grid");
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("sm:grid-cols-2");
    expect(grid).toHaveClass("lg:grid-cols-4");
  });
});
