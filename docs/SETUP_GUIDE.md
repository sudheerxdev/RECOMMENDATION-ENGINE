# Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas cluster
- OpenAI API key (recommended)
- Cloudinary account (for resume file upload)
- Google Cloud OAuth client

## 1. Install Dependencies

From repository root:

```bash
npm install
```

## 2. Environment Variables

Create:
- `.env` (root, optional convenience)
- `backend/.env`
- `frontend/.env.local`

Use templates:
- `.env.example`
- `backend/.env.example`
- `frontend/.env.example`

Important: backend runtime reads `backend/.env`.

## 3. Configure MongoDB Atlas

1. Create cluster
2. Create DB user with read/write permissions
3. Add IP access allowlist (or secure CIDR for production)
4. Set `MONGODB_URI` in `backend/.env`

## 4. Configure OpenAI

Set in `backend/.env`:

```env
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

If omitted, the app falls back to deterministic local embeddings and template responses.

## 5. Configure Google Sign-In

### Backend

Set in `backend/.env`:

```env
GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

### Frontend

Set in `frontend/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-oauth-client-id>
```

## 6. Configure Cloudinary

Set in `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

If omitted, resume text extraction still works; file URL storage is disabled.

## 7. Seed Career Data

```bash
npm run seed
```

This populates the `CareerPath` collection with default career taxonomy and embeddings.

## 8. Run App

```bash
npm run dev
```

Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 9. Smoke Test

1. Register user
2. Login with email/password
3. Login with Google
4. Open Dashboard
5. Upload sample PDF resume
6. Generate recommendations
7. Ask a question in AI chat panel
