import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StorySection } from "./StorySection";

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
    },
    useInView: () => true,
    useScroll: () => ({
      scrollYProgress: { get: () => 0 },
    }),
    useTransform: () => ({ get: () => 0 }),
  };
});

describe("StorySection", () => {
  it("renders children content", () => {
    render(
      <StorySection id="test-section">
        <h1>Hello World</h1>
      </StorySection>
    );

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders with the correct id attribute", () => {
    render(
      <StorySection id="hero-section">
        <p>Content</p>
      </StorySection>
    );

    const section = screen.getByText("Content").closest("section");
    expect(section).toHaveAttribute("id", "hero-section");
  });

  it("applies custom className", () => {
    render(
      <StorySection id="styled-section" className="my-custom-class">
        <p>Styled content</p>
      </StorySection>
    );

    const section = screen.getByText("Styled content").closest("section");
    expect(section).toHaveClass("my-custom-class");
  });

  it("uses fadeUp animation variant by default", () => {
    render(
      <StorySection id="default-section">
        <p>Default animation</p>
      </StorySection>
    );

    const section = screen.getByText("Default animation").closest("section");
    const animate = JSON.parse(
      section?.getAttribute("data-animate") || "{}"
    );
    expect(animate).toEqual({ opacity: 1, y: 0 });
  });

  it("uses fadeIn animation variant when specified", () => {
    render(
      <StorySection id="fadein-section" animationVariant="fadeIn">
        <p>Fade in content</p>
      </StorySection>
    );

    const section = screen.getByText("Fade in content").closest("section");
    const initial = JSON.parse(
      section?.getAttribute("data-initial") || "{}"
    );
    const animate = JSON.parse(
      section?.getAttribute("data-animate") || "{}"
    );
    expect(initial).toEqual({ opacity: 0 });
    expect(animate).toEqual({ opacity: 1 });
  });

  it("uses slideLeft animation variant when specified", () => {
    render(
      <StorySection
        id="slideleft-section"
        animationVariant="slideLeft"
        parallaxOffset={30}
      >
        <p>Slide left content</p>
      </StorySection>
    );

    const section = screen
      .getByText("Slide left content")
      .closest("section");
    const initial = JSON.parse(
      section?.getAttribute("data-initial") || "{}"
    );
    const animate = JSON.parse(
      section?.getAttribute("data-animate") || "{}"
    );
    expect(initial).toEqual({ opacity: 0, x: -30 });
    expect(animate).toEqual({ opacity: 1, x: 0 });
  });

  it("uses slideRight animation variant when specified", () => {
    render(
      <StorySection
        id="slideright-section"
        animationVariant="slideRight"
        parallaxOffset={50}
      >
        <p>Slide right content</p>
      </StorySection>
    );

    const section = screen
      .getByText("Slide right content")
      .closest("section");
    const initial = JSON.parse(
      section?.getAttribute("data-initial") || "{}"
    );
    const animate = JSON.parse(
      section?.getAttribute("data-animate") || "{}"
    );
    expect(initial).toEqual({ opacity: 0, x: 50 });
    expect(animate).toEqual({ opacity: 1, x: 0 });
  });

  it("uses default parallaxOffset of 40px for fadeUp", () => {
    render(
      <StorySection id="parallax-section" animationVariant="fadeUp">
        <p>Parallax content</p>
      </StorySection>
    );

    const section = screen
      .getByText("Parallax content")
      .closest("section");
    const initial = JSON.parse(
      section?.getAttribute("data-initial") || "{}"
    );
    expect(initial).toEqual({ opacity: 0, y: 40 });
  });

  it("uses custom parallaxOffset for fadeUp", () => {
    render(
      <StorySection
        id="custom-parallax"
        animationVariant="fadeUp"
        parallaxOffset={60}
      >
        <p>Custom parallax</p>
      </StorySection>
    );

    const section = screen
      .getByText("Custom parallax")
      .closest("section");
    const initial = JSON.parse(
      section?.getAttribute("data-initial") || "{}"
    );
    expect(initial).toEqual({ opacity: 0, y: 60 });
  });

  it("applies animation duration of 500ms (0.5s)", () => {
    render(
      <StorySection id="duration-section">
        <p>Duration test</p>
      </StorySection>
    );

    const section = screen.getByText("Duration test").closest("section");
    const transition = JSON.parse(
      section?.getAttribute("data-transition") || "{}"
    );
    expect(transition.duration).toBe(0.5);
    expect(transition.ease).toBe("easeOut");
  });
});
