import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HeroSection } from "./HeroSection";

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

describe("HeroSection", () => {
  it("renders the influencer name", () => {
    render(<HeroSection />);
    expect(screen.getByText("Alexandra Chen")).toBeInTheDocument();
  });

  it("renders the default tagline", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(
        "Lifestyle Creator | Brand Storyteller | Fitness Enthusiast"
      )
    ).toBeInTheDocument();
  });

  it("renders custom name and tagline", () => {
    render(<HeroSection name="Jane Doe" tagline="Fashion & Travel" />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Fashion & Travel")).toBeInTheDocument();
  });

  it("truncates tagline to 120 characters", () => {
    const longTagline = "A".repeat(150);
    render(<HeroSection tagline={longTagline} />);
    const displayed = screen.getByText("A".repeat(120));
    expect(displayed).toBeInTheDocument();
  });

  it("renders background image by default", () => {
    const { container } = render(<HeroSection />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/hero-bg.jpg");
  });

  it("renders background video when provided", () => {
    const { container } = render(
      <HeroSection backgroundVideo="/hero-bg.mp4" />
    );
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "/hero-bg.mp4");
  });

  it("shows cabernet fallback when image fails to load", () => {
    const { container } = render(<HeroSection />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();

    // Simulate image load error
    fireEvent.error(img!);

    // After error, image should be gone and fallback div should appear
    expect(container.querySelector("img")).not.toBeInTheDocument();
    const fallback = container.querySelector(".bg-cabernet");
    expect(fallback).toBeInTheDocument();
  });

  it("shows cabernet fallback when video fails to load", () => {
    const { container } = render(
      <HeroSection backgroundVideo="/hero-bg.mp4" />
    );
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();

    // Simulate video load error
    fireEvent.error(video!);

    // After error, video should be gone and fallback div should appear
    expect(container.querySelector("video")).not.toBeInTheDocument();
    const fallback = container.querySelector(".bg-cabernet");
    expect(fallback).toBeInTheDocument();
  });

  it("renders gold spotlight glow element with correct animation class", () => {
    const { container } = render(<HeroSection />);
    const glow = container.querySelector(".animate-glow-pulse");
    expect(glow).toBeInTheDocument();
  });

  it("has min-h-screen class for full viewport height", () => {
    const { container } = render(<HeroSection />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("min-h-screen");
  });

  it("retains name and tagline when media fails", () => {
    const { container } = render(<HeroSection />);
    const img = container.querySelector("img");
    fireEvent.error(img!);

    // Name and tagline should still be visible
    expect(screen.getByText("Alexandra Chen")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Lifestyle Creator | Brand Storyteller | Fitness Enthusiast"
      )
    ).toBeInTheDocument();
  });
});
