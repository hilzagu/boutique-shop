-- ============================================
-- BOUTIQUE SHOP - Database Schema (Supabase)
-- Run this in: Supabase Dashboard -> SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  category TEXT NOT NULL DEFAULT 'dresses',
  sizes TEXT[] NOT NULL DEFAULT ARRAY['XS', 'S', 'M', 'L', 'XL'],
  colors TEXT[] NOT NULL DEFAULT ARRAY['Black'],
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT,                          -- Supabase auth user ID (nullable for guest checkout)
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  -- Shipping address
  shipping_name TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT NOT NULL DEFAULT 'US',
  -- Payment
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  -- Totals
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- EMAILS TABLE (for tracking sent emails)
-- ============================================
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  mailgun_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

-- Orders: users can read their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (user_id = auth.uid()::text OR user_id IS NULL);

-- Order items: users can read their own order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()::text OR user_id IS NULL)
  );

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO products (slug, name, description, price_cents, category, sizes, colors, image_url, stock, featured) VALUES
('silk-wrap-dress', 'Silk Wrap Dress', 'Elegant silk wrap dress with a flattering V-neckline and tie waist. Perfect for evening occasions.', 12900, 'dresses', ARRAY['XS','S','M','L'], ARRAY['Black','Emerald','Burgundy'], 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 25, true),
('cashmere-sweater', 'Cashmere Crewneck Sweater', 'Luxuriously soft 100% cashmere sweater. Lightweight yet warm, a wardrobe essential.', 18900, 'tops', ARRAY['XS','S','M','L','XL'], ARRAY['Camel','Grey','Black','Cream'], 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 40, true),
('high-waist-trousers', 'High-Waist Wide Leg Trousers', 'Tailored wide-leg trousers with a high waist and pressed crease. Effortlessly chic.', 11900, 'bottoms', ARRAY['XS','S','M','L'], ARRAY['Black','Navy','Beige'], 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 30, true),
('linen-blazer', 'Oversized Linen Blazer', 'Relaxed-fit linen blazer with a single-button closure. Breezy and sophisticated.', 15900, 'outerwear', ARRAY['S','M','L','XL'], ARRAY['White','Sand','Olive'], 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800', 20, true),
('pleated-midi-skirt', 'Pleated Midi Skirt', 'Flowing pleated midi skirt with an elastic waistband. Moves beautifully with every step.', 8900, 'bottoms', ARRAY['XS','S','M','L'], ARRAY['Blush','Black','Sage'], 'https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=800', 35, true),
('satin-cami-top', 'Satin Camisole Top', 'Delicate satin camisole with adjustable straps and a subtle cowl neckline.', 6900, 'tops', ARRAY['XS','S','M','L'], ARRAY['Champagne','Black','Dusty Rose'], 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800', 50, true),
('wool-coat', 'Double-Breasted Wool Coat', 'Classic double-breasted wool coat with a belted waist. Timeless outerwear.', 29900, 'outerwear', ARRAY['S','M','L','XL'], ARRAY['Camel','Black','Charcoal'], 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', 15, true),
('knit-cardigan', 'Chunky Knit Cardigan', 'Oversized chunky knit cardigan with horn buttons. Cozy and effortlessly cool.', 13900, 'tops', ARRAY['S','M','L'], ARRAY['Oatmeal','Grey','Forest'], 'https://images.unsplash.com/photo-1434389677669-e08b4cead0e2?w=800', 28, true),
('satin-slip-dress', 'Satin Slip Dress', 'Bias-cut satin slip dress with delicate spaghetti straps. Understated elegance.', 10900, 'dresses', ARRAY['XS','S','M','L'], ARRAY['Champagne','Black','Silver'], 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800', 22, true),
('denim-jacket', 'Classic Denim Jacket', 'Timeless denim jacket with a slightly cropped fit. A layering staple.', 9900, 'outerwear', ARRAY['XS','S','M','L','XL'], ARRAY['Light Wash','Dark Wash'], 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800', 45, false),
('wide-leg-jeans', 'High-Rise Wide Leg Jeans', 'Vintage-inspired high-rise jeans with a wide leg and raw hem.', 8900, 'bottoms', ARRAY['XS','S','M','L','XL'], ARRAY['Light Wash','Medium Wash'], 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', 60, false),
('silk-blouse', 'Silk Button-Up Blouse', 'Classic silk button-up blouse with a relaxed fit. Versatile and polished.', 11900, 'tops', ARRAY['XS','S','M','L'], ARRAY['White','Ivory','Pale Blue'], 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800', 33, false)
ON CONFLICT (slug) DO NOTHING;
