# ShowSzn

A ticket booking platform for movies, events, and doctor/appointment bookings with seat selection and payments built with:

- **Backend**: Spring Boot 4 (Java 21), MySQL, Flyway, Redis
- **Frontend**: React + Vite + TypeScript, Tailwind CSS, TanStack Query
- **Auth**: Clerk
- **Payments**: Stripe

## Project layout

```
showszn/
  backend/    Spring Boot API
  frontend/   React app
  docker-compose.yml   MySQL + Redis for local dev
```

## Prerequisites

- Java 21, Node 20+, Docker Desktop (all already installed as of this writing)
- A [Clerk](https://clerk.com) account (free) — for auth
- A [Stripe](https://stripe.com) account (free, test mode) — for payments

## Local setup

1. **Start infra** (MySQL + Redis):
   ```
   docker compose up -d
   ```
   Check both containers are healthy with `docker ps` before moving on.

2. **Backend:** copy `backend/.env.example` to `backend/.env` and fill in `CLERK_ISSUER`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_EMAILS`. Spring Boot does **not** auto-load `.env` files (no dotenv plugin in `pom.xml`), so you must export those vars into the shell before starting it — just having the file there is not enough:
   ```
   cd backend
   set -a && source .env && set +a
   ./mvnw spring-boot:run
   ```
   Runs on http://localhost:8080. Verify with:
   ```
   curl http://localhost:8080/api/public/health
   ```

3. **Frontend:** copy `frontend/.env.example` to `frontend/.env` and fill in `VITE_CLERK_PUBLISHABLE_KEY`. Then:
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Runs on http://localhost:5173. Vite reads `frontend/.env` automatically — no manual sourcing needed there.

## Troubleshooting

- **Backend fails to compile with `SecurityConfig.java: cannot be applied to given types`** — `securityFilterChain` was calling the `corsConfigurationSource()` `@Bean` method directly with no arguments, but that method requires the `@Value`-injected `allowedOrigins` String. Fix: have Spring inject the bean instead of self-invoking the method, i.e. `securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource)` and reference the parameter, not the method call.
- **`docker compose up -d` containers already running from a previous session** — check with `docker ps` before starting; `showszn-mysql` and `showszn-redis` persist data in the `showszn-mysql-data` volume across restarts.
- **Payment flows fail** — `backend/.env` needs `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` filled in (not just `CLERK_ISSUER`/`ADMIN_EMAILS`); without them Stripe-dependent endpoints will error even though the app otherwise boots fine.
- **Backend boots but Clerk auth / admin emails / mail all silently don't work** — `backend/.env` exists but wasn't sourced into the shell before `./mvnw spring-boot:run`. Spring Boot only reads real environment variables, not the `.env` file itself; always run `set -a && source .env && set +a` in `backend/` first.
- **Booking confirmation emails never arrive** — `application.yml`'s mail block needs `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` (e.g. `smtp.gmail.com` + a Gmail App Password, not your regular account password) set in `backend/.env`; with a blank host the send fails silently and is only visible as a warning in the backend log.

## Build roadmap

1. ✅ Scaffolding
2. Data model (cities, theaters, screens, movies, shows, seats, doctor/appointment contexts)
3. Auth (Clerk + backend JWT verification)
4. Browse movies/shows and doctor listings
5. Seat selection & locking (Redis)
6. Payments (Stripe)
7. Admin panel
8. Polish & deploy
