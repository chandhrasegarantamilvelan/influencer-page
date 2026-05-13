# Requirements Document

## Introduction

A premium portfolio and collaboration platform for a single influencer. The site serves two purposes: showcasing the influencer's work and social presence to potential collaborators, and providing a streamlined way for brands to submit collaboration requests. The site features a story-driven scroll homepage, social media profile previews, a collaboration showcase, and a secure admin dashboard for managing incoming requests and site content. The visual identity uses a luxury color palette (cabernet, maroon, gold) against a predominantly white background with glossy, glowing animations for a premium feel.

## Glossary

- **Site**: The influencer portfolio and collaboration web application
- **Visitor**: Any unauthenticated user browsing the public pages
- **Collaborator**: A brand representative or individual submitting a collaboration request
- **Admin**: The influencer who manages the site through the authenticated dashboard
- **Profile_Card**: A UI component displaying a social media platform's details and preview
- **Collaboration_Request**: A submission from a collaborator containing brand details, budget, timeline, and campaign description
- **Portfolio_Item**: A piece of content (image, video, or campaign result) displayed on the public site
- **Dashboard**: The authenticated admin area for managing site content and requests
- **Story_Section**: A distinct scroll section on the homepage that reveals content with animation
- **Email_Notification**: An automated email sent to the Admin when a new collaboration request is submitted

## Requirements

### Requirement 1: Story-Driven Scroll Homepage

**User Story:** As a visitor, I want to experience a visually engaging, story-driven homepage, so that I understand who the influencer is and what they offer.

#### Acceptance Criteria

1. THE Site SHALL display the homepage as a sequence of five Story_Sections: Hero Intro, What You Do, Stats and Reach, Featured Collaborations, and Call to Action
2. WHEN at least 25 percent of a Story_Section enters the viewport during scroll, THE Site SHALL animate the section into view using a fade-in effect with a duration between 300 and 600 milliseconds and a parallax scroll offset between 20 and 60 pixels
3. THE Site SHALL display the Hero Intro section with the influencer's name, a tagline of no more than 120 characters, and a full-width background image or video
4. THE Site SHALL display the What You Do section with 3 to 6 content category cards describing the influencer's areas of expertise
5. WHEN the Stats and Reach section enters the viewport, THE Site SHALL animate numeric counters from zero to their target values for total followers, collaborations completed, and content pieces produced within 1 to 2 seconds
6. THE Site SHALL display the Featured Collaborations section with 3 to 6 Portfolio_Items and their associated brand logos
7. THE Site SHALL display the Call to Action section with a button at least 200 pixels wide and 48 pixels tall, styled in an accent color from the site palette, linking to the Collaboration Request page
8. THE Site SHALL apply a color palette of cabernet (#540212), maroon (#800020), and gold (#D6B24C) to accent elements comprising 25 to 35 percent of the visible area, with the remaining area in white
9. THE Site SHALL apply a glow effect via visible box-shadow on hover and focus states of interactive elements, and a gradient overlay on section transition backgrounds to produce a glossy appearance
10. IF the Hero Intro background image or video fails to load, THEN THE Site SHALL display a solid background in the cabernet (#540212) accent color and retain the influencer's name and tagline as readable text

### Requirement 2: Social Media Profiles Page

**User Story:** As a visitor, I want to browse the influencer's social media profiles, so that I can see their presence across platforms.

#### Acceptance Criteria

1. THE Site SHALL display a Profiles page with a list of platform names on the left panel and a Profile_Card preview on the right panel, with the first platform in the list selected by default on page load
2. WHEN a Visitor selects a platform from the list, THE Site SHALL display the corresponding Profile_Card with the platform name, handle, follower count, a bio excerpt of no more than 150 characters, and a link that opens the external profile in a new browser tab
3. THE Site SHALL include Profile_Cards for Instagram, YouTube, Facebook, and Hevy at launch
4. THE Site SHALL support adding new platform Profile_Cards through the Admin Dashboard without requiring code changes
5. IF a Profile_Card field (handle, follower count, or bio excerpt) is unavailable, THEN THE Site SHALL display the Profile_Card with the remaining available fields and omit the unavailable field from view

### Requirement 3: Collaboration Request Submission

**User Story:** As a collaborator, I want to submit a collaboration request through a form, so that I can propose a partnership with the influencer.

#### Acceptance Criteria

1. THE Site SHALL display a Collaboration Request page with a form containing the following required fields: brand name (maximum 100 characters), contact person name (maximum 100 characters), contact email, collaboration type (selectable from: sponsored post, product review, brand ambassador, giveaway, event appearance, other), budget range (selectable from: under $500, $500–$1,000, $1,000–$5,000, $5,000–$10,000, over $10,000), timeline or campaign dates (start date and end date, both no earlier than the current date), and a description message (maximum 1,000 characters)
2. WHEN a Collaborator submits a valid Collaboration_Request form with all required fields completed, THE Site SHALL store the request in the database with a status of pending and display a confirmation message indicating the request was submitted successfully
3. IF a Collaborator submits a form with one or more empty required fields, THEN THE Site SHALL visually indicate each incomplete field and display a validation error message adjacent to each incomplete field without submitting the form
4. IF a Collaborator submits a form with an invalid email format, THEN THE Site SHALL display an email format error message adjacent to the contact email field without submitting the form
5. WHEN a Collaboration_Request is successfully stored, THE Site SHALL send an Email_Notification to the Admin containing the collaborator's brand name, contact email, and collaboration type
6. IF the Email_Notification to the Admin fails to send after 3 attempts, THEN THE Site SHALL log the failure and retain the stored Collaboration_Request with its pending status unchanged

### Requirement 4: Current Collaborations Showcase

**User Story:** As a visitor, I want to view the influencer's current and past collaborations, so that I can see the quality and scope of their work.

#### Acceptance Criteria

1. THE Site SHALL display a Current Collaborations page with Portfolio_Items presented in a carousel format, showing each item's title, image or video, and associated brand name
2. THE Site SHALL display brand logos of collaborators associated with Active Portfolio_Items in a horizontal row at the bottom of the Current Collaborations page, showing a maximum of 10 logos
3. THE Site SHALL categorize collaborations into Active and Past sections, where Active contains Portfolio_Items linked to collaborations with a status of accepted and Past contains Portfolio_Items linked to collaborations with a status of rejected or completed
4. WHEN a Visitor navigates between carousel items, THE Site SHALL animate transitions using slide or fade effects with a duration between 300 and 500 milliseconds
5. IF no Portfolio_Items exist in either the Active or Past section, THEN THE Site SHALL display a placeholder message indicating no collaborations are available in that section

### Requirement 5: Admin Authentication

**User Story:** As the influencer, I want to securely log in to an admin area, so that only I can manage site content and collaboration requests.

#### Acceptance Criteria

1. THE Site SHALL provide a login page accessible at a dedicated admin URL that accepts an email address (maximum 254 characters) and a password (minimum 8 characters, maximum 128 characters) as credentials
2. WHEN an Admin provides valid email and password credentials, THE Site SHALL authenticate the session and redirect to the Dashboard within 2 seconds
3. IF an unauthenticated user attempts to access any Dashboard page, THEN THE Site SHALL redirect the user to the login page
4. IF an Admin provides invalid credentials, THEN THE Site SHALL display a generic authentication error message without revealing which credential was incorrect
5. WHILE an Admin session is active, THE Site SHALL maintain authentication state across page navigations within the Dashboard for a maximum of 60 minutes of inactivity, after which THE Site SHALL expire the session and redirect to the login page
6. WHEN an Admin selects the logout action from the Dashboard, THE Site SHALL terminate the active session and redirect to the login page within 1 second
7. IF an Admin provides invalid credentials 5 consecutive times within a 15-minute window, THEN THE Site SHALL lock the account for 15 minutes and display a message indicating the account is temporarily locked

### Requirement 6: Admin Dashboard Overview

**User Story:** As the influencer, I want a dashboard overview showing key metrics, so that I can quickly see new requests and site activity.

#### Acceptance Criteria

1. THE Dashboard SHALL display a summary showing the count of pending Collaboration_Requests, total Collaboration_Requests received, and total collaborations with a status of accepted
2. THE Dashboard SHALL display a list of the five most recent Collaboration_Requests ordered by submission date descending, showing brand name, date submitted, and status
3. WHEN an Admin clicks on a Collaboration_Request in the overview list, THE Dashboard SHALL navigate to the detailed request view for that specific Collaboration_Request
4. WHEN the Dashboard overview page is loaded, THE Dashboard SHALL retrieve and display the current metric counts and recent requests list reflecting the latest database state
5. IF there are no Collaboration_Requests in the system, THEN THE Dashboard SHALL display zero for all summary counts and show an empty state message in the recent requests list indicating no requests have been received

### Requirement 7: Manage Collaboration Requests

**User Story:** As the influencer, I want to view and manage collaboration requests, so that I can accept, reject, or review proposals from brands.

#### Acceptance Criteria

1. THE Dashboard SHALL display a list of all Collaboration_Requests with columns for brand name, contact email, collaboration type, date submitted, and status, sorted by date submitted in descending order (newest first)
2. WHEN an Admin selects a Collaboration_Request, THE Dashboard SHALL display the full request details including all submitted form fields
3. WHEN an Admin changes a Collaboration_Request status to accepted or rejected, THE Dashboard SHALL prompt the Admin with a confirmation dialog before persisting the change
4. WHEN the Admin confirms a status change, THE Dashboard SHALL update the status in the database and reflect the updated status in the list view without requiring a full page reload
5. IF a status update fails due to a server or network error, THEN THE Dashboard SHALL display an error message indicating the status was not saved and retain the previous status value in the list view
6. THE Dashboard SHALL support filtering Collaboration_Requests by status (pending, accepted, and rejected) and SHALL display all statuses by default when no filter is selected
7. IF no Collaboration_Requests match the current filter, THEN THE Dashboard SHALL display an empty-state message indicating no requests are available for the selected filter

### Requirement 8: Manage Portfolio Content

**User Story:** As the influencer, I want to add, edit, and remove portfolio items, so that I can keep my public showcase up to date.

#### Acceptance Criteria

1. THE Dashboard SHALL display a paginated list of all Portfolio_Items with a thumbnail, title (truncated to 80 characters with ellipsis if longer), associated brand, and active status
2. WHEN an Admin adds a new Portfolio_Item with a title (maximum 100 characters), image or video upload (maximum file size 50 MB, accepted formats: JPEG, PNG, GIF, MP4, MOV), associated brand name, and category, THE Dashboard SHALL store the item with an active status and make it available on the public site
3. IF an Admin submits a new Portfolio_Item with any required field missing or with a file that exceeds the maximum size or is not an accepted format, THEN THE Dashboard SHALL display an error message indicating which field or file constraint failed and SHALL NOT store the item
4. WHEN an Admin edits an existing Portfolio_Item, THE Dashboard SHALL update the stored data and reflect changes on the public site
5. WHEN an Admin toggles the active status of a Portfolio_Item to inactive, THE Dashboard SHALL hide the item from the public site display without deleting it
6. WHEN an Admin requests removal of a Portfolio_Item, THE Dashboard SHALL prompt for confirmation before permanently removing the item from the public site display
7. IF an Admin cancels the removal confirmation, THEN THE Dashboard SHALL retain the Portfolio_Item unchanged

### Requirement 9: Manage Social Media Profiles

**User Story:** As the influencer, I want to add and edit my social media profile details, so that the Profiles page stays current.

#### Acceptance Criteria

1. THE Dashboard SHALL display a list of all configured social media profiles with platform name, handle, and follower count
2. WHEN an Admin adds a new profile with platform name, handle, profile URL, follower count, and bio excerpt, THE Dashboard SHALL store the profile and display it on the public Profiles page
3. IF an Admin submits a new profile or edits an existing profile with a missing platform name, missing handle, missing profile URL, or missing follower count, THEN THE Dashboard SHALL display a validation error message indicating the missing fields and SHALL NOT store the profile
4. IF an Admin submits a profile with a profile URL that is not a valid URL format or a follower count that is not a whole number between 0 and 999,999,999, THEN THE Dashboard SHALL display a format error message and SHALL NOT store the profile
5. WHEN an Admin edits an existing profile's platform name, handle, profile URL, follower count, or bio excerpt, THE Dashboard SHALL update the stored data and reflect changes on the public Profiles page
6. WHEN an Admin confirms removal of a profile, THE Dashboard SHALL remove the corresponding Profile_Card from the public Profiles page
7. THE Dashboard SHALL constrain the handle field to a maximum of 100 characters and the bio excerpt field to a maximum of 300 characters

### Requirement 10: Responsive Design and Performance

**User Story:** As a visitor, I want the site to load quickly and look great on any device, so that I have a premium experience regardless of how I access it.

#### Acceptance Criteria

1. THE Site SHALL render all public pages without horizontal scrolling and with all content readable and interactive at three viewport ranges: mobile (320px to 767px), tablet (768px to 1023px), and desktop (1024px and above)
2. THE Site SHALL load the initial homepage content within 3 seconds when measured on a 10 Mbps connection with 50ms round-trip latency, where "loaded" means the largest visible content element has rendered (Largest Contentful Paint)
3. THE Site SHALL lazy-load images and videos that are below the visible viewport so that they are not fetched until the user scrolls within 200px of them
4. WHILE a page is loading, THE Site SHALL display skeleton placeholders or loading animations within 200 milliseconds of navigation start to indicate content is being fetched
5. IF the homepage content has not loaded within 5 seconds, THEN THE Site SHALL continue displaying the loading indicator and render content progressively as it becomes available without showing a blank page

### Requirement 11: Technology Stack

**User Story:** As the influencer, I want the site built with a modern, maintainable technology stack, so that it performs well and can be extended in the future.

#### Acceptance Criteria

1. THE Site SHALL be built using Next.js 14 or later with the App Router and TypeScript in strict mode, verifiable by the presence of `"strict": true` in tsconfig.json and `appDir` usage in the project configuration
2. THE Site SHALL use Tailwind CSS for styling and Framer Motion for scroll and interaction animations, verifiable by their inclusion as dependencies in package.json and their corresponding configuration files present in the project root
3. THE Site SHALL use PostgreSQL as the database and Prisma as the ORM for data access, verifiable by a Prisma schema file defining the database provider as "postgresql" and Prisma listed as a dependency in package.json
4. THE Site SHALL use NextAuth.js for admin authentication, verifiable by its inclusion as a dependency in package.json and the presence of a NextAuth configuration file within the project
5. THE Site SHALL use Resend as the primary email service for sending Email_Notifications to the Admin, verifiable by its inclusion as a dependency in package.json and the presence of email-sending configuration referencing the Resend API
6. IF Resend is unavailable or fails to send an Email_Notification, THEN THE Site SHALL log the failure and retry the send operation up to 3 times with a 5-second delay between attempts before marking the notification as failed

### Requirement 12: Premium Visual Effects and Micro-Interactions

**User Story:** As a visitor, I want the site to feel luxurious and polished with premium textures, shine effects, and smooth interactions, so that the brand feels high-end and professional.

#### Acceptance Criteria

1. THE Site SHALL apply a diagonal shine sweep animation (a semi-transparent white gradient moving left-to-right over 1.5 to 2.5 seconds) on all elements using the cabernet, maroon, or gold background colors, triggered on page load and repeating every 6 to 10 seconds
2. THE Site SHALL apply a subtle noise texture overlay (opacity between 0.02 and 0.05) on all colored background regions to produce a premium matte-finish appearance
3. WHEN a Visitor hovers over any button, THE Site SHALL transition the button with a scale increase to 1.03, an elevated box-shadow (0 8px 25px with accent color at 30% opacity), and a brightness increase to 1.1, all within 200 milliseconds using an ease-out timing function
4. WHEN a Visitor clicks any button, THE Site SHALL briefly scale the button to 0.97 for 100 milliseconds before returning to 1.0, producing a tactile press feedback effect
5. THE Site SHALL style all primary action buttons with a gradient fill from maroon (#800020) to cabernet (#540212), rounded corners of 8 to 12 pixels, a minimum height of 48 pixels, white text with font-weight 600, and letter-spacing of 0.5 pixels
6. THE Site SHALL style all secondary buttons with a transparent background, a 1.5-pixel solid border in gold (#D6B24C), gold text, and on hover transition to a gold background with white text within 200 milliseconds
7. WHEN a Visitor hovers over any card component (Profile_Card, category card, Portfolio_Item card), THE Site SHALL elevate the card with translateY of -4 pixels, increase box-shadow to (0 12px 30px rgba(0,0,0,0.12)), and apply a subtle border-glow using a 1-pixel gold border at 40% opacity, all within 250 milliseconds
8. THE Site SHALL apply a gold gradient underline animation on navigation links that expands from 0% to 100% width on hover over 300 milliseconds using an ease-in-out timing function
9. THE Site SHALL render section dividers as horizontal lines with a centered gold-to-transparent gradient fade, 1 pixel in height, with a maximum width of 200 pixels
10. THE Site SHALL apply a glass-morphism effect (background blur of 12 to 16 pixels, background color white at 70% opacity, and a 1-pixel border of white at 20% opacity) to the navigation bar when the page is scrolled past the Hero Intro section
11. THE Site SHALL display a soft radial gold glow (radius 150 to 250 pixels, opacity 0.08 to 0.12) behind key headings on the homepage (influencer name in Hero, section titles) to create a spotlight effect
12. WHEN the page loads, THE Site SHALL stagger the entrance of navigation menu items with a 50-millisecond delay between each item using a fade-up animation of 8 pixels over 300 milliseconds
