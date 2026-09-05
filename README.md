# Next Store — Full-Stack E-Commerce Platform

Full-stack e-commerce platform built with Next.js (App Router), TypeScript, Prisma, PostgreSQL, and Stripe/PayPal.

## Demo / Links

- **Live Demo:** [Add deployment URL]
- **GitHub:** [Add repository URL]

## Project Overview

Next Store is a production-oriented e-commerce application built with the Next.js App Router. It is fully full-stack: the UI, server logic, database access, payments, and file storage all live in one codebase, with data mutations handled through Server Actions and Prisma.

Customers can browse and search a product catalog, manage a cart (as a guest or signed-in user), check out with Stripe or PayPal, leave verified-purchase reviews, save a wishlist, and manage their profile including an avatar upload.

An admin area protected by role-based authorization provides a sales dashboard with charts, product/user/order management, and server-side search with pagination.

## Key Features

### Customer

- Authentication with Auth.js (Google OAuth + credentials, JWT sessions)
- Product browsing, featured-product carousel, and deal countdown
- Server-side product search with category/price/rating filters and sorting
- Debounced, URL-driven search (query survives refresh and is bookmarkable)
- Shopping cart with guest (session-cookie) and authenticated persistence
- Guest cart merged into the user cart on sign-in
- Checkout: shipping address, payment method, order review
- Stripe payments (PaymentIntent) and PayPal payments
- Verified-purchase product reviews and ratings
- Wishlist (add/remove/toggle)
- Profile management with single-image avatar upload
- Order history and order details
- Responsive design with dark/light mode

### Admin

- Sales dashboard with revenue/orders/customers/products stats and charts
- Product CRUD with multi-image and banner upload (UploadThing)
- User management (list, edit role, delete)
- Order management (list, view, mark delivered, delete)
- Server-side search for products (name/slug/brand/category) and users (name/email)
- Debounced search with clear button, empty-result states, and pagination
- Role-based access control on every admin route

## Technical Highlights

- **Server Components + Server Actions:** pages are React Server Components that read `searchParams` and call Server Actions directly; database logic never reaches the browser.
- **Atomic, concurrency-safe stock handling:** adding to cart decrements stock with a raw SQL conditional update (`UPDATE ... SET stock = stock - qty WHERE id = ... AND stock >= qty`) inside a Prisma `$transaction`, so two simultaneous purchases cannot oversell. Order creation re-verifies each item under a `SELECT ... FOR UPDATE` row lock and reads the authoritative price from the database.
- **Idempotent Stripe payments:** PaymentIntents are created with an idempotency key and re-used if one already exists for the order; a signed Stripe webhook (`constructEvent` with the webhook secret) marks the order paid.
- **Verified-purchase reviews:** a review can only be submitted if a paid order contains the product, and the product rating is recalculated in the same transaction.
- **Dual-adapter Prisma client:** selects the Neon serverless adapter (with WebSocket) or the node-postgres adapter based on env, and retries once on transient "server closed the connection" pooler errors.
- **Guest cart:** unauthenticated carts are keyed by a `sessionCartId` cookie and merged into the user's cart inside a transaction on sign-in.
- **URL as state for search/filter/pagination:** search, filters, sorting, and pagination are encoded in query params so server components query the database with the filtered `count`, keeping pagination and results consistent.
- **Validation:** Zod schemas validate all form/server input; React Hook Form (+ `@hookform/resolvers`) drives client forms.
- **Auth.js JWT sessions:** role and id are embedded in the JWT; a `requireAdmin` guard redirects non-admins before any admin page renders.

## Tech Stack

| Category       | Technology                                   |
| -------------- | -------------------------------------------- |
| Framework      | Next.js 16 (App Router)                      |
| Language       | TypeScript                                   |
| UI             | React 19, Tailwind CSS v4, shadcn/ui         |
| Database       | PostgreSQL (Neon serverless or node-pg)      |
| ORM            | Prisma 7 (driver adapters)                   |
| Authentication | Auth.js / NextAuth v5 (Google + Credentials) |
| Validation     | Zod                                          |
| Forms          | React Hook Form                              |
| Payments       | Stripe, PayPal                               |
| File Upload    | UploadThing                                  |
| Email          | Resend + React Email                         |
| Charts         | Recharts                                     |
| Testing        | Jest + ts-jest                               |

## Architecture

```
Browser
   │
   ▼
Next.js App Router
   │
   ├── Server Components (pages read searchParams, render data)
   ├── Client Components (forms, search, carousels)
   └── Server Actions (mutations, guarded by auth/role)
          │
          ├── Auth.js (JWT sessions, Google + Credentials)
          ├── Prisma ORM ──► PostgreSQL (Neon / node-pg)
          ├── Stripe (PaymentIntent + webhook)
          ├── PayPal
          └── UploadThing (image storage)
```

## Project Structure

```
app/
├── (auth)/            # sign-in, sign-up, reset/forgot password
├── (root)/            # storefront: home, product, cart, search, checkout, orders
├── admin/             # dashboard, products, users, orders (role-protected)
├── user/              # customer profile & orders
└── api/               # auth handler, uploadthing, stripe webhook

components/
├── ui/                # shadcn/ui primitives
├── admin/             # admin forms, search, sidebar
└── shared/            # header, product cards, pagination, dialogs

lib/
├── actions/           # Server Actions: product, cart, order, payment, user, review, wishlist
├── generated/prisma/  # generated Prisma client
├── validators.ts      # Zod schemas
└── constants/         # app constants

prisma/
└── schema.prisma      # data model & migrations

db/                    # Prisma client (dual adapter) + seed
```

## Database / Core Data Model

```
User ──┬── Cart ──┐
       ├── Order ──┴── OrderItem ──► Product
       ├── Review ──────────────────► Product
       ├── Wishlist ────────────────► Product
       ├── Account / Session        (Auth.js)
       └── PasswordResetToken

Product ──┬── OrderItem
          ├── Review
          └── Wishlist
```

`Cart` holds items as JSON and is linked either to a `userId` (authenticated) or a `sessionCartId` (guest). `Order`/`OrderItem` capture purchases; `Review` enforces verified purchases; `Product.stock` is decremented atomically.

## Important Engineering Decisions

- **Inventory under concurrency:** stock is reserved when an item enters the cart using an atomic conditional decrement, and order placement re-locks rows (`FOR UPDATE`) and re-reads prices from the DB. This avoids lost updates and price tampering without a separate reservation table.
- **Server-side data access:** all Prisma queries live in Server Actions or Server Components. Client components only receive plain, serialized data, which keeps credentials and query logic off the client and reduces the attack surface.
- **Authentication & authorization:** Auth.js with JWT sessions stores `id` and `role` in the token. Every admin page calls `requireAdmin()` server-side, redirecting non-admins before render, so authorization is enforced at the data layer rather than hidden UI.
- **Search & pagination via the URL:** search input is debounced (~400ms) and pushed into `?query=`; the server component queries with the same `where` for both the rows and the `count`, so pagination totals always reflect the filtered result set and searches are shareable/refresh-safe.
- **Validation strategy:** Zod schemas are the single source of truth, shared between client form resolvers (React Hook Form) and server-side parsing in Server Actions, preventing invalid data from reaching the database even if client validation is bypassed.

## Setup

```bash
git clone [repository-url]
cd e-commerce
npm install
```

Create `.env.local` (or `.env`) with the variables the project reads:

```env
# Database
DATABASE_URL=
NEON=                      # set to 1/true to use the Neon serverless adapter

# Auth
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# App
NEXT_APP_NAME=
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Payments
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_API_URL=            # e.g. https://api-m.sandbox.paypal.com

# Uploads & Email
UPLOADTHING_TOKEN=
RESEND_API_KEY=
SENDER_EMAIL=
```

## Database Setup

```bash
npx prisma generate     # runs automatically on npm install via postinstall
npx prisma migrate dev  # apply migrations
```

Seed sample data (products + users) with:

```bash
npx ts-node db/seed.ts
```

## Running Locally

```bash
npm run dev
```

Open http://localhost:3000

Production:

```bash
npm run build
npm start
```

## Testing / Verification

- Unit tests with Jest (`npm test`) cover cart actions, pagination, and PayPal helpers (`test/`).
- TypeScript type-checking and ESLint are configured and pass.
- The production build (`npm run build`) completes successfully.

## Screenshots

Screenshots will be added here.

## Future Improvements

- Expand automated test coverage (integration/e2e)
- Order status email notifications beyond the purchase receipt
- Additional admin analytics (traffic, conversion)

## Author

- **Name:** [Rajal Suwal]
- **Portfolio:** [Add portfolio URL]
- **GitHub:** [https://github.com/Rajal7777]
- **LinkedIn:** [https://www.linkedin.com/in/rajal-suwal-158986165/]
