# My E-shop (MERN Stack)

MongoDB / Express / React / Node e-commerce site.

**Live:**
- Frontend: https://my-eshop-web-gag8augdere6ffb7.spaincentral-01.azurewebsites.net
- Backend API: https://my-eshop-api-aje7a6dyhhggb4fz.spaincentral-01.azurewebsites.net/api

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

## Deployment (MongoDB Atlas + Azure App Service)

The app deploys as two separate Azure App Services (backend API + frontend static site), backed by MongoDB Atlas. CI/CD is handled by `.github/workflows/deploy-backend.yml` and `.github/workflows/deploy-frontend.yml` — pushing to `main` auto-deploys whichever side changed.

### 1. MongoDB Atlas

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and, under Network Access, allow access from anywhere (`0.0.0.0/0`) — or restrict to Azure's outbound IPs once known.
3. Grab the connection string (`mongodb+srv://...`); you'll use it as `MONGO_URI` below.

### 2. Azure — create two App Services

In the [Azure Portal](https://portal.azure.com/), create one resource group, then two **Linux, Node 20 LTS** App Services in it:

- One for the backend (e.g. `my-eshop-api`)
- One for the frontend (e.g. `my-eshop-web`)

For each, under **Configuration → Application settings**, add:

**Backend App Service:**
| Setting | Value |
|---|---|
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random string |
| `CLIENT_URL` | `https://<your-frontend-app-name>.azurewebsites.net` |

**Frontend App Service:** no runtime settings needed — `VITE_API_URL` is baked in at build time (see step 3).

### 3. GitHub Actions secrets

In the GitHub repo → Settings → Secrets and variables → Actions, add:

- `AZURE_BACKEND_PUBLISH_PROFILE` — from the backend App Service's Overview page → "Download publish profile", paste the full XML content.
- `AZURE_FRONTEND_PUBLISH_PROFILE` — same, from the frontend App Service.
- `VITE_API_URL` — `https://<your-backend-app-name>.azurewebsites.net/api`

Then edit `AZURE_WEBAPP_NAME` at the top of each workflow file in `.github/workflows/` to match your actual App Service names.

### 4. Deploy

Push to `main`. Each workflow only runs when its own folder (`backend/` or `frontend/`) changes, so the two sides deploy independently. You can also trigger either manually from the GitHub Actions tab (`workflow_dispatch`).
