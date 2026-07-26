# E-Commerce (MERN Stack)

Project scaffold for a MongoDB / Express / React / Node e-commerce site.

## Structure

- `backend/` — Express + Mongoose API, connects to MongoDB Atlas via `MONGO_URI` in `.env` (see `backend/.env.example`).
- `frontend/` — React app scaffolded with Vite, styled with Tailwind CSS.

## Status

Both projects are initialized (dependencies installed, dev servers runnable) but no e-commerce features are implemented yet. This README tracks the planned feature roadmap.

## Planned features

- **User authentication** — registration/login with JWT, password hashing (bcrypt), protected routes, roles (customer/admin).
- **Product catalog** — product model (name, description, price, images, category, stock), public listing/detail pages, admin CRUD.
- **Cart & checkout** — client-side/server-synced cart, order creation, order history.
- **Payments** — Stripe integration (test mode) for checkout.
- **Admin dashboard** — manage products, view orders, basic sales overview.

## Getting started

### Backend

```bash
cd backend
cp .env.example .env   # then fill in your MongoDB Atlas connection string and a JWT secret
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```
