# ManagedBetter

A monorepo containing a NestJS backend and Next.js frontend.

## Structure

```
.
├── backend/     # NestJS backend application
├── frontend/    # Next.js frontend application
└── package.json # Root package.json with workspaces
```

## Getting Started

### Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (backend and frontend).

### Environment Variables

The project uses separate `.env` files for each package:

1. **Root `.env`** - Used by `docker-compose.yml` for Docker services
2. **`backend/.env`** - Backend application environment variables
3. **`frontend/.env`** - Frontend application environment variables

To set up:

1. Copy the example files (if they exist) or create your own:
   ```bash
   # Backend
   cp backend/.env.example backend/.env  # if example exists
   # Or create backend/.env manually
   
   # Frontend  
   cp frontend/.env.example frontend/.env  # if example exists
   # Or create frontend/.env manually
   ```

2. Update the values in each `.env` file with your configuration.

**Note:** The root `.env` file is used by Docker Compose. If you want to use values from `backend/.env` in docker-compose, you can either:
- Manually sync values between files
- Use `docker-compose --env-file backend/.env up` to load backend env vars
- Or reference the backend .env values in your root .env file

### Development

Run both backend and frontend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Backend only (runs on http://localhost:3000)
npm run dev:backend

# Frontend only (runs on http://localhost:3001)
npm run dev:frontend
```

### Build

Build all workspaces:

```bash
npm run build
```

Or build individually:

```bash
npm run build:backend
npm run build:frontend
```

## Workspaces

### Backend (NestJS)

The backend is a NestJS application located in the `backend/` directory.

- **Port**: 3000 (default)
- **Framework**: NestJS
- **Language**: TypeScript

### Frontend (Next.js)

The frontend is a Next.js application located in the `frontend/` directory.

- **Port**: 3001 (default, Next.js will auto-increment if 3000 is taken)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## Scripts

- `npm run dev` - Run both backend and frontend in development mode
- `npm run dev:backend` - Run only the backend
- `npm run dev:frontend` - Run only the frontend
- `npm run build` - Build all workspaces
- `npm run build:backend` - Build only the backend
- `npm run build:frontend` - Build only the frontend