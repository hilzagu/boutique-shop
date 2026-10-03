-- ============================================
-- CART TABLE - For Mobile App & Web Cart Sync
-- Run this in: Supabase Dashboard -> SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_image TEXT,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Row Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own cart
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own cart"
  ON cart_items FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own cart"
  ON cart_items FOR DELETE USING (user_id = auth.uid()::text);

-- Enable Realtime for cart sync
-- Go to: Supabase Dashboard -> Database -> Replication
-- Enable replication for "cart_items" table
