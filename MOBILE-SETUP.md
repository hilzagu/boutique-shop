# Mobile App Setup Guide

## Quick Start

### 1. Create the Cart Table

In Supabase Dashboard → **SQL Editor**, run the contents of:
```
sql/cart-schema.sql
```

### 2. Enable Realtime

1. Go to **Database** → **Replication**
2. Find `cart_items` in the table list
3. Toggle it **ON**

### 3. Configure Google Auth in Supabase

1. Go to **Authentication** → **Providers**
2. Click **Google**
3. Enable it
4. Enter your Google Client ID and Secret (from Google Cloud Console)
5. Add redirect URL: `com.boutiqueshop.app://auth/callback`
6. Save

### 4. Set Up Mobile App

```bash
cd mobile
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Install & Run

```bash
npm install
npx expo start
```

---

## Testing on Your Phone

### Expo Go (Easiest - No Build Needed)

1. **iPhone**: Install [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from App Store
2. **Android**: Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store
3. Run `npx expo start` on your computer
4. **Scan the QR code** shown in the terminal with your phone
5. The app loads instantly!

### What to Test

| Feature | How to Test |
|---------|-------------|
| Google Login | Tap "Sign in with Google" on Profile tab |
| Browse Products | Scroll the shop, tap category filters |
| Product Detail | Tap any product, select size/color |
| Add to Cart | Tap "Add to Cart" on a product |
| Cart Sync | Add item on web → check mobile (must be logged in on both) |
| Checkout | Go to cart → tap "Checkout" |

---

## Real-time Cart Sync

The cart syncs between web and mobile using **Supabase Realtime**:

- Add item on **web** → instantly appears on **mobile**
- Remove item on **mobile** → instantly disappears on **web**
- Quantity changes sync across all devices

**Requirement**: Both apps must be logged in with the **same Google account**.

---

## Troubleshooting

### "Please log in to view your cart"
- You need to sign in with Google first
- Go to Profile tab → Sign in with Google

### Cart not syncing
1. Make sure Realtime is enabled for `cart_items` in Supabase
2. Make sure you're logged in with the same account on both devices
3. Check that RLS policies are set up correctly

### Google Sign-In not working
1. Check that Google provider is enabled in Supabase Authentication
2. Verify the redirect URL matches: `com.boutiqueshop.app://auth/callback`
3. Make sure your Google OAuth credentials are correct

### Expo Go won't connect
- Make sure your phone and computer are on the **same Wi-Fi network**
- Try refreshing the Expo Go app
- Check that the URL shown in terminal matches your network
