# AI Career Recommendation Engine Platform

Full-stack platform that recommends career paths using profile signals, resume analysis, and hybrid scoring (embeddings + rule-based matching). It includes authentication, recommendation history, learning roadmaps, and an AI chat assistant.

## What It Does

- Auth: email/password and Google Sign-In.
- Resume analysis: accepts PDF uploads, extracts text, detects skills, and optionally stores files in Cloudinary.
- Recommendation engine: ranks career paths with suitability scores and score breakdowns.
- Skill-gap output: identifies missing skills and suggests what to learn next.
- Learning support: recommends courses, projects, and paced roadmap steps.
- AI chat assistant: answers career questions using your profile and recommendation context.
- Dashboard UX: profile management, recommendation feed, analytics cards, and job/learning panels.

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion.
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, Zod validation, Multer.
- AI/Infra: OpenAI API (chat + embeddings), Cloudinary, Google OAuth.

## Monorepo Structure

```text
.
|-- backend/
|   |-- src/
|   |   |-- controllers/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- models/
|   `-- scripts/seedCareerPaths.js
|-- frontend/
|   |-- app/
|   |-- components/
|   `-- lib/
|-- docs/
|   |-- SETUP_GUIDE.md
|   |-- DEPLOYMENT.md
|   `-- DEBUGGING_NOTES.md
`-- README.md
```

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB Atlas connection string
- Optional but recommended:
  - OpenAI API key
  - Cloudinary account
  - Google OAuth client ID

## Quick Start

1. Install dependencies from the repo root:

```bash
npm install
```

2. Create environment files:

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

3. Update env values (minimum required backend values):

- `MONGODB_URI`
- `JWT_SECRET` (must be at least 24 chars)
- `FRONTEND_URL` (default local frontend origin)

4. Seed default career taxonomy:

```bash
npm run seed
```

5. Start both apps:

```bash
npm run dev
```

6. Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai_career_platform
JWT_SECRET=replace-with-min-24-char-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
FRONTEND_URLS=http://localhost:3001,http://localhost:3002
GOOGLE_CLIENT_ID=1234567890-abcdefg.apps.googleusercontent.com
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-abcdefg.apps.googleusercontent.com
```

## Scripts

From repository root:

- `npm run dev` - run backend + frontend concurrently.
- `npm run dev:backend` - run backend only.
- `npm run dev:frontend` - run frontend only.
- `npm run build` - run backend build check + frontend production build.
- `npm run start` - start backend in production mode.
- `npm run seed` - seed `CareerPath` data.

## API Overview

Base URL: `http://localhost:5000/api`

- `GET /health` - API health check.
- `POST /auth/register` - register with email/password.
- `POST /auth/login` - login with email/password.
- `POST /auth/google` - sign in with Google ID token.
- `GET /auth/me` - get current user (requires Bearer token).
- `PATCH /auth/me` - update profile (requires Bearer token).
- `POST /resume/analyze` - upload PDF resume (requires Bearer token).
- `POST /recommendations` - generate recommendations (requires Bearer token).
- `GET /recommendations/history` - fetch recent recommendation runs.
- `POST /chat/ask` - ask AI assistant.
- `GET /careers` - list available seeded careers.

## Fallback Behavior (No OpenAI)

If `OPENAI_API_KEY` is missing, the backend still works with deterministic local embeddings and template/fallback responses. Recommendation quality will be lower than with OpenAI enabled.

## Troubleshooting and Deployment

- Setup details: `docs/SETUP_GUIDE.md`
- Deployment guide: `docs/DEPLOYMENT.md`
- Common issues: `docs/DEBUGGING_NOTES.md`

## License

No license file is currently defined in this repository.
# ai-career-recommendation-engine
# ai-career-recommendation-engine
