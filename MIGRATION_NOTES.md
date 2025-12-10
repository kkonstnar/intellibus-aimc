# Next.js Migration Notes

## What Changed

1. **Project Structure**

   - Migrated from Create React App to Next.js 15
   - Converted React Router to Next.js App Router
   - Moved Express backend to Next.js API routes

2. **Environment Variables**

   - Changed from `REACT_APP_*` to `NEXT_PUBLIC_*` for client-side variables
   - Server-side variables remain the same (no prefix needed)

3. **API Routes**

   - Express routes moved to `app/api/*/route.ts` files
   - Better Auth handler at `app/api/auth/[...all]/route.ts`
   - All backend functionality preserved

4. **Pages**
   - `/` → `app/page.tsx` (landing page)
   - `/course` → `app/course/page.tsx`
   - `/quiz` → `app/quiz/page.tsx`
   - `/success` → `app/success/page.tsx`
   - `/auth/verify` → `app/auth/verify/page.tsx`

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Setup Environment Variables**

   - Copy `.env.example` to `.env.local`
   - Update all values with your actual credentials

3. **Setup Database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:3000

## Benefits

- ✅ Much faster dev server (Turbopack)
- ✅ Faster TypeScript compilation
- ✅ Unified codebase (no separate backend server)
- ✅ Better performance with SSR/SSG options
- ✅ Simpler deployment (one app)

## Notes

- The old `server/` directory can be removed after verifying everything works
- All components in `src/` remain unchanged
- Prisma schema location unchanged (`prisma/schema.prisma`)
