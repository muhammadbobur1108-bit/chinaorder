# VelaShop — E-Commerce Clothing Store

A full-featured e-commerce website built with React + Vite + Tailwind CSS + Supabase.

---

## 📁 Project Structure

```
velashop/
├── public/
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   └── AdminPanel.jsx       # Admin login + dashboard
│   │   ├── Cart/
│   │   │   └── CartSidebar.jsx      # Slide-in cart + checkout + Telegram
│   │   ├── Layout/
│   │   │   ├── Header.jsx           # Sticky header, search, category nav
│   │   │   └── HeroBanner.jsx       # Hero section
│   │   └── Product/
│   │       ├── ProductCard.jsx      # Uzum-style product card (6-col grid)
│   │       └── ProductModal.jsx     # Full detail modal with image gallery
│   ├── hooks/
│   │   └── useCart.js               # Cart state management
│   ├── lib/
│   │   └── supabaseClient.js        # Supabase client + all API helpers
│   ├── App.jsx                      # Router: / and /admin
│   ├── main.jsx
│   └── index.css
├── supabase_schema.sql              # ← Run this in Supabase SQL Editor
├── .env.example                     # ← Copy to .env
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Setup Guide

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the **SQL Editor** and paste the contents of `supabase_schema.sql` — run it
3. Go to **Storage → Buckets** and create a bucket named `product-images` (set it to **Public**)
4. Copy your **Project URL** and **anon/public API key** from Settings → API

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up Telegram integration
In `src/components/Cart/CartSidebar.jsx`, line 9:
```js
const TELEGRAM_USERNAME = 'your_telegram_username'; // ← Change this
```

### 5. Create Admin user
In Supabase Dashboard → Authentication → Users → **Add User**
Use that email/password to log in at `/admin`.

### 6. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🛒 Features

| Feature | Status |
|---|---|
| Product grid (6 col desktop, 2 col mobile) | ✅ |
| Product cards with rating, installment, discount | ✅ |
| Product detail modal (gallery + size selector) | ✅ |
| Cart sidebar with qty controls | ✅ |
| Checkout form → Telegram order | ✅ |
| Admin login (Supabase Auth) | ✅ |
| Admin: Add / Edit / Delete products | ✅ |
| Admin: Multi-image upload to Supabase Storage | ✅ |
| Search + category filter | ✅ |
| Fully responsive (mobile + desktop) | ✅ |

---

## 🎨 Design

- **Brand color:** `#7000ff` (purple)
- **Font:** System UI / Tailwind default
- **Background:** White + Gray-50
- **Mobile-first** responsive design

---

## 🗃 Database Schema

See `supabase_schema.sql` for the full schema including:
- `products` table with UUID, images array, sizes array
- `orders` table for Telegram order tracking
- Row Level Security (RLS) policies
- Sample product data
