# VESTORA — Investment & Referral Management Platform

> A premium, production-grade MERN Stack digital investment platform featuring a luxury cinematic homepage, real-time capital allocation, multi-level referral commissions, idempotent daily yield calculations, and an immutable financial audit ledger.

---

## 1. Project Overview & Architectural Vision

**Vestora** is built as an enterprise-grade digital financial application designed around the philosophy of *Restrained Luxury* and state-of-the-art cinematic web design (inspired by modern digital showcases like Pagani.com), combined with a fault-tolerant, transactionally secure MERN backend engine.

### Key Highlights for Technical Evaluators
- **Cinematic Frontend Engine:** Features a scroll-driven, glassmorphism-enhanced landing experience with smooth micro-interactions, sophisticated typography, and zero generic visual clutter.
- **ACID-Compliant Financial Layer:** All wallet debits, daily ROI accruals, and multi-level referral distributions are executed inside MongoDB ACID transactions (`session.withTransaction`).
- **Universal Database Compatibility (Standalone & Replica Set Auto-Fallback):** Engineered with intelligent fallback capabilities—if executed on a local standalone MongoDB instance (where replica sets are disabled), the engine seamlessly shifts to sequential execution without throwing transaction errors (`500 Internal Server Error`).
- **Frictionless Evaluator Testing (1-Click Demo Capital):** New members default to **₹100,000** in simulated trading balance. An interactive **`＋ ADD DEMO CAPITAL`** function is embedded directly into the terminal header, enabling evaluators to simulate allocations instantly without manual database edits.

---

## 2. Comprehensive Feature Suite

- ✅ **Authentication & Authorization:** Secure JWT token authentication with bcrypt password hashing (12 rounds) and aggressive rate-limiting on auth endpoints.
- ✅ **Referral-Driven Growth Engine:** Automated referral linkage upon registration with unique tracking codes.
- ✅ **Configurable Term Allocations:** Supports tiered investment structures (*Starter*, *Growth*, *Premium*) with rigorous minimum/maximum deployment limits.
- ✅ **Idempotent Yield Processing:** Multi-layered duplicate protection guarantees daily returns are never double-credited for any calendar date.
- ✅ **5-Level Referral Tree & Commissions:** Automatically computes and distributes downstream referral yield across a recursive 5-tier network structure (L1: 10%, L2: 5%, L3: 3%, L4: 2%, L5: 1%).
- ✅ **Immutable Ledger & Accounting:** Complete, unalterable wallet audit logging (`WalletTransaction`) tracking balance shifts before and after every transaction.
- ✅ **Advanced Data Visualizations:** Real-time revenue analytics powered by customized, minimalist Recharts integrations.
- ✅ **Production Serverless Architecture:** Optimized for deployment on **Vercel** with dedicated API serverless wrappers and scheduler webhooks.

---

## 3. Technology Stack

| Architecture Layer | Tools & Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19 + Vite (Vanilla CSS styling with tailored HSL/Hex color tokens) |
| **Backend API Engine** | Node.js + Express.js (Layered REST architecture) |
| **Database & ORM** | MongoDB Atlas / Standalone Local Mongo + Mongoose ORM |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt, Helmet, CORS, Express-Rate-Limit |
| **Input Validation** | Joi Validation Schemas + Centralized Middleware |
| **Automated Scheduler** | `node-cron` (Development / Standalone) + Vercel Cron Secret Webhook |
| **Data Visualizations** | Recharts |
| **Deployment & CI/CD** | Vercel (`api/index.js` serverless handler + `vercel.json` routing) |

---

## 4. Architectural Layering & Data Flow

```
React UI Terminal → REST API → Security Middleware (Rate Limit/Auth) → Thin Controllers → Business Services → Mongoose Transactions → MongoDB
```

**Idempotency Strategy (3-Layer Defense):**
1. **Application Layer:** Fast early-exit querying via `ROIHistory.findOne()`.
2. **Database Schema Layer:** Unique compound index on `(investment, processingDate)` in MongoDB.
3. **Transaction Layer:** Atomic execution wrapping wallet crediting, ledger creation, and referral distribution in a singular database session.

---

## 5. Repository Structure

```
vestora/
├── client/                      # React + Vite Front-End Terminal
│   ├── src/
│   │   ├── api/                 # Axios HTTP interceptors & REST modules
│   │   ├── components/          # Reusable minimalist UI widgets & Recharts
│   │   ├── context/             # AuthContext (Session management & demo recharge)
│   │   ├── layouts/             # DashboardLayout (Terminal navigation & telemetry bar)
│   │   ├── pages/               # Application views (Dashboard, Allocations, Yield Ledger)
│   │   ├── styles/              # Cinematic theme variables & responsive layouts
│   │   └── index.css            # Core design system tokens
│   └── index.html
├── server/                      # Express.js Back-End Financial Engine
│   ├── src/
│   │   ├── config/              # Environment binding & database initialization
│   │   ├── constants/           # Transaction types, term configurations & referral percentages
│   │   ├── controllers/         # Thin HTTP protocol layer
│   │   ├── jobs/                # node-cron scheduler initialization
│   │   ├── middleware/          # JWT verification, Joi validation, & error handling
│   │   ├── models/              # Mongoose data schemas (User, Investment, ROIHistory)
│   │   ├── routes/              # Express endpoint routers
│   │   ├── services/            # Core business logic & financial computation
│   │   └── utils/               # ApiError, token generators, & helpers
│   ├── .env.example             # Evaluator environment configuration template
│   └── tests/                   # Test suites
├── api/                         # Vercel serverless application entry point
├── postman/                     # Ready-to-import API collection (Vestora.postman_collection.json)
├── vercel.json                  # Cloud build configuration & redirect routing
└── README.md
```

---

## 6. Local Setup & Evaluator Quickstart

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/vestora`) OR MongoDB Atlas connection string. *(Note: Our backend natively handles both standalone instances and Replica Sets).*

### Installation & Execution

1. **Clone & Install Dependencies:**
   ```bash
   git clone <repository_url>
   cd vestora
   
   # Install Backend Dependencies
   cd server && npm install
   
   # Install Frontend Dependencies
   cd ../client && npm install
   ```

2. **Configure Environment Variables:**
   Copy the provided `.env.example` templates in both `server` and `client`:
   
   *In `server/.env`:*
   ```ini
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vestora
   JWT_SECRET=super_secret_jwt_key_vestora
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   CRON_SECRET=vestora_cron_secret_key
   ```
   
   *In `client/.env` (if applicable, defaults to localhost:5000):*
   ```ini
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

3. **Start Development Servers (Terminal Split):**
   ```bash
   # Terminal 1 — Start Financial Engine Server
   cd server
   npm run dev
   
   # Terminal 2 — Start Member UI Terminal
   cd client
   npm run dev
   ```

   - **Frontend UI:** Open [http://localhost:5173](http://localhost:5173) in your browser.
   - **Backend API:** Listening on [http://localhost:5000](http://localhost:5000).

---

## 7. Automated ROI Scheduler & Manual Test Triggering

The daily ROI credit distribution runs automatically every night at midnight UTC via `node-cron` (or Vercel Cron via webhooks). 

### How to Trigger Daily ROI Manually for Evaluation
You can test batch ROI execution instantly using Postman or cURL without modifying production date normalization constraints:

**HTTP Webhook Parameter Details:**
- **Method:** `POST`
- **Endpoint:** `http://localhost:5000/api/v1/internal/process-daily-roi`
- **Required Header:** `x-cron-secret: vestora_cron_secret_key` *(or URL parameter: `?secret=vestora_cron_secret_key`)*

**Example cURL Request:**
```bash
curl -X POST http://localhost:5000/api/v1/internal/process-daily-roi \
  -H "x-cron-secret: vestora_cron_secret_key" \
  -H "Content-Type: application/json"
```

> **Evaluation Tip for Same-Day ROI Testing:** Because financial term yields evaluate over overnight holding periods, investments made during day $D$ become eligible for yield on day $D+1$. To test yield payout immediately upon creation, either fast-forward system test time or backdate the investment's `startDate` by 24 hours in MongoDB Compass before calling the endpoint.

---

## 8. API Reference Matrix

| HTTP | API Endpoint | Security | Primary Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Rate Limited | Register new account (+₹100,000 demo trading capital) |
| `POST` | `/api/v1/auth/login` | Rate Limited | Authenticate existing credentials and issue JWT |
| `GET` | `/api/v1/auth/me` | 🔒 Bearer JWT | Return verified profile telemetry and current balance |
| `POST` | `/api/v1/auth/add-demo-funds` | 🔒 Bearer JWT | Recharge member wallet balance by ₹100,000 for evaluation |
| `POST` | `/api/v1/investments` | 🔒 Bearer JWT | Deploy capital allocation into designated term plan |
| `GET` | `/api/v1/investments` | 🔒 Bearer JWT | Retrieve paginated ledger of active/completed allocations |
| `GET` | `/api/v1/dashboard/summary` | 🔒 Bearer JWT | Retrieve aggregated portfolio statistics for UI dashboard |
| `GET` | `/api/v1/dashboard/earnings` | 🔒 Bearer JWT | Retrieve analytical Recharts data series for earnings |
| `GET` | `/api/v1/roi/history` | 🔒 Bearer JWT | Retrieve paginated accounting records of daily ROI credits |
| `GET` | `/api/v1/referrals/tree` | 🔒 Bearer JWT | Generate multi-level referral network graph via BFS |
| `GET` | `/api/v1/referrals/income` | 🔒 Bearer JWT | Retrieve commissions earned from network yield |
| `POST` | `/api/v1/internal/process-daily-roi` | 🛡️ Cron Secret | Execute daily batch calculation across all active terms |

---

## 9. Security & Production Quality Assurance

- **Zero Secret Exposure:** Strict serialization transformation removes internal `passwordHash` and `__v` attributes from all outbound JSON payloads.
- **Defensive Auditing:** Financial balances are protected by immutable audit log creations (`WalletTransaction`) before database saves.
- **Enterprise Routing:** Centralized operational error management converts validation breaches and balance deficits into actionable `400 Bad Request` messages without exposing system stack traces.
- **Tested Engine:** Automated validation via Jest/Vitest covering registration deduplication, multi-level referral depth containment, and idempotency adherence.
