# My E-shop (MERN Stack)

MongoDB / Express / React / Node e-commerce site.

## Structure

- `backend/` — Express + Mongoose API, connects to MongoDB Atlas via `MONGO_URI` in `.env` (see `backend/.env.example`).
- `frontend/` — React app with Vite, styled with Tailwind CSS.

## Status

- **User authentication** — done. JWT register/login/me on the backend; login/register pages, an `AuthContext`, and protected routes on the frontend.
- **Product catalog** — done. `Category` is its own collection (name + `isActive`); `Product.category` references it. Public list/detail (pagination/search/multi-category/price range/in-stock filters) only ever returns active products in active categories; passing `includeInactive=true` bypasses that, but only for admin-authenticated requests. Frontend: listing page with a sidebar filter panel (category checkboxes, price range, in-stock, sort) and a detail page with add-to-cart.
- **Cart & checkout** — done. Client-side cart (localStorage); checkout form creates an `Order` with server-side price/stock validation.
- **Payments** — done, but simulated: no Stripe/real gateway. Clicking "Pay now" → "Confirm payment" calls `POST /api/orders/:id/pay`, which always marks the order paid instantly.
- **Admin dashboard** — done. `/admin` (dashboard stats), `/admin/products` (list/create/edit/delete, activate/deactivate), `/admin/categories` (create, activate/deactivate, delete), `/admin/orders` (list + status updates), all gated by an `AdminRoute` that checks `role === "admin"`.

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
