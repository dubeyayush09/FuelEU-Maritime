# 🤖 AI Agent Workflow Log

This document provides a transparent record of how AI tools were used during the development of the **FuelEU Maritime Compliance Platform** project.

---

## ⚙️ Agents Used

| Agent | Purpose | Usage Context |
|--------|----------|----------------|
| **ChatGPT (GPT-5)** | Primary AI pair programmer | Architecture design, backend API logic, Prisma schema, frontend components |
| **GitHub Copilot** | Inline code completions | TypeScript boilerplate, React hooks, repetitive JSX |
| **Cursor IDE Agent** *(optional mention if used)* | Quick refactors and type hints | Auto-generation of function signatures and async handlers |
| **Claude (Optional)** | Concept explanations | Clarifying compliance rules and algorithm design |

---

## 🧩 Prompts & Outputs

### 🧠 Example 1 — Backend Route Comparison
**Prompt:**
> “Create an Express controller for `/routes/comparison` returning baseline and comparison routes with % difference and compliant flag.”

**AI Output:**
- Generated controller logic with Prisma query to find baseline and comparisons.
- Added formula:  
  `percentDiff = ((comparison / baseline) - 1) × 100`
- Added compliance flag (`<= target ? true : false`).

**Manual Validation:**
- Verified baseline retrieval.
- Adjusted variable naming (`baselineIntensity` → `baseIntensity`).
- Added error handling for missing baseline.

---

### 🧠 Example 2 — Frontend Compare Tab
**Prompt:**
> “Create a CompareTab in React (TypeScript + Tailwind) that fetches `/routes/comparison` and displays a bar chart using Recharts.”

**AI Output:**
- Produced complete React component with BarChart, Legend, and Tooltip.
- Styled using Tailwind and Recharts integration.

**Manual Corrections:**
- Fixed TypeScript types for chart data.
- Added conditional render for empty response.
- Adjusted chart color scheme for accessibility.

---

### 🧠 Example 3 — Prisma Environment Debugging
**Prompt:**
> “DATABASE_URL not found when running `npx prisma generate` — help me fix.”

**AI Output:**
- Identified missing env variable in Windows shell.
- Suggested command:  
  `set DATABASE_URL=postgresql://postgres:Ayush%40123@localhost:5432/fueleu?schema=public`

**Manual Verification:**
- Confirmed fix.
- Added `.env` file for permanent storage.

---

## 🧪 Validation / Corrections

| Issue | AI Suggestion | My Validation / Fix |
|--------|----------------|----------------------|
| TypeScript type mismatch (Node globals) | Install `@types/node` | Added to `tsconfig.json` types |
| Express import path confusion | Used relative imports | Adjusted all to `../../infra/...` paths |
| Empty CompareTab UI | Added baseline check and console logs | Fixed by setting a baseline first |
| CORS policy errors | Added `app.use(cors({ origin: "*" }))` | Validated via frontend requests |
| Pooling validation logic | Ensure ΣCB ≥ 0 | Verified against example CB values |

---

## 📊 Observations

### 👍 Where AI Helped
- Saved **60–70%** of setup time for scaffolding.
- Helped generate clean, consistent TypeScript boilerplate.
- Provided architectural clarity for **Hexagonal pattern**.
- Suggested fixes for Prisma + Node env issues quickly.

### ⚠️ Where AI Failed / Needed Review
- Occasionally suggested invalid import paths.
- Missed minor syntax issues with async handlers.
- Generated redundant DB query code that needed refactoring.

### 💡 Combined Workflow
1. Used ChatGPT for design, structure, and high-level logic.  
2. Used Copilot for inline code completions and repetitive JSX.  
3. Manually validated outputs by:
   - Running API endpoints in Postman.
   - Reviewing console logs and SQL queries.
   - Testing UI with live backend.

---

## 🧠 Best Practices Followed

✅ Used ChatGPT for architectural planning (not direct copy-paste).  
✅ Used Copilot inline only for boilerplate.  
✅ Tested each feature (backend + frontend) after agent assistance.  
✅ Wrote commits per feature (`Routes`, `Compare`, `Banking`, `Pooling`).  
✅ Documented all agent interactions transparently.  

---

## 🧭 Summary

AI agents significantly improved productivity and structure but did not replace human decision-making.  
Every generated output was **reviewed, validated, and corrected** before commit.  
The result is a hybrid AI-assisted yet human-validated engineering workflow.

---

✍️ **Author:** *Ayush Dubey*  
🎓 MCA — MANIT, Bhopal  
📅 November 2025
