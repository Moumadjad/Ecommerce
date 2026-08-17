# My E-shop (MERN Stack)

MongoDB / Express / React / Node e-commerce site.

## Structure

- `backend/` — Express + Mongoose API, connects to MongoDB Atlas via `MONGO_URI` in `.env` (see `backend/.env.example`).
- `frontend/` — React app with Vite, styled with Tailwind CSS.

## Status

- **User authentication** — done. JWT register/login/me on the backend; login/register pages, an `AuthContext`, and protected routes on the frontend.
- **Product catalog** — done. `Category` is its own collection (name + `isActive`); `Product.category` references it. Public list/detail (pagination/search/multi-category/price range/in-stock filters) only ever returns active products in active categories; passing `includeInactive=true` bypasses that, but only for admin-authenticated requests. Frontend: listing page with a sidebar filter panel (category checkboxes, price range, in-stock, sort) and a detail page with add-to-cart.
- **Cart & checkout** — done. Client-side cart (localStorage); checkout form creates an `Order` with server-side price/stock validation. Every order gets a sequential, human-readable `orderNumber` (e.g. `ORD-000042`), generated via an atomic `Counter` document so it's safe under concurrent checkouts.
- **Payments** — done, but simulated: no Stripe/real gateway. Clicking "Pay now" → "Confirm payment" calls `POST /api/orders/:id/pay`, which always marks the order paid instantly.
- **Currency** — displayed as FCFA everywhere (`formatCurrency` in `frontend/src/lib/currency.js`: thousand separators, no decimals). Seed product prices were rescaled from their original USD-scale values to realistic FCFA amounts (~×600, rounded to the nearest 500).
- **Admin dashboard** — done. `/admin` (dashboard stats), `/admin/products` (list/create/edit/delete, activate/deactivate, search, page size), `/admin/categories` (create, activate/deactivate, delete, search, page size), `/admin/orders` (list + status updates, search by customer, page size, filter by a specific customer via `?user=`) with a full `/admin/orders/:id` detail view (order number, customer, items, shipping address, status), `/admin/users` (role toggle, activate/deactivate, delete, search, page size, link to that user's orders), all gated by an `AdminRoute` that checks `role === "admin"`. A deactivated user is blocked at login and their session token is rejected in real time; an admin can't modify or delete their own account.

## Getting started

### Backend

```bash
cd backend
cp .env.example .env   # then fill in your MongoDB Atlas connection string and a JWT secret
npm run dev
```

Seed the database with sample users, categories, products, and orders:

```bash
npm run seed           # wipes users/categories/products/orders and inserts fresh sample data
npm run seed:destroy   # wipes users/categories/products/orders without reinserting
```

Seeded accounts (all customer passwords are `customer1234`):

- `admin@example.com` / `admin1234` (admin)
- `customer@example.com` (Jane Customer) — 3 orders
- `john@example.com` (John Mensah) — 3 orders
- `amina@example.com` (Amina Diallo) — 3 orders

The 9 seeded orders span every status (pending/paid/shipped/delivered/cancelled) with backdated timestamps (0–30 days ago), so the admin dashboard and orders list have realistic data to look at immediately after seeding.

### Frontend

```bash
cd frontend
cp .env.example .env   # points VITE_API_URL at the backend (defaults to http://localhost:5000/api)
npm run dev
```
