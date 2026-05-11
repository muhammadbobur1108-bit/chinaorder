-- =============================================
-- E-Commerce Database Schema for Supabase
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  price         NUMERIC(10, 2) NOT NULL,
  old_price     NUMERIC(10, 2),                        -- for showing discount/crossed price
  images        TEXT[] NOT NULL DEFAULT '{}',          -- array of Supabase Storage URLs
  category      TEXT NOT NULL,
  sizes         TEXT[] NOT NULL DEFAULT '{}',          -- e.g. ['XS','S','M','L','XL','2XL','3XL']
  description   TEXT,
  rating        NUMERIC(2, 1) DEFAULT 4.5,
  review_count  INTEGER DEFAULT 0,
  in_stock      BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table (for tracking Telegram orders)
CREATE TABLE orders (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  telegram_username TEXT,
  items         JSONB NOT NULL,                        -- [{product_id, name, size, qty, price}]
  total_price   NUMERIC(10, 2) NOT NULL,
  status        TEXT DEFAULT 'pending',               -- pending | confirmed | shipped | delivered
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE admin_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public can READ products
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT USING (true);

-- Only authenticated users (admins) can INSERT/UPDATE/DELETE products
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Anyone can insert an order (checkout)
CREATE POLICY "Anyone can place orders"
  ON orders FOR INSERT WITH CHECK (true);

-- Only authenticated admins can view/manage orders
CREATE POLICY "Admins can manage orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- =============================================
-- Storage Bucket for Product Images
-- =============================================
-- Run this in Supabase Dashboard > Storage, OR use the API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- =============================================
-- Sample Data
-- =============================================

INSERT INTO products (name, price, old_price, category, sizes, description, rating, review_count, images) VALUES
(
  'Classic White Oversized Shirt',
  189000,
  249000,
  'Shirts',
  ARRAY['XS','S','M','L','XL','2XL','3XL'],
  'Premium cotton oversized shirt with a relaxed fit. Perfect for casual and smart-casual looks. Made from 100% organic cotton for breathability and comfort.',
  4.8, 234,
  ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600']
),
(
  'High-Waist Slim Trousers',
  245000,
  NULL,
  'Trousers',
  ARRAY['XS','S','M','L','XL','2XL'],
  'Elegant high-waist trousers with a slim fit. Versatile for office and evening wear. Features a concealed zip and hook fastening.',
  4.6, 189,
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4b4156?w=600']
),
(
  'Floral Summer Dress',
  320000,
  420000,
  'Dresses',
  ARRAY['XS','S','M','L','XL'],
  'Light and airy floral print dress, perfect for warm weather. Features adjustable straps and a flowy silhouette.',
  4.9, 412,
  ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600']
),
(
  'Leather Biker Jacket',
  890000,
  1100000,
  'Jackets',
  ARRAY['S','M','L','XL','2XL'],
  'Genuine leather biker jacket with asymmetric zip closure. A timeless wardrobe staple with a modern edge.',
  4.7, 98,
  ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600']
),
(
  'Ribbed Knit Sweater',
  215000,
  NULL,
  'Knitwear',
  ARRAY['XS','S','M','L','XL','2XL','3XL'],
  'Cozy ribbed knit sweater in a relaxed fit. Made from a soft wool blend that keeps you warm without bulk.',
  4.5, 167,
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600']
),
(
  'Wide-Leg Linen Pants',
  198000,
  260000,
  'Trousers',
  ARRAY['XS','S','M','L','XL','2XL'],
  'Breathable linen wide-leg pants perfect for summer. Features an elastic waistband and side pockets.',
  4.4, 203,
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600']
);
