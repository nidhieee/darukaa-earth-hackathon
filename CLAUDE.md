# Darukaa.Earth Architecture & Context

This is a full-stack geospatial dashboard for carbon/biodiversity projects.

## Tech Stack
- **Frontend (web/):** React (Vite) + Mapbox GL JS + mapbox-gl-draw + Chart.js
- **Backend (api/):** FastAPI + SQLAlchemy + GeoAlchemy2
- **Database:** Supabase Postgres with PostGIS extension enabled
- **Auth:** custom JWT (PyJWT/python-jose + passlib) issued by api/
- **Deploy:** Vercel (web/), Render.com (api/)
- **CI:** GitHub Actions

## Structure
- `api/`: Python FastAPI application
- `web/`: React frontend application
- `supabase/`: SQL migrations and schema
- `docs/`: Project documentation

Read the relevant files in `docs/` for specific module instructions.

## Non-negotiable requirements checklist
- [x] End-to-end authentication (login/register via API)
- [x] Project and Site creation
- [x] Map view with polygon drawing (mapbox-gl-draw)
- [x] Site detail analytics chart (Chart.js)

## Progress Log
- **2026-09-17**: Implemented FastAPI backend and React frontend. Created auth flow, project/site management, map drawing, and analytics charts. Backend and frontend are fully integrated and working.
- **2026-09-18**: Fixed "Back to Map" routing bug by adding `project_id` to the `SiteOut` response schema. Completed a comprehensive UI/UX overhaul across all React pages with a consistent CSS variable theme, split-layout Project Map with a sidebar, and refined typography and spacing.
- **2026-09-18 (Phase 2)**: Replaced placeholder text with the actual `logo.jpg`. Updated the color palette with real brand values (`--color-primary`, `--color-brand`, `--color-accent-lime`). Restructured Login and Register into a unified `AuthPage` with a sliding pill toggle.
- **2026-09-18 (Phase 3)**: Fixed AuthPage `/dashboard` navigation bug by awaiting `getMe()` before resolving login/register. Cleaned up dead auth page references. Restructured AuthPage layout to completely remove the navbar and center the logo above the auth card. Added a persistent footer to all authenticated pages. Implemented full mobile responsiveness across all components (navbar wrapping, fluid card grids, Map/Sidebar stacking, and fluid Chart.js height).
- **2026-09-18 (Phase 4)**: Added global loading state for initial AuthContext mount to fix page refresh race conditions. Enlarged AuthPage forms significantly and applied `auth_bg.jpg` with a dark overlay to the auth background. Fixed Footer color and made it persistent on the auth page. Standardized all primary action buttons to use solid `--color-brand` with consistent lighter-green hover states.
- **2026-09-18 (Phase 5)**: Added route guard in `AuthPage.jsx` to immediately navigate authenticated users back to `/dashboard`, preventing access to the login/register forms when already logged in. Removed `auth_bg.jpg` to revert the auth page background back to the clean `--color-bg`. Overhauled primary button styles universally: buttons now use `--color-primary` with a 2px solid border, and transition to a white background with `--color-primary` text on hover for a cleaner, high-contrast interaction.
- **2026-09-18 (Phase 6)**: Added `framer-motion` to implement micro-animations across the app (route transitions, button tap scaling, staggering dashboard project cards, red health badge pulsing, and logout icon hover slide). Refactored Navbar to contain the "New Project" button, removed the Dashboard link when active, and condensed the profile into an avatar with a dropdown. Implemented global custom scrollbars, footer gradients, wider 1400px maximum content width, fully pill-shaped 9999px rounded buttons, and constrained the AuthPage to 100vh with no scroll.
- **2026-09-18 (Phase 7)**: Overhauled button hover states to use a sleek `brightness(1.12)` glare rather than a solid color swap, applying this consistently across all primary buttons including "New Project". Re-themed the AuthPage with a sophisticated dark radial gradient, constrained the container to `100dvh` to permanently eliminate scrollbars, and colored the tab slider dark green. Improved the profile dropdown alignment with a caret arrow. Added animated underline effects to nav links, focus rings to all form inputs, staggered list animations on the `ProjectMap` sidebar, and added subtle box shadows to all cards for enhanced depth.
- **2026-09-18 (Phase 8)**: Reverted the footer background to solid `--color-primary`. Swapped `logo.jpg` with a clean `logo-removebg.png` globally. Fixed the profile dropdown overflow by strictly styling padding (`20px`) and setting the logout button to full width `box-sizing: border-box`. Compacted the "New Project" navbar button into a neat `40px` circular icon button with a Plus sign. Enhanced the "Open Map" button on project cards to span the full width of the card with larger touch-friendly padding.
- **2026-09-18 (Phase 9)**: Created a new `<GlareHover>` component to handle advanced hover states universally using Framer Motion, creating a white animated diagonal sheen across buttons on hover instead of a flat brightness filter. Shifted the AuthPage logo inside the white container, resizing it nicely to fit. Swapped native `alert` calls for `react-hot-toast` notifications, adding subtle and elegant feedback for login, registration, project creation, and site drawing. Enforced `100dvh` strict height bounds on the AuthPage with conditional footer rendering to guarantee no scrollbars.
