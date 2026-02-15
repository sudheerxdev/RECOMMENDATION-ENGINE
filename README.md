# AI Career Recommendation Engine Platform

Production-grade full-stack platform for career guidance with a recommendation engine as the core system.

## What Is Implemented

- JWT authentication with bcrypt for email/password users
- Google Sign-In flow (Google Identity Services + backend ID token verification)
- User profile management (skills, interests, experience, preferences, resume URL)
- Resume PDF upload + text extraction + skill extraction
- AI recommendation engine:
  - skill normalization
  - content-based matching
  - embedding similarity
  - suitability ranking
  - skill gap analysis
  - courses, projects, and job role recommendations
  - personalized learning roadmap
  - LLM explanations
- AI career assistant chat endpoint
- Secure backend middleware stack:
  - input validation
  - centralized error handling
  - CORS allowlist
  - rate limiting
  - helmet + sanitize + hpp
- Deployment-ready frontend/backend configs for Vercel + Render

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, ShadCN-style UI components
- Backend: Node.js, Express, MVC-style routes/controllers/services
- Database: MongoDB Atlas (Mongoose)
- Auth: JWT + bcrypt + Google OAuth
- AI: OpenAI (LLM + embeddings, with deterministic fallback embedding)
- Storage: Cloudinary (resume files)

## Monorepo Structure

```text
.
├── backend
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   └── package.json
├── frontend
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── docs/
├── .env.example
└── package.json
```

## Required Data Models

### User

Implemented in `backend/src/models/User.js`:

- `name`
- `email`
- `password` (nullable for Google users)
- `skills`
- `resumeURL`
- `preferences`
- `createdAt` (via timestamps)

Additional fields:

- `authProvider`
- `googleId`
- `emailVerified`
- `avatarUrl`
- `interests`
- `experienceLevel`

### Recommendation

Implemented in `backend/src/models/Recommendation.js`:

- `userId`
- `careerPaths`
- `missingSkills`
- `roadmap`
- `courses`
- `projects`
- `jobs`
- `createdAt` (via timestamps)

## Environment Setup

Copy env templates:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Important: backend reads `backend/.env` directly.

## Install and Run

```bash
npm install
npm run seed
npm run dev
```

Local services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`

## Auth Flows

### Email/Password

- `POST /api/auth/register`
- `POST /api/auth/login`
- JWT token returned and used for protected API requests.

### Google Sign-In

1. Frontend starts Google sign-in prompt via Google Identity Services.
2. Frontend sends Google ID token to backend `POST /api/auth/google`.
3. Backend verifies token with Google OAuth client (`GOOGLE_CLIENT_ID`).
4. Backend creates/links user and returns platform JWT.

## Key API Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `POST /api/recommendations`
- `GET /api/recommendations/history`
- `POST /api/resume/analyze`
- `POST /api/chat/ask`
- `GET /api/careers`

## Deployment

- Frontend: Vercel (`frontend` root)
- Backend: Render (`backend` root)

See:

- `docs/SETUP_GUIDE.md`
- `docs/DEPLOYMENT.md`
- `docs/DEBUGGING_NOTES.md`

## Current Production Notes

- If `OPENAI_API_KEY` is not configured, recommendation still works with fallback embedding and deterministic responses.
- If Cloudinary env is missing, resume analysis still works but file URL is not persisted.
- If Google auth env is missing, email/password auth remains functional while Google sign-in returns a clear configuration error.
# RECOMMENDATION-ENGINE
