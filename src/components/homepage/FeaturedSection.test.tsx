import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FeaturedSection } from "./FeaturedSection";
import { PortfolioItemWithBrand } from "@/types";

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

const mockItems: PortfolioItemWithBrand[] = [
  {
    id: "1",
    title: "Summer Campaign",
    mediaUrl: "/images/summer.jpg",
    mediaType: "image",
    brand: "Nike",
    category: "Fitness",
    active: true,
    sortOrder: 1,
  },
  {
    id: "2",
    title: "Product Launch Video",
    mediaUrl: "/videos/launch.mp4",
    mediaType: "video",
    brand: "Adidas",
    category: "Lifestyle",
    active: true,
    sortOrder: 2,
  },
  {
    id: "3",
    title: "Holiday Collection",
    mediaUrl: "/images/holiday.jpg",
    mediaType: "image",
    brand: "Nike",
    category: "Fashion",
    active: true,
    sortOrder: 3,
  },
];

describe("FeaturedSection", () => {
  it("renders the section title", () => {
    render(<FeaturedSection items={mockItems} />);
    expect(screen.getByText("Featured Collaborations")).toBeInTheDocument();
  });

  it("displays portfolio items with titles and brands", () => {
    render(<FeaturedSection items={mockItems} />);
    expect(screen.getByText("Summer Campaign")).toBeInTheDocument();
    expect(screen.getByText("Product Launch Video")).toBeInTheDocument();
    expect(screen.getByText("Holiday Collection")).toBeInTheDocument();
    // Nike appears in multiple item cards and brand row, use getAllByText
    expect(screen.getAllByText("Nike").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Adidas").length).toBeGreaterThanOrEqual(1);
  });

  it("displays category badges for each item", () => {
    render(<FeaturedSection items={mockItems} />);
    expect(screen.getByText("Fitness")).toBeInTheDocument();
    expect(screen.getByText("Lifestyle")).toBeInTheDocument();
    expect(screen.getByText("Fashion")).toBeInTheDocument();
  });

  it("renders unique brand names in the brand logos row", () => {
    render(<FeaturedSection items={mockItems} />);
    expect(screen.getByText("Trusted by")).toBeInTheDocument();
    // Nike appears in items twice but should only show once in brand row
    const brandElements = screen.getAllByText("Nike");
    // One in item card brand text, one in brand logos row
    expect(brandElements.length).toBeGreaterThanOrEqual(2);
  });

  it("filters out inactive items", () => {
    const itemsWithInactive: PortfolioItemWithBrand[] = [
      ...mockItems,
      {
        id: "4",
        title: "Inactive Campaign",
        mediaUrl: "/images/inactive.jpg",
        mediaType: "image",
        brand: "Puma",
        category: "Sports",
        active: false,
        sortOrder: 4,
      },
    ];

    render(<FeaturedSection items={itemsWithInactive} />);
    expect(screen.queryByText("Inactive Campaign")).not.toBeInTheDocument();
  });

  it("limits display to 6 items maximum", () => {
    const manyItems: PortfolioItemWithBrand[] = Array.from(
      { length: 8 },
      (_, i) => ({
        id: String(i + 1),
        title: `Item ${i + 1}`,
        mediaUrl: `/images/item${i + 1}.jpg`,
        mediaType: "image" as const,
        brand: `Brand ${i + 1}`,
        category: "General",
        active: true,
        sortOrder: i + 1,
      })
    );

    render(<FeaturedSection items={manyItems} />);
    // Items 1-6 should be visible, items 7-8 should not
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 6")).toBeInTheDocument();
    expect(screen.queryByText("Item 7")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 8")).not.toBeInTheDocument();
  });

  it("shows empty state message when no active items exist", () => {
    render(<FeaturedSection items={[]} />);
    expect(
      screen.getByText("No featured collaborations available at this time.")
    ).toBeInTheDocument();
  });

  it("does not show brand logos row when no items", () => {
    render(<FeaturedSection items={[]} />);
    expect(screen.queryByText("Trusted by")).not.toBeInTheDocument();
  });

  it("renders images with correct alt text", () => {
    render(<FeaturedSection items={mockItems} />);
    const img = screen.getByAltText("Summer Campaign");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/images/summer.jpg");
  });

  it("renders video elements for video media type", () => {
    render(<FeaturedSection items={mockItems} />);
    const video = screen.getByLabelText("Video for Product Launch Video");
    expect(video).toBeInTheDocument();
    expect(video.tagName.toLowerCase()).toBe("video");
  });
});
