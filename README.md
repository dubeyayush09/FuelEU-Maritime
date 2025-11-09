⚓ FuelEU Maritime — Full-Stack Compliance Platform

FuelEU Maritime — Full-Stack Developer Assignment
A minimal, well-structured implementation of a Fuel EU Maritime compliance module with a React + TypeScript frontend and a Node.js + TypeScript + PostgreSQL backend using Hexagonal (Ports & Adapters) architecture.

Table of contents

Project overview

Architecture

Features

Tech stack

Getting started — prerequisites

Setup & run — Backend

Setup & run — Frontend

Database & Prisma

API reference (quick)

Testing

Agent usage & docs

Project structure

Notes, caveats & next steps

Author

License

Project overview

This project demonstrates a small compliance platform implementing Fuel EU Maritime concepts:

Route management (routes, baseline selection)

Baseline vs comparison analysis

Compliance Balance (CB) calculation (Target intensity, energy scope)

Article 20 — Banking: bank and apply surplus CB

Article 21 — Pooling: pooling ships' CBs with validation and greedy allocation

Frontend dashboard with tabs for each feature and visualizations (Recharts)

The goal was to exhibit good domain modeling, separation of concerns (hexagonal architecture), testable use-cases, and documented AI-agent usage.

Architecture

Hexagonal / Ports & Adapters approach:

backend/src/
  core/              ← domain entities, use-cases (framework-agnostic)
  adapters/
    inbound/http/    ← Express controllers, routers (HTTP adapters)
    outbound/postgres/ ← Prisma repositories (DB adapters)
  infrastructure/
    db/               ← Prisma client
    server/           ← Express app bootstrap
  shared/             ← shared types, constants


Frontend mirrors separation:

frontend/src/
  core/               ← domain models / pure logic (minimal)
  adapters/
    ui/               ← React components (tabs, pages)
    infrastructure/   ← apiClient (axios) as outbound adapter
  shared/             ← types


This separation makes business logic independent from frameworks and easy to test.

Features

Frontend

Routes tab: display routes, filters, set baseline

Compare tab: baseline vs comparison table + bar chart

Banking tab: compute CB, bank surplus, apply banked surplus

Pooling tab: create pools (validation, allocations), pool summary UI

Backend

GET /routes — list routes

POST /routes/:id/baseline — set baseline route

GET /routes/comparison — baseline vs others with percentDiff and compliant

GET /compliance/cb?shipId&year — compute & upsert CB

GET /compliance/adjusted-cb?shipId&year — adjusted CB after banks (implementation detail)

GET /compliance/banking/records?shipId&year — list bank entries

POST /compliance/banking/bank — bank surplus

POST /compliance/banking/apply — apply banked

POST /pools — create pool (validation: sum CB >= 0; greedy allocation)

Tech stack

Frontend

React (Vite + TypeScript)

TailwindCSS

Recharts

Axios

Backend

Node.js + Express + TypeScript

Prisma ORM

PostgreSQL

ts-node-dev for dev

Tooling

ESLint / Prettier (recommended)

Git for version control

Postman / curl for testing

Getting started — prerequisites

Node.js (v18+ recommended)

npm (v8+)

PostgreSQL (installed & running)

Git

Optional: psql CLI, Prisma Studio (comes with Prisma)

Set up a local PostgreSQL database (example):

DB name: fueleu

User: postgres

Password: (your password)

Setup & run — Backend

Open a terminal, go to backend folder:

cd Backend


Install dependencies:

npm install


Configure environment:

Create Backend/.env with:

DATABASE_URL=postgresql://postgres:<PASSWORD>@localhost:5432/fueleu?schema=public


Replace <PASSWORD> with your postgres password. Use URL encoding for special characters (e.g. @ → %40).

Generate Prisma client:

npx prisma generate --schema=prisma/schema.prisma


Create DB & run migration:

npx prisma migrate dev --name init --schema=prisma/schema.prisma


Seed routes (example seed script provided):

npx ts-node prisma/seed.ts


Start backend (ensure the DATABASE_URL is available in env — on Windows you may set it in-session):

# Windows (cmd)
set DATABASE_URL=postgresql://postgres:<PASSWORD>@localhost:5432/fueleu?schema=public
npm run dev

# macOS / Linux
export DATABASE_URL="postgresql://postgres:<PASSWORD>@localhost:5432/fueleu?schema=public"
npm run dev


Server default: http://localhost:4000

Setup & run — Frontend

Open another terminal, go to frontend:

cd Frontend


Install dependencies:

npm install


Start dev server:

npm run dev


Open the app (usually): http://localhost:5173

The frontend expects the backend at http://localhost:4000. If your backend runs on different host/port, update src/adapters/infrastructure/apiClient.ts baseURL.

Database & Prisma notes

Prisma schema located at Backend/prisma/schema.prisma.

Models:

Route

ShipCompliance (unique composite on [shipId, year])

BankEntry

Pool

PoolMember

Important: CB computation uses:

TARGET_INTENSITY = 89.3368 gCO2e/MJ (target)

ENERGY_PER_TONNE = 41_000 MJ/t

CB = (Target − Actual) * (fuelConsumption * 41_000)

CB upsert is used (no duplicate ship/year rows).

Use npx prisma studio to view/edit DB during development.

API reference (quick)

Base: http://localhost:4000

Routes

GET /routes — list routes

POST /routes/:id/baseline — set baseline by route numeric id

GET /routes/comparison — returns baseline and comparisons

Compliance & Banking

GET /compliance/cb?shipId=<id>&year=<yyyy> — compute & upsert CB

GET /compliance/adjusted-cb?shipId&year — adjusted CB after banks (if implemented)

GET /compliance/banking/records?shipId&year — list bank entries

POST /compliance/banking/bank — body { shipId, year, amount }

POST /compliance/banking/apply — body { shipId, year, amount }

Pools

POST /pools — create pool
Body:

{
  "year": 2024,
  "members": [{"shipId":"R001"},{"shipId":"R002"}]
}


Validates sum(cb) >= 0, allocates surplus → deficits, persists pools and pool_members.

Testing

Unit tests (recommended): create tests for core use-cases (ComputeCB, BankSurplus, ApplyBanked, CreatePool).

Integration tests: use Supertest to test Express endpoints.

Manual testing:

Use Postman / browser to call GET /routes

Set baseline POST /routes/:id/baseline

Compute CBs GET /compliance/cb?shipId=R001&year=2024

Use Banking and Pooling endpoints as described

Agent usage & docs

This project used AI agents to speed up scaffolding and code suggestions. A separate AGENT_WORKFLOW.md documents:

Agents used (Copilot, ChatGPT, etc.)

Example prompts & outputs

Validation steps and corrections

Observations & best practices

(Place it at repo root — reviewers should read it.)

Project structure (high-level)
FuelEU-Maritime/
 ├── Backend/
 │   ├── src/
 │   │   ├── core/
 │   │   ├── adapters/
 │   │   └── infrastructure/
 │   ├── prisma/
 │   ├── package.json
 │   └── .env
 ├── Frontend/
 │   ├── src/
 │   │   ├── adapters/ui/
 │   │   └── adapters/infrastructure/
 │   ├── package.json
 │   └── vite.config.ts
 ├── README.md
 ├── AGENT_WORKFLOW.md
 └── REFLECTION.md

Notes, caveats & next steps

CORS: Backend currently allows * for dev ease. Lock this in production.

Authentication: Not included — can be added (JWT / OAuth) for ship operators and admins.

Production: Add Dockerfile(s) and Docker Compose for PostgreSQL and app containers, CI/CD pipeline.

Validation: Pooling validation follows provided spec (sum CB >= 0). For demo/testing, adjust route intensities or include more surplus ships.

Testing: Add comprehensive unit/integration tests before submission.

Author

Ayush Dubey
MCA — Maulana Azad National Institute of Technology (MANIT), Bhopal
GitHub: https://github.com/dubeyayush09
Email: dubeyayush09@gmail.com