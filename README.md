# E-Commerce (MERN Stack)

Project scaffold for a MongoDB / Express / React / Node e-commerce site.

## Structure

- `backend/` — Express + Mongoose API, connects to MongoDB Atlas via `MONGO_URI` in `.env` (see `backend/.env.example`).
- `frontend/` — React app with Vite, styled with Tailwind CSS.

## Status

- **User authentication** — done. JWT register/login/me on the backend; login/register pages, an `AuthContext`, and protected routes on the frontend.
- **Product catalog** — backend done (model, public list/detail with pagination/filter/search, admin-only CRUD). Frontend pages not built yet.
- Other features below are not implemented yet.

## Planned features

- ~~**User authentication** — registration/login with JWT, password hashing (bcrypt), protected routes, roles (customer/admin).~~ done
- ~~**Product catalog** — product model (name, description, price, images, category, stock), public listing/detail pages, admin CRUD.~~ backend done, frontend pending
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
