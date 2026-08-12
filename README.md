# E-Commerce (MERN Stack)

Project scaffold for a MongoDB / Express / React / Node e-commerce site.

## Structure

- `backend/` — Express + Mongoose API, connects to MongoDB Atlas via `MONGO_URI` in `.env` (see `backend/.env.example`).
- `frontend/` — React app with Vite, styled with Tailwind CSS.

## Status

- **User authentication** — done. JWT register/login/me on the backend; login/register pages, an `AuthContext`, and protected routes on the frontend.
- **Product catalog** — done. Backend model + public list/detail (pagination/filter/search) + admin-only CRUD; frontend listing and detail pages with add-to-cart.
- **Cart & checkout** — done. Client-side cart (localStorage); checkout form creates an `Order` with server-side price/stock validation.
- **Payments** — done, but simulated: no Stripe/real gateway. Clicking "Pay now" → "Confirm payment" calls `POST /api/orders/:id/pay`, which always marks the order paid instantly.
- **Admin dashboard** — backend done (`GET /api/admin/stats`: revenue, order counts by status, low-stock products, recent orders — plus the existing product CRUD and order listing/status routes). Frontend not built yet.

## Planned features

- ~~**User authentication** — registration/login with JWT, password hashing (bcrypt), protected routes, roles (customer/admin).~~ done
- ~~**Product catalog** — product model (name, description, price, images, category, stock), public listing/detail pages, admin CRUD.~~ done
- ~~**Cart & checkout** — client-side/server-synced cart, order creation, order history.~~ done
- ~~**Payments** — Stripe integration (test mode) for checkout.~~ replaced with a simulated instant-success payment (no real gateway), done
- ~~**Admin dashboard** — manage products, view orders, basic sales overview.~~ backend done, frontend pending

## Getting started

### Backend

```bash
cd backend
cp .env.example .env   # then fill in your MongoDB Atlas connection string and a JWT secret
npm run dev
```

Seed the database with sample users (`admin@example.com` / `admin1234`, `customer@example.com` / `customer1234`) and products:

```bash
npm run seed           # wipes users/products and inserts fresh sample data
npm run seed:destroy   # wipes users/products without reinserting
```

### Frontend

```bash
cd frontend
cp .env.example .env   # points VITE_API_URL at the backend (defaults to http://localhost:5000/api)
npm run dev
```
