# ⚓ FuelEU Maritime — Full-Stack Compliance Platform

### 🚀 Full-Stack Developer Assignment (FuelEU Maritime)

This project implements a **FuelEU Maritime Compliance Platform** with a structured **React + TypeScript + Node.js + PostgreSQL** stack following **Hexagonal (Ports & Adapters)** architecture.

It demonstrates how to build an end-to-end compliance system handling:
- Route management  
- Emissions comparison  
- Compliance balance (CB) computation  
- Banking and pooling features (Articles 20 & 21 of FuelEU regulation)  

---

## 🧭 Table of Contents
- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup — Backend](#-setup--backend)
- [Setup — Frontend](#-setup--frontend)
- [Database & Prisma](#-database--prisma)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 🌍 Overview

**FuelEU Maritime** is designed to assess shipping routes' greenhouse gas (GHG) intensity and ensure compliance with FuelEU emission targets.

The platform includes:
- A REST API for route management, compliance calculations, and pooling logic.  
- A React dashboard visualizing compliance data through tables and charts.

---

## 🏗️ Architecture

This project follows **Hexagonal (Ports & Adapters)** architecture for modularity and separation of concerns.

### 🧩 Backend (Node.js + TypeScript)
```
src/
  core/                # Domain logic and entities
  adapters/
    inbound/http/      # Express controllers and routes
    outbound/postgres/ # Prisma repositories (DB layer)
  infrastructure/
    db/                # Prisma client and schema
    server/            # Express app setup
  shared/              # Constants and types
```

### 🎨 Frontend (React + Vite + TypeScript)
```
src/
  core/                # Domain models and hooks
  adapters/
    ui/                # React components and pages
    infrastructure/    # Axios API client
  shared/              # Common types
```

This architecture ensures:
- The **core business logic** is independent of frameworks.
- **Adapters** connect to infrastructure (HTTP, DB, UI).
- Code remains easy to test and extend.

---

## ⚙️ Features

### 🛳️ Routes Tab
- Fetch and display all shipping routes (`/routes`)
- Columns: vessel type, fuel type, year, GHG intensity, emissions
- “Set Baseline” button to mark a baseline route

### ⚖️ Compare Tab
- Fetches `/routes/comparison`
- Shows baseline vs comparison GHG intensities
- Calculates **% difference** and compliance (`✅ / ❌`)
- Interactive bar chart using **Recharts**

### 💰 Banking Tab
Implements **FuelEU Article 20 – Banking**
- Fetch current **Compliance Balance (CB)**  
- Bank surplus CB  
- Apply stored CB to offset deficits  
- Displays KPIs: `cb_before`, `applied`, `cb_after`

### 🔗 Pooling Tab
Implements **FuelEU Article 21 – Pooling**
- Create a pool of ships sharing compliance surpluses
- Ensures:  
  - Σ (Adjusted CB) ≥ 0  
  - Deficit ships can’t exit worse  
  - Surplus ships can’t exit negative
- Visual display of before/after CBs  
- Green indicator for valid pool ✅  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, TypeScript, Vite, TailwindCSS, Recharts |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Database** | PostgreSQL |
| **Styling** | TailwindCSS |
| **Architecture** | Hexagonal (Ports & Adapters) |
| **Tools** | ESLint, Prettier, ts-node-dev, GitHub, AI Agents |

---

## ⚙️ Setup — Backend

### 1️⃣ Install Dependencies
```bash
cd Backend
npm install
```

### 2️⃣ Create `.env`
```env
DATABASE_URL="postgresql://postgres:<PASSWORD>@localhost:5432/fueleu?schema=public"
```

### 3️⃣ Run Prisma Migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4️⃣ Seed Data
```bash
npx ts-node prisma/seed.ts
```

### 5️⃣ Start Backend
```bash
npm run dev
```

Backend runs at 👉 **http://localhost:4000**

---

## ⚙️ Setup — Frontend

### 1️⃣ Install Dependencies
```bash
cd Frontend
npm install
```

### 2️⃣ Start Dev Server
```bash
npm run dev
```

Frontend runs at 👉 **http://localhost:5173**

Make sure your backend is running simultaneously.

---

## 🗄️ Database & Prisma

**Prisma Models**
- `routes` — Route data (id, routeId, vesselType, fuelType, year, ghgIntensity, etc.)
- `ship_compliance` — Ship-year CB records
- `bank_entries` — Banked surplus records
- `pools` — Pool registry
- `pool_members` — Pool participants with before/after CB

### CB Formula
```
CB = (TargetIntensity - ActualIntensity) × (FuelConsumption × 41,000)
TargetIntensity(2025) = 89.3368 gCO₂e/MJ
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/routes` | Fetch all routes |
| `POST` | `/routes/:id/baseline` | Set route as baseline |
| `GET` | `/routes/comparison` | Baseline vs comparison data |
| `GET` | `/compliance/cb?shipId&year` | Compute and return CB |
| `POST` | `/compliance/banking/bank` | Bank surplus CB |
| `POST` | `/compliance/banking/apply` | Apply banked surplus |
| `POST` | `/pools` | Create compliance pool |

---

## 🧪 Testing

### Backend
```bash
npm run test
```
*(Unit & integration tests recommended for core modules: CB calculation, Banking, Pooling)*

### Manual API Testing
Use **Postman** or browser to verify endpoints:
1. `/routes` — list routes  
2. `/routes/:id/baseline` — set baseline  
3. `/routes/comparison` — compare data  
4. `/compliance/cb?shipId&year` — check CB  
5. `/pools` — create pool  

---

## 🧩 Project Structure

```
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
 │   │   ├── adapters/infrastructure/
 │   │   └── core/
 │   ├── package.json
 │   └── vite.config.ts
 ├── README.md
 ├── AGENT_WORKFLOW.md
 └── REFLECTION.md
```

---

## 🚧 Future Improvements

- Add authentication (admin / ship operator roles)
- Add user-specific data filters and dashboards
- Deploy using Docker and CI/CD pipelines
- Add full Jest test coverage
- Add charts to Banking & Pooling tabs

---

## 👨‍💻 Author

**Ayush Dubey**  
🎓 MCA, Maulana Azad National Institute of Technology (MANIT), Bhopal  
🌐 [GitHub](https://github.com/dubeyayush09)  
📧 Email: dubeyayush09@gmail.com  

---


