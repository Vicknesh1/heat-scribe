# Foundry Production Dynamic Form Prototype

## Goal
Replace the blank starter screen with a functional local-only production control prototype using the selected Frosted Inspection Board direction: steel/glass surfaces, amber/green/blue status signals, industrial typography, dense but readable tables, and a persistent sidebar shell. Skip the dashboard and open the app directly to the production workflow.

## User-visible work
1. **Local login and roles**
   - Build a login screen for the supplied Admin and User demo credentials.
   - Persist the session and demo user list in localStorage.
   - Admin sessions can access every screen; User sessions can create/submit records and only see their own records.
   - Include sign-out and a session-aware account area in the sidebar.

2. **Shared app shell and pages**
   - Add New Production Record, Production Records, and Admin Settings screens with responsive sidebar navigation.
   - Keep `/` as the login entry and use named routes for the main pages.
   - Show role-aware navigation and guard admin-only settings in the client-side prototype flow.

3. **Dynamic production form**
   - Organize the requested fields into logical sections with a progress indicator.
   - Support dropdowns, numeric fields, time fields, text inputs, textarea, read-only calculated values, conditional visibility, and grade-driven prototype auto-population.
   - Seed Grade options with 5A, 5B, and 5C; label dependent values as prototype values.
   - Calculate preheat durations and total furnace time from time inputs, including overnight-safe duration handling.
   - Leave unspecified complex calculations as `—` placeholders.
   - Validate required inputs, support Save Draft, and generate sequential `FR-YYYYMMDD-###` numbers.
   - Add a review-before-submit step and persist draft/submitted records locally.

4. **Records and admin settings**
   - Build the requested records table with role-aware filtering and status/date presentation.
   - Let Admin add, edit, and disable dropdown options and demo users through simple local controls.
   - Keep disabled options/users from being used for new entries while preserving existing record display.

5. **Visual system and metadata**
   - Replace starter color tokens with semantic industrial tokens based on the selected direction and load Chakra Petch plus IBM Plex Mono through the root head.
   - Use accessible labels, focus states, responsive layouts, reduced-motion-safe status animation, and no invented foundry formulas.
   - Add route-specific title, description, Open Graph, and Twitter metadata for each content route, removing starter metadata from the root where leaf metadata should own it.

## Technical approach
- Use React state and small local modules for storage, auth/session helpers, record models, field configuration, calculations, and form sections.
- Use localStorage only; no Lovable Cloud, backend, database, analytics, Docker, IoT, or reporting work.
- Use TanStack Router route files and `<Link>` navigation. Avoid a server-backed auth guard; hydrate local session state in the browser to prevent SSR mismatch.
- Reuse the existing Tailwind v4 setup and semantic token classes; avoid hardcoded component colors and inline visual style objects.
- Add the required demo data in the client-side storage initialization so the first production-record and records screens are useful immediately.

## Verification
- Check the build and preview diagnostics.
- Exercise both demo logins, role visibility, direct production-workflow entry, new-record validation, grade auto-population, live duration calculations, draft save, review/submit, record filtering, sign-out, and admin option/user controls.
- Verify the main screens at desktop and narrow responsive widths, including no horizontal overflow and no console/runtime errors.
