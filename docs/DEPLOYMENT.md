# Deployment Guide

## Architecture

- Frontend (Next.js) deployed to Vercel
- Backend (Express API) deployed to Render
- MongoDB Atlas as managed DB
- Cloudinary for resume storage
- OpenAI API for embeddings + reasoning
- Google OAuth for Google Sign-In

## Backend Deployment (Render)

### 1. Create Render Web Service
- Connect repository
- Root directory: `backend`
- Runtime: Node
- Build command: `npm install`
- Start command: `npm run start`

### 2. Configure Environment Variables

Set all required backend env vars:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://<your-vercel-domain>
FRONTEND_URLS=https://<your-vercel-domain>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 3. Seed Production Data

Option A:
- Run seed script once from local machine with production `MONGODB_URI`

```bash
npm run seed
```

Option B:
- Add temporary one-off Render job to run `npm run seed`

## Frontend Deployment (Vercel)

### 1. Create Vercel Project
- Import repository
- Root directory: `frontend`
- Framework: Next.js

### 2. Configure Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://<your-render-service>.onrender.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

### 3. Build & Deploy
- Vercel handles build command automatically (`next build`)

## Post-Deployment Checklist

1. Confirm API health endpoint:
   - `GET https://<render>/api/health`
2. Confirm frontend can register/login
3. Confirm Google Sign-In succeeds and redirects to dashboard
4. Confirm CORS works with `FRONTEND_URL` and `FRONTEND_URLS`
5. Confirm recommendation generation works
6. Confirm resume upload works and Cloudinary URL is returned and linked to user
7. Confirm chat assistant responses return successfully

## Production Hardening Recommendations

1. Add monitoring and alerts (Render logs + external observability)
2. Rotate JWT/OpenAI/Cloudinary secrets regularly
3. Add API metrics and structured logs
4. Add Redis cache for heavy recommendation requests
5. Add integration tests in CI before deploy
