# ShowSzn — Tech Stack

A ticket-booking platform for movies, events, plays, sports, and activities. This document covers every technology in the stack, from language/framework up through production hosting.

## Frontend

| Technology | Version | Role |
|---|---|---|
| TypeScript | 6.0.x | Language |
| React | 19.2.x | UI library (function components + hooks only, no class components) |
| Vite | 8.2.x | Dev server + production build tool |
| @vitejs/plugin-react | 6.0.x | JSX/TSX compilation, React Fast Refresh |
| React Router | 7.18.x | Client-side routing, including a nested `/admin/*` route tree |
| TanStack Query | 5.101.x | Server-state fetching, caching, and mutations |
| Axios | 1.19.x | HTTP client (single shared instance in `lib/api.ts`, base URL `/api`) |
| Tailwind CSS | 4.3.x | Utility-first styling; all styling is inline utility classes, no CSS-in-JS |
| @clerk/clerk-react | 5.61.x | Auth UI components + session/JWT management |
| canvas-confetti | 1.9.x | Booking-confirmation celebration effect |
| qrcode | 1.5.x | Client-side QR rendering (booking reference) |
| oxlint | 1.7x | Linter (Rust-based, chosen for speed over ESLint) |

Build: `tsc -b && vite build`. Dev server proxies `/api/*` to `localhost:8080` so no CORS config is needed locally.

## Backend

| Technology | Version | Role |
|---|---|---|
| Java | 21 (LTS) | Language + runtime |
| Spring Boot | 4.1.0 | Application framework / auto-configuration |
| Spring Framework (Core, MVC) | 7.0.x | IoC container, `DispatcherServlet` request pipeline |
| Spring Data JPA | 4.1.x | Repository abstraction over JPA |
| Hibernate ORM | 7.4.x | JPA implementation (`ddl-auto: validate` — schema is owned entirely by Flyway) |
| Spring Data Redis | 4.1.x | Redis client abstraction (`StringRedisTemplate`, cache manager) |
| Spring Security + OAuth2 Resource Server | 7.1.x | Route protection, JWT validation against Clerk's JWKS |
| Jakarta Bean Validation | — | `@NotNull`/`@Positive`/etc. on every request DTO |
| Jackson | 3.1.x (`tools.jackson`) | JSON serialization (Jackson 3, not 2 — different Maven coordinates and Redis serializer) |
| Lombok | 1.18.x | `@Getter/@Setter/@Builder` codegen on JPA entities |
| Apache PDFBox | 3.0.x | Generates PDF tickets for confirmed bookings |
| ZXing (core + javase) | — | Generates the QR code embedded in each PDF ticket |
| Maven (`mvnw` wrapper) | — | Build tool, version-pinned via the committed wrapper |

Embedded Apache Tomcat 11 serves HTTP directly — no separate application server deployment.

## Database & Caching

| Technology | Role |
|---|---|
| MySQL 8.4 | Primary datastore — catalog (city/venue/screen/seat/movie/show), users, bookings, events |
| MySQL Connector/J 9.7.x | JDBC driver |
| HikariCP 7.0.x | JDBC connection pool (Spring Boot default) |
| Flyway 12.4.x (`flyway-mysql`) | Versioned schema + seed-data migrations, run automatically on startup. Every schema change lives as a numbered file under `backend/src/main/resources/db/migration/` — nothing is ever hand-run against the database outside this mechanism |
| Redis 7.x | Two jobs: (1) response caching for hot public reads via Spring's `@Cacheable`, and (2) the distributed seat-hold lock during booking (`SETNX` + TTL so two users can never hold the same seat) |

Locally, both run via Docker Compose (`docker-compose.yml` at the repo root — `mysql:8.4` and `redis:7-alpine`, healthchecked, with a named volume for MySQL persistence).

## Authentication

**Clerk** is the sole identity provider — this project never stores a password or implements its own auth flow.

- Frontend: `@clerk/clerk-react` renders the hosted sign-in UI and exposes `useAuth()`/`getToken()`; a request interceptor attaches the session JWT as a Bearer token to every API call.
- Backend: Spring Security's OAuth2 Resource Server validates each JWT against Clerk's published JWKS. A custom `ClerkJwtAuthenticationConverter` looks the user up by Clerk ID and grants `ROLE_ADMIN` if they're in the configured admin list, gating every `/api/admin/**` route.

## Email

**Resend** (transactional email API) for booking confirmations and contact-form notifications, called directly via Spring's `RestClient` — no dedicated SDK dependency.

## Deployment & Infrastructure

| Layer | Platform | Notes |
|---|---|---|
| Frontend | **Vercel** | Static Vite build, deployed via `vercel --prod`. `vercel.json` rewrites all paths to `index.html` for client-side routing. Production URL: `showszn.vercel.app` |
| Backend | **Railway** | Spring Boot app built from the committed `Dockerfile` (multi-stage: `eclipse-temurin:21-jdk` build → `eclipse-temurin:21-jre` runtime), deployed via `railway up` |
| Database | **Railway** (managed MySQL) | Private-network only (`mysql.railway.internal`); accessed externally for maintenance via `railway connect --tunnel-only` |
| Cache | **Railway** (managed Redis) | Same project, private network |
| Source control | **GitHub** (`ns5570/Showshz`) | `main` is the only branch in active use; both Vercel and Railway deploy from local builds pushed to it |

Local development uses `.env`/`.env.local` files (gitignored) for `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_BASE_URL`, `CLERK_ISSUER`, `ADMIN_EMAILS`, `RESEND_API_KEY`, and Docker Compose's MySQL/Redis credentials — all with safe defaults in `application.yml` so the backend runs locally with zero required configuration beyond Docker Compose being up.

## Architectural Patterns

- **Layered architecture** — Controller → Service → Repository, per domain package (`catalog`, `booking`, `event`, `eventbooking`, `admin`).
- **DTO pattern** — controllers never return JPA entities directly; every response is a `record` DTO built via a `from()` factory method.
- **Cache-aside** — `@Cacheable` on read paths (e.g. `CatalogService.listMoviesForCity`), `@CacheEvict` on the admin mutations that would stale them.
- **Distributed lock** — Redis `SETNX` with TTL in `SeatLockService`, the core mechanism preventing double-booked seats.
- **Versioned migrations only** — every schema or seed-data change is a new numbered Flyway file; no ad-hoc SQL against production outside that mechanism.
- **Shared presentational components** — e.g. `SeatGrid` and `BookingConfirmedCard` are reused identically by both the movie and event booking flows.
