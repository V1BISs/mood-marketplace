# 🛍️ MOOD — E‑Commerce Platform

**Full‑featured marketplace with buyer, seller, and admin roles**  
This project was built to demonstrate e‑commerce domain experience — from product management to order processing and moderation.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Roles & Features](#roles--features)
  - Buyer
  - Seller
  - Admin
- [Test Accounts](#test-accounts)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Contact](#contact)

---

## 🛠️ Tech Stack

| Technology | Logo | Purpose |
|------------|------|---------|
| **React 19** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="30" height="30"/> | UI library |
| **Redux Toolkit** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" width="30" height="30"/> | State management |
| **React Router v6** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="30" height="30"/> | Routing |
| **Vite** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="30" height="30"/> | Build tool |
| **CSS Modules** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="30" height="30"/> | Scoped styling + CSS variables |
| **localStorage** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="30" height="30"/> | Data persistence (backend simulation) |
| **react‑credit‑cards‑2** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="30" height="30"/> | Credit card display |
| **react‑phone‑number‑input** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="30" height="30"/> | Phone input masking & validation |
| **react‑icons** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="30" height="30"/> | Icons |
| **Git** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="30" height="30"/> | Version control |
| **GitHub** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="30" height="30"/> | Repository hosting |

---

## 🏗️ Architecture

The project follows **Feature‑Sliced Design (FSD)**:


```bash
src/
├── app/          # Store, router, app entry
├── features/     # Auth, products, cart, orders, seller, admin, reviews
├── shared/       # UI kit, API abstraction, hooks, contexts
```

---

## 👤 Roles & Features

### Buyer

**Registration & Login**  
Users can register as a buyer or seller. The session is stored in `localStorage` — no logout on page reload.

**Product Catalog**  
Only admin‑approved products are shown. Available filters:  
- 🔍 search by name  
- 📂 category filter  
- 💰 price range  
- 📊 sorting (price asc/desc, newest first)

**Product Page**  
Users see up to 5 images, product name, discounted price, description, and stock.  
Additional fields appear based on category:  
- clothing → sizes & colors  
- electronics → tech specifications (key‑value pairs)

**Ratings & Reviews**  
Buyers can only review products from delivered orders.  
A review includes a rating (1–5 stars) and optional comment.  
Users can edit their own reviews.  
Sellers can reply to any review on their products.  
Product rating is automatically recalculated as the average of all reviews.

**Cart**  
Products are added with stock validation (can’t exceed available quantity).  
In the cart you can:  
- change quantity (with max validation)  
- remove items  
- select items via checkboxes for partial checkout  
- select all items with one button

**Checkout**  
The buyer proceeds to checkout with selected items.  
Shipping form includes:  
- city (with live suggestions)  
- street, building, apartment (optional), entrance (optional)  
- phone (masked input + Russian number validation)

If the user has filled out their profile, phone and address are auto‑filled.

**Payment**  
Payment simulation includes:  
- card number grouping by 4 digits  
- expiry date & CVC  
- payment system detection (Visa, MasterCard) based on first digits  
- test scenarios: success, insufficient funds, blocked card

After successful payment, order status changes to `paid`, and paid items are removed from the cart.

**Order History**  
Users see all their orders sorted from newest to oldest.  
Each order includes: product list (image, name, quantity, price), total amount, status, and date.  
Orders with status `created` have a “Pay” button that leads to the payment page.

**Profile**  
Buyers can edit their name, email, phone, and delivery address.  
Data is saved to `localStorage` and reused during checkout.

---

### Seller

**Product Management**  
Sellers see only their own products. Available actions:  
- create new product  
- edit  
- delete  
- restock inventory

**Create Product**  
The creation form includes:  
- name, description, category  
- price, discount, stock, SKU  
- up to 5 images (preview, 5 MB limit per file)

Depending on the selected category, dynamic blocks appear:  
- for clothing → sizes and colors  
- for electronics → tech specifications (unlimited key‑value pairs)

New products receive status `pending` and go to admin moderation.

**Moderation Status**  
Sellers see the status of each product:  
- `pending` – awaiting review  
- `approved` – visible in the catalog  
- `rejected` – reason provided

**Seller Orders**  
Sellers see all orders that contain at least one of their products.  
Only their own items are shown (image, name, quantity, price).  
Order status can be changed:  
- `paid` → `shipped`  
- `shipped` → `delivered`

**Statistics**  
Sellers see three key metrics:  
- total revenue (sum of all paid orders for their products)  
- total units sold  
- number of orders

---

### Admin

**Product Moderation**  
Admin sees a list of all products with status `pending`.  
Clicking a product opens a modal with full details.  
Available actions:  
- **approve** – product gets `approved` and appears in the catalog  
- **reject** – reason required, product gets `rejected`

**Return to Moderation**  
In the catalog, admin sees a special button on every product card.  
Clicking it returns the product to moderation (`pending`). Useful if an error is found after approval.

**User Management**  
Admin sees a list of all users with name, email, role, and status.  
Any user except themselves can be blocked or unblocked.

**View All Orders**  
Admin sees all orders from all users (read‑only).  
Orders are sorted from newest to oldest and contain full buyer and product information.

---

## 🧪 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@example.com` | `admin` |
| 🛍️ Seller | `seller@example.com` | `seller` |
| 👤 Buyer | `buyer@example.com` | `buyer` |

### 💳 Test Cards

| Card | Number | Result |
|------|--------|--------|
| Visa (success) | `4111 1111 1111 1111` | ✅ Payment successful |
| Visa (insufficient funds) | `4111 1111 1111 1112` | ❌ Error |
| Visa (blocked) | `4111 1111 1111 1113` | ❌ Error |
| MasterCard (success) | `5555 5555 5555 4444` | ✅ Payment successful |

---

## 🚀 Getting Started

```bash
git clone https://github.com/V1BISs/mood-marketplace.git
cd mood-marketplace
bun install
bun run dev
```

---

## 🤝 How to Contribute
1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes:
```bash
git commit -m 'Add amazing feature'
```
4. Push to your fork:
```bash
git push origin feature/amazing-feature
```
5. Open a Pull Request

---

📫 Contact
For any questions or suggestions:
- Telegram: @andreyS_FrontEnd
- Email: v1bisfreelance@gmail.com
