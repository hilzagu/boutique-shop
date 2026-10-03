# Boutique Shop Mobile App

React Native mobile app for the Boutique Shop, built with Expo.

## Features

- Same Supabase database as the web app
- Google Sign-In authentication
- Real-time cart sync between web and mobile
- Product browsing with category filters
- Product detail pages with size/color/quantity selection
- Checkout flow

## Setup

### 1. Install dependencies

```bash
cd mobile
npm install
```

### 2. Configure environment

Create a `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up Supabase Auth

In your Supabase dashboard:
1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google Client ID and Secret
4. Add redirect URL: `com.boutiqueshop.app://auth/callback`

### 4. Create cart_items table

Run this in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own cart"
  ON cart_items FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete own cart"
  ON cart_items FOR DELETE USING (user_id = auth.uid()::text);
```

### 5. Enable Realtime

In Supabase dashboard:
1. Go to **Database** → **Replication**
2. Enable replication for `cart_items` table

### 6. Start the app

```bash
npx expo start
```

## Testing on Your Phone

### Option 1: Expo Go (Easiest)

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Run `npx expo start`
3. Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
4. The app loads instantly — no build needed

### Option 2: Development Build (Production-like)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for your platform
eas build --platform ios --profile development
# or
eas build --platform android --profile development
```

## Real-time Cart Sync

The cart syncs in real-time between web and mobile using Supabase Realtime:

- Add item on web → instantly appears on mobile
- Remove item on mobile → instantly disappears on web
- Quantity changes sync across all devices

Both apps must be logged in with the same Google account.

## Project Structure

```
mobile/
├── src/
│   ├── app/
│   │   ├── _layout.tsx          # Root layout with providers
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx      # Tab navigation
│   │   │   ├── index.tsx        # Shop/home screen
│   │   │   ├── cart.tsx         # Cart screen
│   │   │   └── profile.tsx      # Profile/auth screen
│   │   ├── product/[slug].tsx   # Product detail
│   │   ├── checkout.tsx         # Checkout
│   │   └── auth.tsx             # Auth screen
│   ├── components/              # Reusable components
│   ├── context/
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── CartContext.tsx      # Cart state with realtime sync
│   └── lib/
│       └── supabase.ts          # Supabase client + realtime
├── app.json                     # Expo config
├── package.json
└── tsconfig.json
```
