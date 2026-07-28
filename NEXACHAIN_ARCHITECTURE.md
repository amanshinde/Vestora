# NexaChain AI MERN Technical Assessment
## Application Architecture & Implementation Reference

> **Purpose:** This document is the source of truth for building the NexaChain AI MERN Stack Developer technical assessment. Follow this architecture unless a change is necessary for correctness. Do not invent major business rules silently; document assumptions in the README.

---

## 1. Objective

Build a production-shaped investment and referral platform using:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Authentication:** JWT + bcrypt
- **Scheduler requirement:** `node-cron`
- **Production deployment:** Vercel
- **API style:** REST
- **Charts:** Recharts or equivalent lightweight React chart library
- **Testing:** Vitest/Jest + Supertest as appropriate

The application must support:

1. User registration and login
2. Referral-based registration
3. Investments
4. Daily ROI calculation
5. Multi-level referral income
6. Wallet accounting
7. ROI and referral income histories
8. Dashboard statistics
9. Complete referral tree
10. Daily scheduled ROI processing
11. Duplicate-safe/idempotent financial processing
12. Responsive React dashboard

---

# 2. Core Engineering Principles

The implementation should follow these rules.

### 2.1 Layered backend

Use:

```text
Route
  ↓
Middleware / Validation
  ↓
Controller
  ↓
Service
  ↓
Mongoose Model
  ↓
MongoDB
```

Controllers must remain thin. Business logic belongs in services.

### 2.2 Financial consistency

Any operation that changes financial state should be treated as an atomic business operation.

Use MongoDB transactions where multiple related writes must either all succeed or all fail.

### 2.3 Idempotency

Daily ROI must never be credited twice for the same investment and processing date.

Enforce this at both:

- application/service level
- database level using a unique compound index

### 2.4 Auditability

Do not rely only on cached totals such as `walletBalance`.

Maintain transaction/history records explaining financial changes.

### 2.5 Configuration over hardcoding

Referral percentages, JWT expiration, scheduler secrets, and similar settings should live in environment/config/constants files.

### 2.6 Security

Never trust client input. Validate all request data and protect all private endpoints.

---

# 3. High-Level Architecture

```text
                         Browser
                            │
                            ▼
                    React + Vite App
                       on Vercel
                            │
                       HTTPS / JSON
                            │
                            ▼
                   Express REST API
                       on Vercel
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
          ▼                 ▼                  ▼
    Authentication      Controllers       Scheduled API
          │                 │                  │
          └─────────────┬───┘                  │
                        ▼                      │
                    Services ◄─────────────────┘
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       ROI Service  Referral Service Wallet Service
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                 MongoDB Transactions
                        │
                        ▼
                   MongoDB Atlas
```

---

# 4. Repository Structure

Use a monorepo.

```text
nexachain-investment-platform/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── auth.api.js
│   │   │   ├── investment.api.js
│   │   │   ├── dashboard.api.js
│   │   │   ├── roi.api.js
│   │   │   └── referral.api.js
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── investments/
│   │   │   ├── referrals/
│   │   │   └── charts/
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── InvestmentsPage.jsx
│   │   │   ├── ROIHistoryPage.jsx
│   │   │   ├── ReferralIncomePage.jsx
│   │   │   └── ReferralsPage.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   ├── constants/
│   │   │   ├── referralLevels.js
│   │   │   └── transactionTypes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── investment.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── roi.controller.js
│   │   │   └── referral.controller.js
│   │   ├── jobs/
│   │   │   └── dailyROI.job.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Investment.js
│   │   │   ├── ROIHistory.js
│   │   │   ├── ReferralIncome.js
│   │   │   └── WalletTransaction.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── investment.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── roi.routes.js
│   │   │   ├── referral.routes.js
│   │   │   └── scheduler.routes.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── investment.service.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── roi.service.js
│   │   │   ├── referral.service.js
│   │   │   └── wallet.service.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── investment.validator.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── generateReferralCode.js
│   │   │   └── generateToken.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── api/
│   └── index.js
│
├── postman/
│   └── NexaChain.postman_collection.json
│
├── docs/
│   └── ARCHITECTURE.md
│
├── .gitignore
├── README.md
├── package.json
└── vercel.json
```

Do not put unrelated business logic inside route files.

---

# 5. Database Design

## 5.1 User

Fields:

```text
_id
fullName
email
mobile
passwordHash
referralCode
referredBy -> User._id | null
walletBalance
totalROIEarned
totalLevelIncomeEarned
accountStatus
createdAt
updatedAt
```

Recommended account statuses:

```text
ACTIVE
SUSPENDED
BLOCKED
```

Indexes:

```text
email                 unique
mobile                unique
referralCode          unique
referredBy            index
accountStatus         index where useful
```

Rules:

- Normalize email to lowercase.
- Never expose `passwordHash`.
- Hash passwords using bcrypt.
- Generate collision-resistant referral codes.
- `referredBy` stores the direct parent only.
- Do not embed an entire referral tree in the User document.

---

## 5.2 Investment

Fields:

```text
_id
user -> User._id
amount
plan:
    name
    durationDays
    dailyROIPercentage
startDate
endDate
status
createdAt
updatedAt
```

Statuses:

```text
ACTIVE
COMPLETED
CANCELLED
```

Indexes:

```text
user
status
user + status
endDate
```

Validation:

- amount > 0
- daily ROI percentage > 0
- durationDays > 0
- endDate must be after startDate

Store a snapshot of relevant plan terms on the investment so future configuration changes do not alter existing investment contracts.

---

## 5.3 ROIHistory

Fields:

```text
_id
user -> User._id
investment -> Investment._id
roiAmount
roiPercentage
processingDate
status
createdAt
updatedAt
```

Statuses:

```text
CREDITED
FAILED
```

CRITICAL INDEX:

```text
unique(investment, processingDate)
```

Normalize `processingDate` to a single business-day representation before storing it.

This database constraint is the final safeguard against duplicate daily ROI.

---

## 5.4 ReferralIncome

Fields:

```text
_id
receiverUser -> User._id
sourceUser -> User._id
investment -> Investment._id
roiHistory -> ROIHistory._id
level
percentage
amount
processingDate
createdAt
```

Recommended unique constraint:

```text
unique(receiverUser, sourceUser, roiHistory, level)
```

This prevents duplicate referral payouts for the same ROI event.

---

## 5.5 WalletTransaction

This model is an architectural enhancement beyond the minimum assignment.

Fields:

```text
_id
user -> User._id
type
amount
referenceType
referenceId
balanceBefore
balanceAfter
description
createdAt
```

Transaction types:

```text
ROI_CREDIT
REFERRAL_CREDIT
INVESTMENT_DEBIT
ADJUSTMENT
```

The wallet balance is a convenient current-state value. `WalletTransaction` is the audit trail.

Never silently modify wallet balances without creating the corresponding financial record.

---

# 6. Referral Model

Represent referrals through adjacency:

```text
User.referredBy -> parent User
```

Example:

```text
              A
            /   \
           B     C
          / \     \
         D   E     F
```

Storage:

```text
B.referredBy = A
C.referredBy = A
D.referredBy = B
E.referredBy = B
F.referredBy = C
```

Do not store nested child arrays as the canonical hierarchy.

For small assessment-scale data, construct the tree through controlled recursive/batched queries or an aggregation strategy. Avoid uncontrolled N+1 recursion for large datasets.

---

# 7. Referral Level Configuration

Keep percentages centralized.

Example assumption:

```javascript
export const REFERRAL_LEVELS = {
  1: 10,
  2: 5,
  3: 3,
  4: 2,
  5: 1,
};
```

IMPORTANT:

The assessment does not define exact referral percentages. Therefore these values are assumptions and MUST be documented in README under `Assumptions`.

Do not present assumed percentages as requirements supplied by NexaChain.

---

# 8. API Design

Base path:

```text
/api/v1
```

## Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

Registration body:

```json
{
  "fullName": "Example User",
  "email": "user@example.com",
  "mobile": "9999999999",
  "password": "StrongPassword123",
  "referralCode": "OPTIONAL_CODE"
}
```

Login:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

---

## Investments

```text
POST /api/v1/investments
GET  /api/v1/investments
GET  /api/v1/investments/:id
```

Support pagination for list endpoints.

Example:

```text
GET /api/v1/investments?page=1&limit=10
```

---

## Dashboard

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/earnings
```

Summary should return at least:

```json
{
  "totalInvestments": 0,
  "dailyROI": 0,
  "totalROIEarned": 0,
  "totalLevelIncomeEarned": 0,
  "walletBalance": 0
}
```

Compute/aggregate server-side. Do not make React download full histories merely to calculate summary values.

---

## ROI

```text
GET /api/v1/roi/history?page=1&limit=10
```

---

## Referrals

```text
GET /api/v1/referrals/direct
GET /api/v1/referrals/tree
GET /api/v1/referrals/income?page=1&limit=10
```

---

## Scheduler

Provide an internally protected endpoint for the Vercel-compatible production trigger:

```text
GET or POST /api/v1/internal/process-daily-roi
```

Requirements:

- protected using a scheduler/cron secret
- not available as an ordinary authenticated-user endpoint
- calls the same `roiService.processDailyROI()` used by the `node-cron` implementation
- contains no duplicate financial algorithm

Do not depend on this endpoint alone for idempotency.

---

# 9. Standard API Response Format

Successful response:

```json
{
  "success": true,
  "data": {}
}
```

Paginated response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "pages": 0
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Human readable message",
  "code": "MACHINE_READABLE_ERROR"
}
```

Use centralized error middleware.

Do not leak stack traces or sensitive internals in production.

---

# 10. Authentication Flow

Registration:

```text
Validate input
      ↓
Normalize email/mobile
      ↓
Check duplicate email/mobile
      ↓
Validate referral code if supplied
      ↓
Hash password
      ↓
Generate unique referral code
      ↓
Create user
      ↓
Issue JWT
```

Login:

```text
Validate input
      ↓
Find user
      ↓
Compare bcrypt password
      ↓
Verify account is ACTIVE
      ↓
Issue JWT
```

Private request:

```text
Authorization: Bearer <token>
             ↓
       auth.middleware
             ↓
          verify JWT
             ↓
        attach req.user
             ↓
          controller
```

---

# 11. Controller Rules

Controllers:

- read HTTP input
- call services
- select HTTP status
- return response

Controllers MUST NOT contain the main ROI/referral algorithms.

Example shape:

```javascript
export const createInvestment = asyncHandler(async (req, res) => {
  const investment = await investmentService.createInvestment(
    req.user.id,
    req.body
  );

  res.status(201).json({
    success: true,
    data: investment,
  });
});
```

---

# 12. Daily ROI Service

The actual financial algorithm belongs in:

```text
server/src/services/roi.service.js
```

Expose something conceptually similar to:

```text
processDailyROI(processingDate?)
processInvestmentROI(investment, processingDate, session)
calculateDailyROI(amount, percentage)
```

`calculateDailyROI` should be a pure function.

Formula:

```text
dailyROI = investmentAmount * (dailyROIPercentage / 100)
```

Use an appropriate decimal/money strategy. Avoid accumulating floating-point errors in financial calculations. For this assessment, either use a decimal library or store/round monetary values consistently to the smallest supported currency precision.

---

# 13. Daily ROI Processing Flow

```text
Scheduler Trigger
       ↓
processDailyROI()
       ↓
Normalize processing date
       ↓
Find eligible ACTIVE investments
       ↓
For each investment
       ↓
Is investment active for processing date?
       ↓
Attempt duplicate-safe processing
       ↓
MongoDB transaction
       │
       ├── Create ROIHistory
       ├── Credit user wallet
       ├── Increment totalROIEarned
       ├── Create WalletTransaction
       └── Process referral income
       ↓
Commit
```

An investment is eligible only if:

- status is ACTIVE
- startDate <= processing date
- endDate >= processing date

When an investment reaches its end condition, update its status appropriately.

---

# 14. Idempotency Strategy

This is a critical requirement.

Never implement duplicate protection as only:

```javascript
const existing = await ROIHistory.findOne(...);
if (existing) return;
```

That check alone is vulnerable to concurrent requests.

Use:

### Layer 1

Application check for efficient early exit.

### Layer 2

Unique MongoDB compound index:

```text
investment + processingDate
```

### Layer 3

MongoDB transaction for related writes.

Expected behavior:

```text
First execution:
ROI credited successfully.

Second execution for same investment/date:
Unique constraint prevents another ROI event.
Wallet remains unchanged.
Referral income remains unchanged.
```

Write an automated test proving this.

---

# 15. Transaction Consistency

Financial writes belonging to one ROI event should use a Mongoose session / MongoDB transaction.

Conceptually:

```javascript
const session = await mongoose.startSession();

await session.withTransaction(async () => {
  // create ROI record
  // update wallet
  // update total ROI
  // create wallet transaction
  // distribute referral earnings
});
```

If any required operation fails, rollback the transaction.

Do not leave:

```text
ROIHistory = CREDITED
wallet = NOT CREDITED
```

or the reverse.

MongoDB Atlas configuration must support transactions.

---

# 16. Referral Income Processing

Referral income should be triggered from a defined income-generating event. For this implementation, assume referral level income is calculated from the generated daily ROI unless product requirements specify otherwise.

Document this assumption.

Flow:

```text
Investor generates ROI
       ↓
Get investor.referredBy
       ↓
Level 1 parent
       ↓
Calculate configured percentage
       ↓
Credit parent
       ↓
Move to parent's referredBy
       ↓
Level 2
       ↓
Continue until:
  - max configured level reached, OR
  - no parent exists
```

Service:

```text
referral.service.js
```

Suggested functions:

```text
distributeLevelIncome(...)
getDirectReferrals(...)
getReferralTree(...)
```

For every referral credit:

1. Create `ReferralIncome`
2. Increment receiver's `walletBalance`
3. Increment `totalLevelIncomeEarned`
4. Create `WalletTransaction`

All financial writes associated with an ROI processing event should participate in the appropriate transaction/session.

---

# 17. node-cron Requirement

The assessment explicitly requires a `node-cron` implementation.

Create:

```text
server/src/jobs/dailyROI.job.js
```

Conceptual implementation:

```javascript
cron.schedule("0 0 * * *", async () => {
  await roiService.processDailyROI();
});
```

Important:

`dailyROI.job.js` is ONLY a trigger.

Never put the ROI calculation algorithm directly inside the cron callback.

---

# 18. Vercel Deployment Strategy

The final application should use Vercel as requested.

Because Vercel uses serverless execution, do not assume a continuously running Express process will remain alive to execute an in-process `node-cron` timer.

Therefore use two compatible trigger mechanisms around ONE service:

```text
Development / conventional Node runtime
              │
          node-cron
              │
              ▼
      processDailyROI()
              ▲
              │
      Vercel scheduled trigger
              │
      protected API endpoint
```

The repository still includes and demonstrates the requested `node-cron` implementation.

The production Vercel scheduling mechanism invokes the same idempotent service through a secured endpoint/function.

Document this explicitly in README.

Do not maintain separate ROI algorithms.

---

# 19. Frontend Architecture

Use a professional SaaS-style dashboard.

Primary routes:

```text
/login
/register

/dashboard
/investments
/roi-history
/referral-income
/referrals
```

Private pages must use `ProtectedRoute`.

Dashboard layout:

```text
┌─────────────────────────────────────────────────────┐
│ Header / User                                       │
├────────────┬────────────────────────────────────────┤
│ Sidebar    │ Dashboard                              │
│            │                                        │
│ Dashboard  │ Stats cards                            │
│ Investment │                                        │
│ ROI        │ Earnings chart                         │
│ Referrals  │                                        │
│ Income     │ Recent activity                        │
│            │                                        │
└────────────┴────────────────────────────────────────┘
```

The design must be responsive.

---

# 20. Frontend Component Design

Example dashboard composition:

```text
DashboardPage
│
├── PageHeader
├── StatsGrid
│   ├── StatCard
│   ├── StatCard
│   ├── StatCard
│   └── StatCard
├── EarningsChart
├── RecentInvestments
└── RecentROI
```

Referral tree:

```text
ReferralTree
    │
    └── ReferralNode
            │
            ├── ReferralNode
            └── ReferralNode
```

Use a recursive component for nested hierarchy display.

Do not create a single giant dashboard component.

---

# 21. Frontend API Layer

Use a centralized Axios instance:

```text
client/src/api/axios.js
```

Responsibilities:

- base URL
- auth token attachment
- common headers
- centralized handling of authentication failures

Feature-specific API files call that instance.

Do not duplicate fetch/axios configuration in every React component.

---

# 22. Frontend State

Keep state management proportional to the assignment.

Recommended:

- Auth Context for authentication/session state
- local component state or a data-fetching library for server data

Do not introduce Redux unless it solves a real need.

Avoid overengineering.

---

# 23. UI States

Every asynchronous page/component should handle:

```text
LOADING
SUCCESS
EMPTY
ERROR
```

Use:

- skeletons/spinners
- useful empty-state messages
- retry/error feedback

Tables must not simply disappear when data is unavailable.

---

# 24. Dashboard Requirements

Cards:

- Total Investments
- Daily ROI
- Total ROI Earned where useful
- Total Level Income
- Wallet Balance

Tables:

- Investment History
- ROI History
- Referral Income History

Visualizations:

- earnings over time
- ROI/referral income breakdown if useful

Referral hierarchy:

- nested/expandable tree
- display name and level
- avoid excessive information

---

# 25. Pagination

Use server-side pagination for history endpoints.

Example:

```text
GET /api/v1/roi/history?page=1&limit=10
```

Do the same for:

- investments
- ROI history
- referral income

Do not fetch unbounded financial histories.

---

# 26. Validation

Use a validation library such as Zod, Joi, or express-validator.

Validate registration:

```text
fullName required
email valid
mobile valid
password meets minimum policy
referral code valid when provided
```

Validate investment:

```text
amount > 0
valid plan data
allowed fields only
```

Reject malformed IDs and invalid pagination parameters.

Never directly trust `req.body`, `req.params`, or `req.query`.

---

# 27. Security Checklist

Implement:

- bcrypt password hashing
- JWT authentication
- protected private routes
- Helmet
- CORS configuration
- rate limiting, especially auth routes
- request validation
- environment variables
- production-safe error responses
- no passwords in API output
- no secrets in Git
- scheduler endpoint secret
- safe MongoDB queries
- sensible request body limits

Consider token storage/security carefully. Do not expose secrets in frontend environment variables.

---

# 28. Environment Variables

Server example:

```text
NODE_ENV=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
CLIENT_URL=
CRON_SECRET=
```

Client example:

```text
VITE_API_BASE_URL=
```

Provide:

```text
client/.env.example
server/.env.example
```

Never commit actual `.env` files.

---

# 29. Error Handling

Create:

```text
ApiError
asyncHandler
global error middleware
404 handler
```

Examples of application error codes:

```text
VALIDATION_ERROR
UNAUTHORIZED
INVALID_CREDENTIALS
USER_ALREADY_EXISTS
INVALID_REFERRAL_CODE
INVESTMENT_NOT_FOUND
DUPLICATE_ROI
INTERNAL_ERROR
```

Keep production responses clean.

---

# 30. Performance

Implement appropriate indexes.

Avoid:

- unbounded `.find()`
- unnecessary `populate()`
- returning full Mongoose documents when lean projections suffice
- N+1 queries where avoidable
- frontend calculations over huge history datasets

Use:

- `.lean()` for read-only queries where appropriate
- projections
- pagination
- aggregation for dashboard data
- indexes matching query patterns

---

# 31. Testing Strategy

At minimum test critical business behavior.

### Authentication

- register
- duplicate registration
- login
- incorrect password
- protected endpoint without JWT

### Investment

- create valid investment
- reject invalid amount
- list only authenticated user's investments

### ROI

- correct ROI formula
- active investment receives ROI
- expired/cancelled investment does not
- wallet is credited
- ROI history created

### Idempotency — mandatory

Test:

```text
Run processDailyROI(date)
Run processDailyROI(same date)

Expected:
only one ROIHistory entry
wallet credited once
totalROIEarned incremented once
referral income credited once
```

### Referral

- direct referral
- multi-level traversal
- stops when parent chain ends
- respects max configured level
- duplicate payout prevented

---

# 32. Logging

Use concise structured server logging.

Log:

- application startup
- DB connection
- scheduler start/end
- ROI batch summary
- unexpected errors

Do NOT log:

- passwords
- JWTs
- secrets
- sensitive personal information unnecessarily

Example scheduler summary:

```text
Daily ROI completed:
processed=120
credited=115
skipped=5
failed=0
```

---

# 33. Git Commit Strategy

Use meaningful commits.

Examples:

```text
chore: initialize client and server applications
feat: add user and investment schemas
feat: implement JWT authentication
feat: implement investment APIs
feat: add wallet transaction ledger
feat: implement idempotent daily ROI processing
feat: implement referral income distribution
feat: add dashboard aggregation endpoints
feat: build responsive dashboard
feat: add referral tree
test: add ROI idempotency tests
docs: add architecture and API documentation
```

Do not submit the entire project as one `final project` commit.

---

# 34. README Requirements

The final README should contain:

```text
1. Project Overview
2. Features
3. Tech Stack
4. Architecture
5. Project Structure
6. Database Design
7. Local Setup
8. Environment Variables
9. Running Frontend/Backend
10. API Documentation
11. Authentication
12. ROI Calculation Logic
13. Referral Income Logic
14. Idempotency Strategy
15. MongoDB Transaction Strategy
16. Scheduler / node-cron
17. Vercel Deployment
18. Assumptions
19. Security Practices
20. Testing
21. Future Improvements
```

The README is part of the assessment, not an afterthought.

---

# 35. Explicit Assumptions

The assessment leaves some business rules undefined. Keep assumptions centralized and document them.

Possible assumptions:

1. Referral level percentages are configurable and are not specified by the assessment.
2. Level income is generated from daily ROI events.
3. An investment earns ROI only while ACTIVE and within its start/end dates.
4. ROI runs once per calendar processing day.
5. Monetary values are rounded/stored consistently to supported currency precision.
6. A user may have multiple investments.
7. Referral parent cannot be changed after registration.
8. Users cannot refer themselves.
9. Cycles in the referral graph must be impossible.
10. Wallet totals are cached state backed by immutable/auditable history records.

If implementation chooses different assumptions, update this section and README.

---

# 36. Important Invariants

The system should always preserve these conditions:

```text
A password is never stored in plaintext.

A user cannot refer themselves.

An investment cannot receive the same day's ROI twice.

A referral payout cannot be created twice for the same ROI event/level/receiver.

Wallet changes have an audit record.

Failed multi-document financial operations roll back.

Users can access only their own private financial data.

The scheduler endpoint cannot be invoked by normal unauthorized users.

Frontend never contains backend secrets.

Business logic does not depend on the scheduler implementation.
```

---

# 37. Implementation Order

Build in this sequence.

## Phase 1 — Foundation

1. Initialize repository
2. Setup React/Vite
3. Setup Express
4. Configure environment validation
5. Connect MongoDB Atlas
6. Add global errors/security middleware

## Phase 2 — Database

7. User schema
8. Investment schema
9. ROIHistory schema
10. ReferralIncome schema
11. WalletTransaction schema
12. Add indexes

## Phase 3 — Authentication

13. Registration
14. Referral-code validation
15. Login
16. JWT middleware
17. `/auth/me`

## Phase 4 — Investments

18. Create investment
19. List investments
20. Investment detail
21. Pagination/validation

## Phase 5 — Financial Engine

22. Wallet service
23. Pure ROI calculator
24. Daily ROI service
25. MongoDB transactions
26. Unique duplicate protection
27. Referral income service
28. Automated idempotency tests

## Phase 6 — Scheduler

29. Implement `node-cron`
30. Add protected Vercel scheduler entry point
31. Both call identical ROI service

## Phase 7 — Dashboard APIs

32. Summary
33. Earnings history
34. ROI history
35. Referral income
36. Direct referrals
37. Referral tree

## Phase 8 — Frontend

38. Authentication pages
39. Protected layout
40. Sidebar/header
41. Dashboard cards
42. Earnings chart
43. Investment screens
44. ROI history
45. Referral income
46. Referral tree
47. Responsive states
48. Loading/error/empty states

## Phase 9 — Delivery

49. Postman collection
50. Tests
51. README
52. `.env.example`
53. Vercel configuration
54. Production deployment
55. End-to-end testing
56. Final code cleanup

---

# 38. Definition of Done

Do not consider the project complete until:

- [ ] User can register
- [ ] Optional referral code works
- [ ] User can login
- [ ] JWT protects private endpoints
- [ ] User can create/view investments
- [ ] Dashboard displays required totals
- [ ] Daily ROI is calculated correctly
- [ ] ROI history is persisted
- [ ] Wallet is credited correctly
- [ ] Referral hierarchy works
- [ ] Referral income is distributed
- [ ] Referral history is persisted
- [ ] Complete referral tree renders
- [ ] `node-cron` implementation exists
- [ ] Duplicate ROI execution is prevented
- [ ] MongoDB transactions protect financial operations
- [ ] Critical idempotency test passes
- [ ] Loading/error/empty UI states exist
- [ ] Dashboard is responsive
- [ ] Charts work
- [ ] Pagination exists on histories
- [ ] Postman collection is included
- [ ] README documents setup/API/assumptions
- [ ] No secrets are committed
- [ ] Production Vercel deployment works
- [ ] GitHub repository is clean and readable

---

# 39. Guidance for AI Coding Agent

When using this file as context:

1. Treat this document as the architectural source of truth.
2. Implement one phase at a time.
3. Do not generate the entire application in one uncontrolled step.
4. Preserve the Route → Controller → Service → Model separation.
5. Do not move financial business logic into controllers or cron callbacks.
6. Do not weaken database-level idempotency.
7. Do not remove MongoDB transactions from multi-write financial operations.
8. Do not invent business requirements without documenting them as assumptions.
9. Do not add unnecessary infrastructure or libraries.
10. Prefer readable code over clever abstractions.
11. Keep functions focused and testable.
12. Add comments for non-obvious business logic, not obvious syntax.
13. Validate after every phase before proceeding.
14. Never commit secrets.
15. Keep the application explainable by a junior developer during a technical interview.

---

# 40. Architectural Summary

The most important architecture is:

```text
React UI
   │
   ▼
REST API
   │
   ▼
Authentication + Validation
   │
   ▼
Thin Controllers
   │
   ▼
Business Services
   │
   ├── Investment
   ├── ROI
   ├── Referral
   ├── Wallet
   └── Dashboard
   │
   ▼
MongoDB Transactions
   │
   ▼
MongoDB Atlas
```

Scheduler:

```text
node-cron ───────────────┐
                         │
                         ▼
                  processDailyROI()
                         ▲
                         │
Vercel scheduler ────────┘
```

Financial safety:

```text
Application duplicate check
          +
Unique MongoDB index
          +
MongoDB transaction
          +
Wallet transaction ledger
          =
Reliable idempotent processing
```

The project should look like a thoughtful, maintainable MERN application rather than a collection of CRUD endpoints.
