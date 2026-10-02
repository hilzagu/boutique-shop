# Boutique Shop - Complete Setup Guide

This guide walks you through setting up every service step by step.

---

## Table of Contents
1. [Google Cloud Console - OAuth Setup](#step-1-google-cloud-console---oauth-setup)
2. [Supabase - Database Setup](#step-2-supabase---database-setup)
3. [Stripe - Payment Setup](#step-3-stripe---payment-setup)
4. [Mailgun - Email Setup](#step-4-mailgun---email-setup)
5. [Environment Variables](#step-5-environment-variables)
6. [Running the App](#step-6-running-the-app)

---

## Step 1: Google Cloud Console - OAuth Setup

This enables "Sign in with Google" on your site.

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top → **New Project**
3. Name it `boutique-shop` → Click **Create**

### 1.2 Enable the Google+ API

1. In your new project, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"** → Click it → Click **Enable**

### 1.3 Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** → Click **Create**
3. Fill in:
   - **App name**: `Boutique Shop`
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On the **Scopes** page, click **Save and Continue** (default scopes are fine)
6. On the **Test users** page, add your own email as a test user → Click **Save and Continue**

### 1.4 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure:
   - **Application type**: `Web application`
   - **Name**: `Boutique Shop Web`
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
4. Click **Create**
5. **Copy the Client ID and Client Secret** — you'll need these for `.env.local`

### 1.5 Add Production URL (Later)

When deploying, go back to Credentials and add your production URL to both:
- Authorized JavaScript origins: `https://yourdomain.com`
- Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

---

## Step 2: Supabase - Database Setup

This creates your PostgreSQL database with all tables.

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) → Sign up / Log in
2. Click **New Project**
3. Fill in:
   - **Name**: `boutique-shop`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **Create new project** (takes ~2 minutes)

### 2.2 Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `sql/schema.sql` from this project
4. Copy the **entire contents** and paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success" — all tables and seed data are now created

### 2.3 Get Your API Keys

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 2.4 (Optional) Enable Google Auth in Supabase

If you want Supabase Auth instead of NextAuth:
1. Go to **Authentication** → **Providers**
2. Find **Google** → Enable it
3. Paste your Google Client ID and Client Secret from Step 1.4
4. Save

> **Note**: This project uses NextAuth.js for Google sign-in, so this step is optional.

---

## Step 3: Stripe - Payment Setup

This enables credit card payments at checkout.

### 3.1 Create a Stripe Account

1. Go to [stripe.com](https://stripe.com/) → Sign up
2. Complete the onboarding (you can skip business details for testing)

### 3.2 Get Your API Keys

1. Go to [Dashboard](https://dashboard.stripe.com/)
2. In the left sidebar, click **Developers** → **API keys**
3. Copy these test keys:
   - **Publishable key** (starts with `pk_test_`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (starts with `sk_test_`) → `STRIPE_SECRET_KEY`

### 3.3 Set Up Webhook (for production)

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
4. **Events to listen to**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`

### 3.4 Test Card Numbers

Use these for testing:
- **Success**: `4242 4242 4242 4242` (any future expiry, any CVC)
- **Decline**: `4000 0000 0000 0002`
- **Requires auth**: `4000 0025 0000 3155`

---

## Step 4: Mailgun - Email Setup

This sends order confirmation emails.

### 4.1 Create a Mailgun Account

1. Go to [mailgun.com](https://www.mailgun.com/) → Sign up
2. Verify your email address

### 4.2 Add and Verify Your Domain

1. Go to **Sending** → **Domains**
2. Click **Add new domain**
3. Enter a subdomain like `mg.yourdomain.com` (or use the free sandbox domain for testing)
4. Follow the DNS verification steps (add TXT and MX records at your domain registrar)
5. Wait for verification (can take up to 24 hours, usually minutes)

> **For testing only**: Mailgun provides a sandbox domain (e.g., `sandbox123.mailgun.org`). You can send to authorized recipients only. Go to **Sending** → **Domains** → click your sandbox → **Authorized Recipients** to add emails.

### 4.3 Get Your API Key

1. Go to **Settings** → **API Security** (or **Sending** → **Domain Settings** → **API Keys**)
2. Copy your **Private API key** (starts with `key-`) → `MAILGUN_API_KEY`

### 4.4 Configure Sender Address

1. Go to **Sending** → **Domains** → Click your domain
2. Note your domain (e.g., `mg.yourdomain.com`) → `MAILGUN_DOMAIN`
3. Set your sender email (e.g., `orders@mg.yourdomain.com`) → `MAILGUN_FROM_EMAIL`

### 4.5 Set Up Webhooks (Optional - for tracking)

1. Go to **Sending** → **Webhooks**
2. Add a webhook URL: `https://yourdomain.com/api/webhooks/mailgun`
3. Select events: `delivered`, `bounced`, `complained`

---

## Step 5: Environment Variables

### 5.1 Create `.env.local`

In your project root (`boutique-shop/`), create a file called `.env.local`:

```env
# ===== DATABASE (Supabase) =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ===== GOOGLE AUTH =====
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-generate-below

# ===== MAILGUN =====
MAILGUN_API_KEY=key-your-mailgun-api-key
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_EMAIL=orders@mg.yourdomain.com
MAILGUN_FROM_NAME="Boutique Shop"

# ===== STRIPE =====
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 5.2 Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Or use this Node.js one-liner:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it as `NEXTAUTH_SECRET`.

---

## Step 6: Running the App

### 6.1 Install Dependencies

```bash
cd boutique-shop
npm install
```

### 6.2 Start Development Server

```bash
npm run dev
```

### 6.3 Open Your Browser

Go to [http://localhost:3000](http://localhost:3000)

You should see:
- A beautiful women's clothing shop homepage
- Product listings with images
- "Sign in with Google" button in the navbar
- Working cart (add items, adjust quantities)
- Full checkout flow with Stripe test cards
- Order confirmation page
- Confirmation emails sent via Mailgun

---

## Troubleshooting

### Google Sign-In not working
- Make sure you added `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
- Make sure your email is added as a test user in the OAuth consent screen
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct in `.env.local`

### Database errors
- Make sure you ran `sql/schema.sql` in the Supabase SQL editor
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- The service role key should NEVER be exposed to the browser

### Emails not sending
- Verify your Mailgun domain is active (check DNS records)
- For sandbox domains, make sure recipient emails are authorized
- Check the Mailgun logs in **Sending** → **Logs**

### Stripe payments failing
- Make sure you're using test keys (starting with `test_`)
- Use test card `4242 4242 4242 4242` with any future expiry and any CVC
- Check Stripe dashboard → **Developers** → **Logs** for errors

---

## Project Structure

```
boutique-shop/
├── sql/
│   └── schema.sql              # Database schema (run in Supabase)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home/shop page
│   │   ├── globals.css         # Tailwind styles
│   │   ├── checkout/page.tsx   # Checkout page
│   │   ├── order-confirmation/ # Order confirmation page
│   │   ├── products/[slug]/    # Product detail page
│   │   └── api/
│   │       ├── auth/           # NextAuth (Google OAuth)
│   │       ├── checkout/       # Stripe payment intent
│   │       ├── orders/         # Order creation
│   │       ├── products/       # Product API
│   │       └── webhooks/       # Stripe & Mailgun webhooks
│   ├── components/             # React components
│   ├── context/                # Cart state management
│   └── lib/                    # Utilities (Supabase, Stripe, Mailgun)
├── .env.local                  # Environment variables (you create this)
├── .env.local.example          # Template for .env.local
└── package.json
```

---

## Next Steps

- **Deploy to Vercel**: `vercel deploy` (set env vars in Vercel dashboard)
- **Add more products**: Edit the seed data in `sql/schema.sql`
- **Customize emails**: Edit `src/lib/mailgun.ts`
- **Add more auth providers**: Edit `src/lib/auth.ts`
