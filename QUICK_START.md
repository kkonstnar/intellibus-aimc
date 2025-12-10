# Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup Steps

### 1. Install Dependencies

**Frontend (root directory):**

```bash
npm install
```

**Backend (server directory):**

```bash
cd server
npm install
```

### 2. Setup Environment Variables

**Backend** - Create `server/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3001"

EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-gmail-app-password"

POSTHOG_API_KEY="your-posthog-key"
POSTHOG_HOST="https://us.i.posthog.com"

# Polar Payment Integration (Optional - for pre-orders)
POLAR_ACCESS_TOKEN="your-polar-access-token"
POLAR_PRODUCT_ID="your-product-id"
POLAR_WEBHOOK_SECRET="your-webhook-secret"
POLAR_SERVER="sandbox"

PORT="3001"
API_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

**Frontend** - Create `.env` in root:

```env
REACT_APP_POSTHOG_API_KEY=your-posthog-key
REACT_APP_POSTHOG_HOST=https://us.i.posthog.com
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_API_URL=http://localhost:3001
REACT_APP_FRONTEND_URL=http://localhost:3000
```

**Note:** For production, update these URLs to your actual domain:

- `REACT_APP_API_URL` - Your backend API URL
- `REACT_APP_FRONTEND_URL` - Your frontend URL (used for callback URLs)

### 3. Setup Database

```bash
cd server
npm run setup
```

This will:

- Generate Prisma client
- Push the database schema

### 4. Run the Project

**Terminal 1 - Backend Server:**

```bash
cd server
npm run dev
```

Server runs on: http://localhost:3001

**Terminal 2 - Frontend:**

```bash
npm start
```

Frontend runs on: http://localhost:3000

## Access the App

- **Landing Page:** http://localhost:3000
- **Course Page:** http://localhost:3000/course
- **Quiz:** http://localhost:3000/quiz

## Polar Setup (For Pre-orders)

To enable pre-order payments:

1. **Create a Polar Account**: Sign up at https://polar.sh
2. **Get Access Token**:
   - Go to Organization Settings → Access Tokens
   - Create a new token and add it to `server/.env` as `POLAR_ACCESS_TOKEN`
3. **Create a Product**:
   - Create a product in Polar Dashboard
   - Copy the Product ID and add to `server/.env` as `POLAR_PRODUCT_ID`
4. **Setup Webhooks** (Optional):
   - Configure webhook endpoint: `http://localhost:3001/polar/webhooks`
   - Add webhook secret to `server/.env` as `POLAR_WEBHOOK_SECRET`
5. **Set Environment**:
   - Use `POLAR_SERVER="sandbox"` for testing
   - Use `POLAR_SERVER="production"` for live payments

## Notes

- The backend server must be running for authentication to work
- Magic link emails require proper email configuration (Gmail app password recommended)
- PostHog and Google Analytics are optional but recommended for tracking
- Polar integration is optional - the app works without it, but pre-order button won't function
