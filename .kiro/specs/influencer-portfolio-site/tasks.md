# Implementation Plan: Influencer Portfolio Site

## Overview

This plan implements a premium portfolio and collaboration platform for a single influencer using Next.js 14+ (App Router), TypeScript strict mode, Tailwind CSS, Framer Motion, PostgreSQL, Prisma, NextAuth.js, and Resend. The implementation is broken into incremental steps that build on each other, starting with project scaffolding and data layer, then core public pages, admin features, and finally premium visual polish.

## Tasks

- [x] 1. Project scaffolding, configuration, and data layer
  - [x] 1.1 Initialize Next.js 14+ project with TypeScript strict mode, Tailwind CSS, and install dependencies
    - Create Next.js app with App Router (`appDir`)
    - Install and configure: `tailwindcss`, `framer-motion`, `prisma`, `@prisma/client`, `next-auth`, `resend`, `zod`, `bcryptjs`
    - Install dev dependencies: `vitest`, `fast-check`, `@testing-library/react`, `playwright`
    - Set `"strict": true` in `tsconfig.json`
    - Configure Tailwind with premium color palette (cabernet, maroon, gold), custom keyframes (shine-sweep, glow-pulse, press), and animation utilities
    - Add noise texture SVG to `/public/textures/noise.svg`
    - Create `globals.css` with shine-overlay and premium-texture CSS classes
    - _Requirements: 11.1, 11.2, 12.1, 12.2_

  - [x] 1.2 Define Prisma schema and generate client
    - Create `prisma/schema.prisma` with all models: Admin, CollaborationRequest, PortfolioItem, SocialProfile, EmailLog
    - Define all enums: CollaborationType, BudgetRange, RequestStatus, MediaType, EmailStatus
    - Add indexes on `CollaborationRequest.status`, `CollaborationRequest.createdAt`, `PortfolioItem.active`, `PortfolioItem.sortOrder`
    - Run `prisma generate` to create the typed client
    - _Requirements: 11.3_

  - [x] 1.3 Create shared types, Prisma client singleton, and utility modules
    - Create `src/types/index.ts` with `ActionResult<T>`, `RequestStatus`, `CollaborationFormData`, `CollaborationType`, `BudgetRange`, and all shared interfaces
    - Create `src/lib/prisma.ts` with singleton Prisma client pattern
    - Create `src/lib/utils.ts` with helper functions (title truncation, number formatting)
    - _Requirements: 11.1, 11.3_

  - [x] 1.4 Create Zod validation schemas
    - Create `src/lib/validators.ts` with schemas for: collaboration request form, portfolio item creation/update, social profile creation/update, login credentials
    - Enforce all field constraints: max lengths, email format, date validation (start >= today, end >= start), URL format, follower count range (0–999,999,999)
    - _Requirements: 3.1, 3.3, 3.4, 8.2, 8.3, 9.3, 9.4, 9.7_

  - [x] 1.5 Create database seed script
    - Create `prisma/seed.ts` with sample data: 1 admin user (hashed password), 4 social profiles (Instagram, YouTube, Facebook, Hevy), 5 portfolio items, 8 collaboration requests with mixed statuses
    - Configure seed command in `package.json`
    - _Requirements: 2.3, 4.1_

- [x] 2. Authentication and email infrastructure
  - [x] 2.1 Configure NextAuth.js with Credentials provider
    - Create `src/lib/auth.ts` with NextAuth configuration
    - Implement Credentials provider with email/password validation against Admin model
    - Implement account lockout logic: track failed attempts, lock after 5 consecutive failures within 15 minutes, reject during lockout period
    - Configure session strategy (JWT), maxAge (60 minutes of inactivity)
    - Create `src/app/api/auth/[...nextauth]/route.ts` API route
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.7_

  - [x] 2.2 Create auth middleware for dashboard route protection
    - Create Next.js middleware that checks authentication for all `/dashboard` routes
    - Redirect unauthenticated users to login page
    - _Requirements: 5.3_

  - [x] 2.3 Configure Resend email client with retry logic
    - Create `src/lib/email.ts` with Resend client initialization
    - Implement `sendAdminNotification` function with retry logic (3 attempts, 5-second delay)
    - Log email attempts and failures to EmailLog table
    - Create email template for new collaboration request notifications (includes brand name, contact email, collaboration type)
    - _Requirements: 11.5, 11.6, 3.5, 3.6_

  - [ ]* 2.4 Write property test for account lockout (Property 5)
    - **Property 5: Account lockout after consecutive failed login attempts**
    - Test that 5 consecutive failures within 15 minutes triggers lockout
    - Test that valid credentials are rejected during lockout
    - Test that lockout expires after 15 minutes
    - **Validates: Requirements 5.7**

  - [ ]* 2.5 Write property test for email retry logic (Property 16)
    - **Property 16: Email retry logic on failure**
    - Test that failed sends retry exactly 3 times with delays
    - Test that all-retries-failed logs the failure
    - Test that associated request retains pending status
    - **Validates: Requirements 3.6, 11.6**

- [x] 3. Checkpoint - Ensure data layer and auth work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Public pages - Homepage with story-driven scroll
  - [x] 4.1 Create root layout and glass-morphism navigation bar
    - Create `src/app/layout.tsx` with metadata, font loading, and global providers
    - Create `src/components/ui/Navbar.tsx` with glass-morphism effect (blur 14px, white 70% opacity) activated on scroll past hero
    - Implement gold gradient underline animation on nav links (0% to 100% width, 300ms ease-in-out)
    - Implement staggered nav entrance animation (50ms delay between items, fade-up 8px over 300ms)
    - Add navigation links: Home, Profiles, Collaborations, Collaborate
    - _Requirements: 12.8, 12.10, 12.12, 1.8_

  - [x] 4.2 Create reusable StorySection component with scroll animations
    - Create `src/components/homepage/StorySection.tsx` using Framer Motion `useInView` (amount: 0.25) and `useScroll`/`useTransform` for parallax
    - Support animation variants: fadeUp, fadeIn, slideLeft, slideRight
    - Implement fade-in with duration 300–600ms and parallax offset 20–60px
    - _Requirements: 1.2_

  - [x] 4.3 Build Hero Intro section
    - Create `src/components/homepage/HeroSection.tsx` with influencer name, tagline (max 120 chars), full-width background image/video
    - Add gold spotlight glow behind heading (radial gradient, 150–250px radius, opacity 0.08–0.12)
    - Implement fallback: solid cabernet background if media fails to load
    - _Requirements: 1.3, 1.10, 12.11_

  - [x] 4.4 Build What You Do section with category cards
    - Create `src/components/homepage/WhatYouDoSection.tsx` displaying 3–6 content category cards
    - Apply card hover effect (translateY -4px, elevated box-shadow, gold border glow at 40% opacity, 250ms transition)
    - _Requirements: 1.4, 12.7_

  - [x] 4.5 Build Stats and Reach section with animated counters
    - Create `src/components/homepage/StatsSection.tsx` with AnimatedCounter components
    - Implement counter animation from 0 to target using Framer Motion `useMotionValue`/`useTransform`, triggered by `useInView`, duration 1–2 seconds
    - Display: total followers, collaborations completed, content pieces produced
    - _Requirements: 1.5_

  - [x] 4.6 Build Featured Collaborations section
    - Create `src/components/homepage/FeaturedSection.tsx` displaying 3–6 portfolio items with brand logos
    - Fetch portfolio items server-side (active items only)
    - _Requirements: 1.6_

  - [x] 4.7 Build Call to Action section with premium button
    - Create `src/components/homepage/CTASection.tsx` with accent-colored button (min 200px wide, 48px tall) linking to /collaborate
    - Apply primary button styling: gradient maroon→cabernet, white text, font-weight 600, rounded 8–12px, letter-spacing 0.5px
    - Apply shine sweep animation on button
    - Implement hover (scale 1.03, elevated shadow, brightness 1.1) and press (scale 0.97 for 100ms) effects
    - _Requirements: 1.7, 12.3, 12.4, 12.5_

  - [x] 4.8 Assemble homepage with all story sections and section dividers
    - Create `src/app/(public)/page.tsx` composing all story sections in order: Hero, What You Do, Stats, Featured, CTA
    - Add section dividers (1px gold-to-transparent gradient, max 200px width, centered)
    - Apply noise texture overlay on colored backgrounds
    - Ensure color palette coverage: 25–35% accent colors, remainder white
    - _Requirements: 1.1, 1.8, 1.9, 12.2, 12.9_

- [ ] 5. Public pages - Profiles, Collaborations, and Collaboration Form
  - [x] 5.1 Build Social Media Profiles page
    - Create `src/app/(public)/profiles/page.tsx` with left panel (platform list) and right panel (Profile_Card preview)
    - Create `src/components/profiles/ProfileCard.tsx` displaying platform name, handle, follower count, bio excerpt (max 150 chars), external link (opens in new tab)
    - First platform selected by default on page load
    - Gracefully omit unavailable fields (handle, follower count, bio excerpt)
    - Apply card hover effect on profile cards
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 12.7_

  - [ ]* 5.2 Write property test for Profile_Card graceful degradation (Property 17)
    - **Property 17: Profile_Card graceful degradation with missing optional fields**
    - Test that cards render without errors when optional fields are null
    - Test that available fields are displayed and null fields are omitted
    - **Validates: Requirements 2.5**

  - [x] 5.3 Build Current Collaborations showcase page
    - Create `src/app/(public)/collaborations/page.tsx` with carousel and brand logos
    - Create `src/components/collaborations/CollaborationCarousel.tsx` using Framer Motion `AnimatePresence` with slide/fade transitions (300–500ms)
    - Categorize into Active (status=accepted) and Past (status=rejected/completed) sections
    - Display brand logos row (max 10) at bottom for active collaborations
    - Show placeholder message if no items in a section
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 5.4 Write property test for collaboration categorization (Property 3)
    - **Property 3: Collaboration categorization by status**
    - Test that accepted items appear in Active, rejected/completed in Past
    - Test no item appears in both sections or is missing
    - **Validates: Requirements 4.3**

  - [x] 5.5 Build Collaboration Request form page
    - Create `src/app/(public)/collaborate/page.tsx` with the collaboration request form
    - Create `src/components/forms/CollaborationRequestForm.tsx` with all required fields: brand name, contact name, contact email, collaboration type (dropdown), budget range (dropdown), start date, end date, description
    - Implement client-side validation using Zod schema with inline field-level error messages
    - Display confirmation message on successful submission
    - _Requirements: 3.1, 3.3, 3.4_

  - [x] 5.6 Create collaboration request Server Action
    - Create `src/actions/collaboration-requests.ts` with `submitCollaborationRequest` action
    - Validate form data server-side with Zod
    - Store valid request in database with status "pending"
    - Trigger admin email notification on successful storage
    - Return `ActionResult` with success/error/fieldErrors
    - _Requirements: 3.2, 3.5, 3.6_

  - [ ]* 5.7 Write property test for collaboration request round-trip (Property 1)
    - **Property 1: Valid collaboration form submission round-trip**
    - Test that valid data stores correctly with status "pending" and all fields preserved
    - **Validates: Requirements 3.2**

  - [ ]* 5.8 Write property test for collaboration form validation (Property 2)
    - **Property 2: Invalid collaboration form data is rejected with field-specific errors**
    - Test that invalid submissions are rejected without storing data
    - Test that field-specific errors are returned
    - **Validates: Requirements 3.3, 3.4**

- [x] 6. Checkpoint - Ensure public pages render and form submission works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Admin authentication pages
  - [x] 7.1 Build admin login page
    - Create `src/app/(admin)/login/page.tsx` with email and password fields
    - Enforce constraints: email max 254 chars, password min 8 / max 128 chars
    - Display generic error message on invalid credentials (never reveal which credential was wrong)
    - Display lockout message when account is locked
    - Redirect to dashboard on successful login within 2 seconds
    - _Requirements: 5.1, 5.2, 5.4, 5.7_

  - [x] 7.2 Build admin dashboard layout with sidebar and logout
    - Create `src/app/(admin)/dashboard/layout.tsx` with sidebar navigation (Overview, Requests, Portfolio, Profiles)
    - Implement logout action that terminates session and redirects to login within 1 second
    - _Requirements: 5.6_

  - [ ]* 7.3 Write property test for dashboard route protection (Property 4)
    - **Property 4: Unauthenticated dashboard access redirects to login**
    - Test that all dashboard routes redirect unauthenticated requests to login
    - **Validates: Requirements 5.3**

- [x] 8. Admin Dashboard - Overview and Request Management
  - [x] 8.1 Build dashboard overview page with metrics
    - Create `src/app/(admin)/dashboard/page.tsx` displaying: pending request count, total request count, accepted collaboration count
    - Display 5 most recent requests (brand name, date, status) ordered by date descending
    - Link each request to its detail view
    - Show empty state message when no requests exist
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 8.2 Write property test for dashboard metrics computation (Property 6)
    - **Property 6: Dashboard summary counts are consistent with request data**
    - Test that pending/total/accepted counts match actual data
    - **Validates: Requirements 6.1**

  - [ ]* 8.3 Write property test for recent requests ordering (Property 7)
    - **Property 7: Request listing is always in descending date order**
    - Test that results are ordered newest first
    - Test that overview returns exactly 5 most recent
    - **Validates: Requirements 6.2, 7.1**

  - [x] 8.4 Build collaboration requests management page
    - Create `src/app/(admin)/dashboard/requests/page.tsx` with full request list (brand name, contact email, type, date, status)
    - Implement status filter (pending, accepted, rejected, all) with "all" as default
    - Create request detail view showing all submitted fields
    - Implement status change with confirmation dialog
    - Update status without full page reload (optimistic UI or revalidation)
    - Show error message if status update fails; retain previous status
    - Show empty state when no requests match filter
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x] 8.5 Create request management Server Actions
    - Add `updateRequestStatus` to `src/actions/collaboration-requests.ts`
    - Validate status transitions, persist to database
    - Return `ActionResult` with success/error
    - _Requirements: 7.4_

  - [ ]* 8.6 Write property test for request status filtering (Property 8)
    - **Property 8: Request status filtering returns only matching items**
    - Test that filtered results contain only matching statuses
    - Test that all matching items are included
    - **Validates: Requirements 7.6**

  - [ ]* 8.7 Write property test for status update persistence (Property 9)
    - **Property 9: Confirmed status change persists correctly**
    - Test that status updates persist to database
    - Test that subsequent queries reflect updated status
    - **Validates: Requirements 7.4**

- [x] 9. Admin Dashboard - Portfolio and Profile Management
  - [x] 9.1 Build portfolio management page
    - Create `src/app/(admin)/dashboard/portfolio/page.tsx` with paginated list of portfolio items
    - Display thumbnail, title (truncated to 80 chars with ellipsis), brand, active status
    - Implement add form: title (max 100 chars), image/video upload (max 50MB, JPEG/PNG/GIF/MP4/MOV), brand name, category
    - Implement edit functionality for existing items
    - Implement toggle active/inactive status
    - Implement delete with confirmation dialog (cancel retains item)
    - Show validation errors for invalid submissions
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 9.2 Create portfolio Server Actions
    - Create `src/actions/portfolio.ts` with: `createPortfolioItem`, `updatePortfolioItem`, `deletePortfolioItem`, `togglePortfolioItemStatus`
    - Validate file size and format constraints
    - Return `ActionResult` with appropriate errors
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

  - [ ]* 9.3 Write property test for portfolio item creation (Property 11)
    - **Property 11: Valid portfolio item creation stores as active**
    - Test that valid items are stored with active=true
    - Test that items appear in public queries
    - **Validates: Requirements 8.2**

  - [ ]* 9.4 Write property test for portfolio item validation (Property 12)
    - **Property 12: Invalid portfolio item data is rejected**
    - Test that missing fields, oversized files, and invalid formats are rejected
    - Test that error messages identify the failing constraint
    - **Validates: Requirements 8.3**

  - [ ]* 9.5 Write property test for inactive portfolio visibility (Property 13)
    - **Property 13: Inactive portfolio items are excluded from public queries**
    - Test that inactive items don't appear in public queries
    - Test that inactive items still exist in database
    - **Validates: Requirements 8.5**

  - [ ]* 9.6 Write property test for portfolio pagination (Property 10)
    - **Property 10: Portfolio pagination returns correct page slices**
    - Test that page K returns correct slice of items
    - Test that total count is accurate
    - **Validates: Requirements 8.1**

  - [x] 9.7 Build social profiles management page
    - Create `src/app/(admin)/dashboard/profiles/page.tsx` with list of profiles (platform name, handle, follower count)
    - Implement add form: platform name, handle (max 100 chars), profile URL, follower count (0–999,999,999), bio excerpt (max 300 chars)
    - Implement edit functionality
    - Implement delete with confirmation
    - Show validation errors for invalid submissions (missing fields, invalid URL, out-of-range follower count)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x] 9.8 Create social profiles Server Actions
    - Create `src/actions/profiles.ts` with: `createSocialProfile`, `updateSocialProfile`, `deleteSocialProfile`
    - Validate all constraints with Zod schema
    - Return `ActionResult` with field-level errors
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 9.9 Write property test for social profile round-trip (Property 14)
    - **Property 14: Valid social profile creation round-trip**
    - Test that valid profiles store correctly and appear on public page
    - **Validates: Requirements 9.2**

  - [ ]* 9.10 Write property test for social profile validation (Property 15)
    - **Property 15: Invalid social profile data is rejected with appropriate errors**
    - Test that missing fields, invalid URLs, out-of-range counts, and oversized strings are rejected
    - **Validates: Requirements 9.3, 9.4, 9.7**

- [x] 10. Checkpoint - Ensure admin dashboard is fully functional
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Responsive design and performance optimization
  - [x] 11.1 Implement responsive layouts for all public pages
    - Ensure no horizontal scrolling at mobile (320–767px), tablet (768–1023px), and desktop (1024px+)
    - Adjust homepage sections, profiles page (stack panels on mobile), carousel, and form layout for each breakpoint
    - Ensure all content is readable and interactive at all viewport ranges
    - _Requirements: 10.1_

  - [x] 11.2 Implement lazy loading and performance optimizations
    - Add `loading="lazy"` and intersection observer-based loading for below-fold images/videos (trigger at 200px before viewport)
    - Implement skeleton placeholders and loading animations (display within 200ms of navigation)
    - Use Next.js `<Image>` component with proper sizing and formats
    - Ensure progressive content rendering (no blank page even after 5 seconds)
    - _Requirements: 10.2, 10.3, 10.4, 10.5_

- [x] 12. Premium visual effects polish and final integration
  - [x] 12.1 Apply premium button styles and micro-interactions globally
    - Ensure all primary buttons use gradient maroon→cabernet, white text, font-weight 600, rounded 8–12px, min-height 48px, letter-spacing 0.5px
    - Ensure all secondary buttons use transparent bg, 1.5px gold border, gold text, hover fills gold with white text (200ms)
    - Apply hover effect (scale 1.03, box-shadow 0 8px 25px accent 30%, brightness 1.1, 200ms ease-out) to all buttons
    - Apply press effect (scale 0.97 for 100ms) on click for all buttons
    - Apply shine sweep animation on cabernet/maroon/gold backgrounds (1.5–2.5s duration, repeats every 6–10s)
    - _Requirements: 12.1, 12.3, 12.4, 12.5, 12.6_

  - [x] 12.2 Apply card hover effects, section dividers, and spotlight glows
    - Ensure all card components (ProfileCard, category cards, portfolio cards) have hover: translateY -4px, box-shadow 0 12px 30px rgba(0,0,0,0.12), gold border 1px at 40% opacity, 250ms transition
    - Ensure section dividers are 1px gold-to-transparent gradient, max 200px, centered
    - Ensure gold spotlight glow behind key headings (radial gradient, 150–250px, opacity 0.08–0.12, glow-pulse animation)
    - _Requirements: 12.7, 12.9, 12.11_

  - [x] 12.3 Wire all components together and verify end-to-end flows
    - Verify public page navigation works correctly
    - Verify collaboration form submission triggers email and stores request
    - Verify admin login → dashboard → manage requests/portfolio/profiles flow
    - Verify portfolio changes reflect on public collaborations page
    - Verify profile changes reflect on public profiles page
    - Ensure no orphaned or disconnected code
    - _Requirements: All_

- [x] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The project uses TypeScript throughout with strict mode enabled
- All Server Actions use Zod for both client-side and server-side validation
- Framer Motion is used for all animations; CSS keyframes for repeating effects (shine, glow)
- The premium visual effects are layered: Tailwind utilities for static styles, CSS for repeating animations, Framer Motion for interaction-triggered animations

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4", "1.5"] },
    { "id": 3, "tasks": ["2.1", "2.3"] },
    { "id": 4, "tasks": ["2.2", "2.4", "2.5"] },
    { "id": 5, "tasks": ["4.1", "4.2"] },
    { "id": 6, "tasks": ["4.3", "4.4", "4.5", "4.6", "4.7", "7.1"] },
    { "id": 7, "tasks": ["4.8", "7.2"] },
    { "id": 8, "tasks": ["5.1", "5.3", "5.5", "7.3"] },
    { "id": 9, "tasks": ["5.2", "5.4", "5.6"] },
    { "id": 10, "tasks": ["5.7", "5.8", "8.1", "8.4"] },
    { "id": 11, "tasks": ["8.2", "8.3", "8.5"] },
    { "id": 12, "tasks": ["8.6", "8.7", "9.1", "9.7"] },
    { "id": 13, "tasks": ["9.2", "9.8"] },
    { "id": 14, "tasks": ["9.3", "9.4", "9.5", "9.6", "9.9", "9.10"] },
    { "id": 15, "tasks": ["11.1", "11.2"] },
    { "id": 16, "tasks": ["12.1", "12.2"] },
    { "id": 17, "tasks": ["12.3"] }
  ]
}
```
