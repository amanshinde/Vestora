# NexaChain AI — Investment & Referral Platform

> A production-shaped MERN Stack investment and referral platform with daily ROI processing, multi-level referral income, wallet accounting, and a responsive React dashboard.

---

## 1. Project Overview

NexaChain AI is a full-stack investment platform that allows users to:
- Register and invest in configurable plans
- Earn daily ROI on active investments
- Build a referral network with multi-level income
- Track all earnings through a premium dark-mode dashboard

## 2. Features

- ✅ User registration & login with JWT authentication
- ✅ Referral-based registration with unique referral codes
- ✅ Multiple investment plans (Starter, Growth, Premium)
- ✅ Daily ROI calculation with idempotent processing
- ✅ 5-level referral income distribution
- ✅ Wallet accounting with full audit trail
- ✅ ROI and referral income histories with pagination
- ✅ Dashboard with aggregated statistics
- ✅ Earnings chart (Recharts)
- ✅ Complete referral tree (recursive component)
- ✅ Scheduled daily ROI processing (node-cron + Vercel endpoint)
- ✅ MongoDB transactions for financial consistency
- ✅ Responsive React dashboard with dark mode

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT (jsonwebtoken) + bcrypt |
| Validation | Joi |
| Scheduler | node-cron |
| Charts | Recharts |
| Security | Helmet, CORS, express-rate-limit |
| Deployment | Vercel |

## 4. Architecture

```
React UI → REST API → Auth + Validation → Thin Controllers → Business Services → MongoDB Transactions → MongoDB Atlas
```

**Layered Backend:**
```
Route → Middleware/Validation → Controller → Service → Mongoose Model → MongoDB
```

**Scheduler Architecture:**
```
node-cron (dev) ─────────┐
                          ▼
                   processDailyROI()
                          ▲
Vercel cron trigger ──────┘
```

## 5. Project Structure

```
nexachain-investment-platform/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── api/               # Axios instance + API calls
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # AuthContext
│   │   ├── layouts/           # DashboardLayout
│   │   ├── pages/             # Route pages
│   │   └── routes/            # AppRoutes + ProtectedRoute
│   └── index.html
├── server/                    # Express.js backend
│   ├── src/
│   │   ├── config/            # Database + env config
│   │   ├── constants/         # Referral levels, transaction types
│   │   ├── controllers/       # Thin HTTP controllers
│   │   ├── jobs/              # node-cron scheduler
│   │   ├── middleware/        # Auth, error, validation, rate-limit
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express routers
│   │   ├── services/          # Business logic layer
│   │   ├── utils/             # ApiError, asyncHandler, helpers
│   │   └── validators/        # Joi schemas
│   └── tests/
├── api/                       # Vercel serverless entry
├── postman/                   # Postman collection
└── vercel.json
```

## 6. Database Design

### Collections
- **User** — Registration, referral code, wallet balance, cached totals
- **Investment** — Plan snapshot, dates, status
- **ROIHistory** — Daily ROI records (unique: investment + processingDate)
- **ReferralIncome** — Level income records (unique: receiver + source + roiHistory + level)
- **WalletTransaction** — Immutable audit trail for all balance changes

### Key Indexes
- `ROIHistory(investment, processingDate)` — **UNIQUE** — idempotency safeguard
- `ReferralIncome(receiverUser, sourceUser, roiHistory, level)` — **UNIQUE** — duplicate payout prevention

## 7. Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (must support replica sets for transactions)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd nexachain-investment-platform

# Install all dependencies
cd server && npm install
cd ../client && npm install
```

## 8. Environment Variables

### Server (`server/.env`)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/nexachain
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CRON_SECRET=your-cron-secret
```

### Client (`client/.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## 9. Running Frontend/Backend

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Server runs on `http://localhost:5000`, Client on `http://localhost:5173`.

## 10. API Documentation

### Base URL: `/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login |
| GET | `/auth/me` | ✅ | Get current user |
| POST | `/investments` | ✅ | Create investment |
| GET | `/investments` | ✅ | List investments (paginated) |
| GET | `/investments/:id` | ✅ | Get investment by ID |
| GET | `/dashboard/summary` | ✅ | Dashboard stats |
| GET | `/dashboard/earnings` | ✅ | Earnings chart data |
| GET | `/roi/history` | ✅ | ROI history (paginated) |
| GET | `/referrals/direct` | ✅ | Direct referrals |
| GET | `/referrals/tree` | ✅ | Referral tree |
| GET | `/referrals/income` | ✅ | Referral income (paginated) |
| POST | `/internal/process-daily-roi` | 🔒 | Trigger daily ROI (cron secret) |

### Response Format
```json
{ "success": true, "data": {} }
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 10, "total": 0, "pages": 0 } }
{ "success": false, "message": "Error message", "code": "ERROR_CODE" }
```

## 11. Authentication

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens with configurable expiration
- Token sent via `Authorization: Bearer <token>` header
- Rate limiting on auth endpoints (20 requests / 15 min)
- Account status check on every authenticated request

## 12. ROI Calculation Logic

**Formula:**
```
dailyROI = investmentAmount × (dailyROIPercentage / 100)
```

- Pure function in `roi.service.js` → `calculateDailyROI()`
- Values rounded to 2 decimal places to prevent floating-point accumulation
- Only ACTIVE investments within startDate/endDate range are processed
- Investments auto-marked as COMPLETED when endDate passes

## 13. Referral Income Logic

- Referral level income = percentage of the daily ROI earned by the downstream investor
- Walks up the referral chain (referredBy → parent's referredBy → ...)
- Processes up to 5 configurable levels
- Each level credit creates: ReferralIncome record + WalletTransaction + wallet update

## 14. Idempotency Strategy

**3-Layer Protection:**
1. **Application check** — `ROIHistory.findOne()` for efficient early exit
2. **Database index** — Unique compound index `(investment, processingDate)` 
3. **MongoDB transaction** — All financial writes in a single session

Running `processDailyROI()` twice for the same date will:
- Skip already-processed investments
- Leave wallet balances unchanged
- Create no duplicate referral income

## 15. MongoDB Transaction Strategy

All financial operations (ROI credit, referral income, investment creation) use `session.withTransaction()`:
- Create ROI/income records
- Update wallet balance
- Update cached totals
- Create WalletTransaction audit entries

If any step fails, the entire transaction rolls back — no partial financial states.

## 16. Scheduler / node-cron

**Development:** `node-cron` runs at midnight (`0 0 * * *`) calling `processDailyROI()`

**Production (Vercel):** Protected endpoint `POST /api/v1/internal/process-daily-roi` called by Vercel Cron or external scheduler with `x-cron-secret` header.

Both mechanisms invoke the **same idempotent service** — no duplicate algorithms.

## 17. Vercel Deployment

- `vercel.json` routes API calls to serverless function, static to client build
- `api/index.js` — Serverless entry with lazy MongoDB connection
- node-cron disabled in production (no persistent process)

## 18. Assumptions

> These are documented assumptions NOT specified by the assessment.

1. **Referral level percentages:** L1=10%, L2=5%, L3=3%, L4=2%, L5=1%
2. **Level income source:** Calculated from the daily ROI amount
3. **Investment plans:** Starter (1%/30d), Growth (1.5%/60d), Premium (2%/90d)
4. **Minimum investment:** ₹1,000
5. **JWT expiration:** 7 days
6. ROI runs once per calendar day
7. Monetary values rounded to 2 decimal places
8. A user may have multiple active investments
9. Referral parent cannot be changed after registration
10. Users cannot refer themselves (enforced by referral code lookup)
11. Wallet cached totals are backed by immutable WalletTransaction records

## 19. Security Practices

- ✅ bcrypt password hashing (12 rounds)
- ✅ JWT authentication on all private routes
- ✅ Helmet security headers
- ✅ CORS configured for specific origin
- ✅ Rate limiting on auth routes
- ✅ Joi input validation
- ✅ Environment variables for all secrets
- ✅ No passwords in API responses (toJSON transform)
- ✅ No secrets committed (`.gitignore`, `.env.example`)
- ✅ Scheduler endpoint protected by cron secret
- ✅ Request body size limits (10kb)
- ✅ Production-safe error responses (no stack traces)

## 20. Testing

Run tests:
```bash
cd server && npm test
```

### Test Coverage
- Auth: register, duplicate, login, wrong password, protected routes
- Investment: create, invalid amount, list only user's investments
- ROI: correct formula, active/expired handling, wallet credit
- **Idempotency (mandatory):** Double execution produces single record
- Referral: multi-level traversal, max level respect, duplicate prevention

## 21. Future Improvements

- Admin panel for user/investment management
- Withdrawal system
- Email notifications (OTP, investment confirmations)
- Two-factor authentication
- Advanced analytics dashboard
- Real-time WebSocket updates
- Mobile app (React Native)
- Investment plan management by admins
- Comprehensive integration test suite
