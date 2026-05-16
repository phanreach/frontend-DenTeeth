# DenTeeth Project Overview

## 1) What this project is
DenTeeth is a React + TypeScript frontend for an AI-assisted dental platform. It includes:
- Public marketing/landing pages
- Authentication (sign up, login, email verification)
- Role-based protected dashboards (`ADMIN`, `DENTIST`, `PATIENT`)
- Dentist listing UI with pagination
- AI scan upload UI (frontend-only at the moment)

## 2) Tech stack
- React 19 + TypeScript
- Vite 8 (build/dev tooling)
- React Router DOM 7 (routing)
- TanStack Query 5 (server-state + async handling)
- Axios (HTTP client)
- Tailwind CSS 4 (styling)
- React Hook Form + Zod (form handling + validation)
- `js-cookie` (auth/session storage in browser cookies)
- `sonner` (toast notifications)
- Lucide icons

## 3) Project structure

### Root
- `package.json`: scripts and dependencies
- `vite.config.ts`: Vite config
- `wrangler.jsonc`: Cloudflare worker/static config hints
- `.env`: contains `VITE_BASE_URL` expected by API client

### `src/`
- `main.tsx`: app bootstrap, wraps app with `QueryClientProvider` and `BrowserRouter`
- `App.tsx`: all routes (public + protected)
- `index.css`: Tailwind import + theme variables
- `layout.tsx`: shared app-shell for protected areas (sidebar + outlet)
- `protect-route.tsx`: role gate using cookies

### `src/api/`
- `endpoint.ts`: endpoint constants
- `api.ts`: Axios instance, request/response interceptors, auth header injection, token refresh helper

### `src/auth/`
- `signup.tsx`: role-aware signup form (patient/dentist)
- `login.tsx`: login form
- `verify-email.tsx`: polling page that checks backend verification status and redirects by role

### `src/components/`
- `nav-bar.tsx`, `footer.tsx`, `side-bar.tsx`, `nav-link.tsx`, `pagination.tsx`
- `constants/data-dummy.ts`: mocked dentist list data
- `hook/auth/*`: auth hooks and verification API helpers
- `lib/schema/*`: Zod form schemas

### `src/landing/`
- `landing.tsx`: composed landing page
- `hero.tsx`, `feature.tsx`, `about-us.tsx`: marketing sections
- `dentist.tsx`, `dentist-card.tsx`: dentist directory + cards
- `ai-scan.tsx`, `upload-image.tsx`: image upload UI for AI scan workflow

### Role pages
- `src/super-admin/page/admin-dashboard.tsx`
- `src/dentist/pages/dashboard.tsx`
- `src/user/pages/home.tsx`

## 4) Routing map (`App.tsx`)

### Public routes
- `/` -> landing page
- `/sign-up` -> signup
- `/login` -> login
- `/verify-email` -> verification polling page
- `/dentist` -> dentist listing
- `/scan` -> AI scan upload page

### Protected routes
Protected routes are wrapped by `ProtectedRoute` and then `Layout`.

- `allowedRoles=["ADMIN"]`
  - `/admin/dashboard`

- `allowedRoles=["PATIENT"]`
  - `/home`

- `allowedRoles=["DENTIST"]`
  - `/dentist/dashboard`

## 5) Authentication and session flow

### Sign up flow
1. User submits signup form (`signup.tsx`), validated by Zod schema.
2. `useSignup` posts to `/auth/register`.
3. On success it stores cookies: `token`, `expiration`, `username`, `roles`, `email`, `permissions`.
4. User is redirected to `/verify-email`.

### Verify email flow
1. `verify-email.tsx` reads `email` from cookie.
2. Polls `/auth/check-verification?email=...` every ~3 seconds via React Query.
3. Once `data.data === true`, redirects by role:
- `ADMIN` -> `/admin/dashboard`
- `DENTIST` -> `/dentist/dashboard`
- otherwise -> `/home`

### Login flow
1. User submits login form (`login.tsx`), validated by `loginSchema`.
2. `useLogin` posts to `/auth/login`.
3. On success stores same session cookies.
4. Redirects by role.

### Route guarding
`protect-route.tsx`:
- Reads `roles` or `role` cookie
- Supports both JSON array and comma-separated role string
- Redirects to `/login` if missing roles
- Redirects to `/` when role exists but unauthorized

### API behavior
In `api.ts`:
- Base URL is `import.meta.env.VITE_BASE_URL` (required)
- For non-public endpoints, request is cancelled if token missing
- Adds `Authorization: Bearer <token>` if token exists
- Sets JSON `Content-Type`, except for `FormData`
- On response errors, shows toast with backend message if present

## 6) UI architecture
- Public site has a sticky `Navbar`, section-based marketing blocks, and a common `Footer`.
- Protected area uses `Layout` + `SideBar`:
- Sidebar nav items are role-dependent
- Responsive behavior collapses sidebar automatically on mobile
- Avatar and logout action are rendered in sidebar footer

## 7) Data model currently used

### Dentist type (`src/dentist/types/api.d.ts`)
Contains dentist profile fields such as:
- identity (`id`, `name`, `specialty`)
- contact/location
- availability/time slots
- `consultationFee`

### Current source
`components/constants/data-dummy.ts` exports hardcoded list of dentists used in `landing/dentist.tsx`.

## 8) What is implemented vs placeholder

### Implemented
- Auth screens and backend integration hooks
- Cookie-based role handling
- Protected route enforcement
- Dashboard shell + admin dashboard mock UI
- Dentist listing with pagination
- AI scan image upload and preview UX

### Placeholder or not wired yet
- `query-key-enums.ts` is empty
- Patient home and dentist dashboard are minimal placeholders
- Navbar/footer include links like `/history`, `/forgot-password`, `/calendar`, `/news` that do not exist in current routes
- AI scan action only logs file to console (no upload/diagnosis API call yet)
- `logoutApi` exists but sidebar logout removes only some cookies locally and does not call backend logout

## 9) Observations and risks
- Session cleanup inconsistency: logout removes `role`, `roles`, `username` only; token/permissions/email remain.
- Verification page has resend button UI but no resend API request.
- Several `console.log` statements remain in production-facing components.
- Some route links point to non-existent pages, causing navigation dead ends.
- Cookie-based auth is easy to use but not the most secure option by itself for sensitive contexts.

## 10) How to run locally
1. Ensure `.env` includes:
   - `VITE_BASE_URL=<your-backend-base-url>`
2. Install dependencies:
   - `pnpm install`
3. Start dev server:
   - `pnpm dev`
4. Build:
   - `pnpm build`

## 11) Recommended next improvements
1. Implement missing routes (`/history`, `/calendar`, `/news`, `/forgot-password`) or remove links.
2. Complete AI scan backend integration (upload endpoint + result rendering).
3. Standardize logout to clear all auth cookies and call `/auth/logout`.
4. Add central query keys in `query-key-enums.ts` and use them consistently.
5. Add role/permission utilities (single source of truth) to reduce duplicate parsing logic.
6. Add basic tests for auth hooks and protected route behavior.

---
If you want, I can also generate a second version of this file as a cleaner onboarding guide for new teammates (with quick-start diagrams and fewer internal details).
