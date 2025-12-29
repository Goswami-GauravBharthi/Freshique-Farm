# FreshiqueFarm

**FreshiqueFarm** is a full-stack marketplace for farm produce that connects consumers and farmers — featuring a React + Vite frontend (consumer client and admin panels) and a Node/Express + MongoDB backend. The platform supports farmer profiles, product listings (with image uploads via Cloudinary), carts, orders (per-farmer order separation), a blog system, and admin dashboards for management.

---

## Table of Contents 📚

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
  - [Client (consumer)](#client-consumer)
  - [Admin Panel](#admin-panel)
  - [Server (API)](#server-api)
- [Getting Started (Setup)](#getting-started-setup)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Run Locally](#run-locally)
- [API Reference 🔌](#api-reference-🔌)
  - [Authentication (/api/auth)](#authentication-apiauth)
  - [Products (/api/product)](#products-apiproduct)
  - [Cart (/api/cart)](#cart-apicart)
  - [Orders (/api/order)](#orders-apiorder)
  - [Analytics (/api/analytics)](#analytics-apianalytics)
  - [Blogs (/api/blogs)](#blogs-apiblogs)
  - [Admin (/api/admin)](#admin-apiadmin)
- [Key Models & Behavior](#key-models--behavior)
- [Notes & Tips](#notes--tips)
- [License & Contact](#license--contact)

---

## Project Overview

FreshiqueFarm is a two-sided marketplace where:
- Farmers can register, create a profile, add products with photos, manage orders, and publish blogs.
- Consumers can browse products, add items to the cart, place orders, and view farmer profiles and blogs.
- Admins can manage farmers, products, blogs, and view high-level statistics.

The backend exposes REST APIs; the client and admin UIs are separate Vite + React apps.

---

## Tech Stack 🔧

- Frontend: React (Vite), Tailwind CSS, React Router, React Query, Redux Toolkit (client cart & auth state)
- Backend: Node.js, Express, MongoDB (Mongoose)
- Authentication: JWT stored in httpOnly cookies
- File upload / hosting: Cloudinary (images)
- Dev tools: Vite, ESLint

---

## Repository Structure 🗂️

Top-level folders:

- `client/` — consumer-facing React app
- `admin/` — admin dashboard React app
- `server/` — Express API server and database models

### Client (consumer)

Key files & folders:
- `src/` — application source code
  - `pages/` — consumer pages: `Home.jsx`, `Market.jsx`, `SingleProduct.jsx`, `Profile.jsx`, `PlaceOrder.jsx`, etc.
  - `components/` — UI components and shared widgets
  - `apis/` — wrappers for axios/http requests (`api.js`, `aiApi.js`)
  - `store/` — redux slices: `authSlice.js`, `cartSlice.js`, `filterSlice.js`
  - `utils/` — helpers like `favorites.js` and `sound.js`
- `.env` — `VITE_API_URL` points to backend base URL

How it works: the client uses `VITE_API_URL` to communicate with the backend; authentication relies on the server setting a secure httpOnly JWT cookie.

### Admin Panel

Key files & folders:
- `src/` — admin UI
  - `pages/` — dashboard pages for analytics, farmers, blogs, etc.
  - `api/api.js` — admin API helper
  - `components/ProtectedLayout.jsx`, `SideBar.jsx` — admin UI structure

### Server (API)

Key folders & files:
- `server.js` — app entry, mounts routers
- `Routes/` — routers grouped by domain
  - `auth.routes.js`, `product.routes.js`, `cart.routes.js`, `order.routes.js`, `analytics.routes.js`, `blog.routes.js`, `admin.routes.js`
- `Controllers/` — endpoint implementations; business logic
- `models/` — Mongoose models (`user.model.js`, `product.model.js`, `order.model.js`, `blog.model.js`, `message.model.js`)
- `middleware/` — `auth.middleware.js` (JWT validation), `admin.middleware.js`, `multer.js` for parsing multipart uploads
- `config/` — `db.js`, `cloudinary.js`

---

## Getting Started (Setup) 🚀

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (Atlas or local)
- Cloudinary account (for image uploads)

### Environment variables

Create `.env` in `server/` with at least:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
ORIGIN=http://localhost:5173
ORIGIN2=http://localhost:5174
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=your_admin_password
```

Client and Admin each use `.env` with:

```
VITE_API_URL=http://localhost:4000
```

(Adjust to your deployed backend URL in production.)

### Run Locally

1. Install dependencies and start backend server:

```bash
cd server
npm install
npm run dev         # starts server on port 4000 by default
```

2. Start consumer client:

```bash
cd client
npm install
npm run dev         # open http://localhost:5173 by default
```

3. Start admin panel:

```bash
cd admin
npm install
npm run dev
```

---

## API Reference 🔌

Base URL: `http://localhost:4000/api`

> Note: Authentication uses a JWT stored as an httpOnly cookie named `token` (for users) or `adminToken` (for admin). Some routes require `authMiddleware` and/or `authFarm` role enforcement.

### Authentication — /api/auth

- POST /api/auth/register
  - Multipart/form-data: fields: `email`, `password`, `role` (e.g., `consumer` or `farmer`), `fullName`, `phoneNumber`, `location` (JSON string), `profilePicture` (file)
  - Response: success, message; sets httpOnly `token` cookie
- POST /api/auth/login
  - JSON: `{ email, password, role }`
  - Response: success, message; sets httpOnly `token` cookie
- POST /api/auth/logout
  - Clears cookie
- GET /api/auth/profile
  - Auth required; returns current user (excludes password)
- GET /api/auth/farmer-profile (GET for farmer to view own profile)
  - Auth+farmer role required
- GET /api/auth/farmer-profile-user/:id
  - Fetch public profile for a farmer by `id`
- PATCH /api/auth/change-password
  - Auth required: `{ newPassword, confirmPassword }`

### Products — /api/product

- POST /api/product/add
  - Auth + farmer role required; multipart/form-data
  - Fields: `name`, `description`, `category`, `quantityAvailable`, `unit`, `pricePerUnit`, photos: `photo0`, `photo1`, `photo2`, `photo3`
  - Response: success message
- GET /api/product/category
  - Returns grouped products for categories (fruits, vegetables, dairy)
- GET /api/product/all-products
  - Returns all products
- GET /api/product/my-products
  - Auth + farmer role; returns products owned by logged-in farmer
- DELETE /api/product/:id
  - Auth + farmer role; deletes product by id (owner-only)
- GET /api/product/:id
  - Public: returns single product + related products

### Cart — /api/cart

- POST /api/cart/add
  - Auth required; body: `{ product }` (product object with productId, price, quantity, etc.)
- POST /api/cart/remove
  - Auth required; body: `{ productId }`
- GET /api/cart/get-cart
  - Auth required; returns cart items
- POST /api/cart/update-cart
  - Auth required; body: `{ productId, quantity }`

### Orders — /api/order

- POST /api/order/place-order
  - Auth required; body: `{ shippingAddress, paymentMethod?, deliveryCharge? }` — this will create one order per farmer with grouped items
- GET /api/order/user-orders
  - Auth required; returns orders placed by logged-in consumer
- GET /api/order/farmer-orders
  - Auth + farmer role; returns orders for that farmer
- PATCH /api/order/:orderId/status
  - Auth required (farmer) to update order status (e.g., `processing`, `shipped`, `delivered`)
- GET /api/order/top-farmers
  - Public: returns top farmers aggregator

### Analytics — /api/analytics

- GET /api/analytics/farmer
  - Auth + farmer role; returns farmer-specific analytics (sales, growth, etc.)

### Blogs — /api/blogs

- POST /api/blogs
  - Auth + farmer role; create a blog: `{ title, description, image }`
- GET /api/blogs/myblogs
  - Auth + farmer role; returns farmer's blogs
- GET /api/blogs
  - Public: list all blogs
- GET /api/blogs/:id
  - Public: get blog details
- DELETE /api/blogs/:id
  - Auth + farmer role; deletes own blog
- POST /api/blogs/:id/like
  - Auth required; toggles like for the given blog id

### Admin — /api/admin

- POST /api/admin/login
  - Body: `{ email, password }` — uses `ADMIN_EMAIL` and `ADMIN_PASS` from server `.env` for simple admin auth; sets `adminToken` cookie
- POST /api/admin/logout
  - Protected; clears `adminToken`
- GET /api/admin/check-auth
  - Protected; checks admin cookie
- GET /api/admin/stats
  - Protected; returns overall statistics
- GET /api/admin/farmers
  - Protected; list all farmers
- GET /api/admin/products
  - Protected; list all products
- GET /api/admin/blogs
  - Protected; list all blog oversights
- DELETE /api/admin/farmers/:id
  - Protected; delete a farmer by id

---

## Key Models & Behavior

- User: roles: `consumer`, `farmer`; password stored hashed; `cartItems` embedded into user for simplicity
- Product: belongs to a `farmer`, supports multiple `photos` (Cloudinary URLs)
- Order: created per-farmer (one order for each farmer included in a consumer's cart) to simplify fulfillment
- Blog: authored by farmers; supports likes by authenticated users

---

## Notes & Tips 💡

- Image uploads: handled via `multer` to a temporary local file, then uploaded to Cloudinary. Ensure Cloudinary env vars are set.
- JWT auth: look into `server/middleware/auth.middleware.js` — token is read either from `Authorization: Bearer <token>` header or cookie `token`.
- For production deployments, secure cookies (`secure: true` and `sameSite: 'none'`) assume HTTPS and correct CORS origins; set the `ORIGIN` / `ORIGIN2` env vars accordingly.
- To test APIs quickly, use Postman or Insomnia and make sure you accept cookies for auth flows.

---

## Contributing & Development ✅

- Follow coding styles used in project (ES modules, eslint rules). The repository contains basic ESLint and Vite configs for frontend and admin.
- Add tests and documentation for any new endpoints.

---

## License & Contact

This repo contains all source code for FreshiqueFarm. For questions, open an issue or contact the project owner.

---

**Happy farming! 🌱**

