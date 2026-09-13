# Project Overview — Scholarship Disbursement Platform

*A plain-English explanation of what this project is and why it exists.*

---

## In one line

A trusted middle layer between scholarship donors and needy students, where the college certifies the student is genuine, money moves through a real payment gateway, and every payment is locked into a record that cannot be secretly edited.

---

## The problem

A poor student needs scholarship money. Today the flow is: the student applies, someone checks the papers, a donor or NGO sends money.

Three things go wrong:

1. Nobody can prove the money actually reached the student.
2. Nobody can prove the mark sheets and income certificate were real.
3. Records sit in a database where a single person with access can quietly change an amount after the fact.

---

## Who uses it

The platform puts four types of people on one website.

| Role | What they do |
|------|--------------|
| **Student** | Signs up, sees the scholarships they are eligible for, checks their application status |
| **Verifier** (college / school / university) | The key idea — the *institution* fills and submits the student's application, uploads the mark sheets and income certificate, and vouches that they are real |
| **Donor / Admin** (NGO, company CSR team, individual) | Creates a scholarship, reviews applications, verifies each document, and pays the money |
| **Super Admin** (government level) | Approves which colleges and which donors are allowed on the platform at all |

---

## The flow, step by step

1. **Super Admin** approves a college and a donor so they can use the site.
2. **Donor** posts a scholarship with its rules — 10th marks, 12th marks, college CGPA, maximum family income, women preference, first-generation graduate, disability category, extracurricular achievements, special category (orphan / single parent), amount, and deadline.
3. **Student** registers with their academic and family details.
4. **The college applies on the student's behalf** and uploads the supporting documents. Every uploaded document starts as `verified: false`.
5. **Donor** opens the application, reviews each document, and marks it verified or not.
6. **Donor** approves and pays. The payment goes out through **Razorpay** to the student's bank account (account holder name, account number, IFSC). A beneficiary is created on Razorpay first, then the payout is made.
7. A **receipt is emailed**, and the payment is written into the audit chain (below).

Application status moves through: `pending` → `submitted` → `approved` → `funded` (or `rejected`).

---

## The "blockchain" part — what it actually is

**Important: this is not Ethereum. There is no crypto, no wallet, no MetaMask, no gas fees.**

It is a **private chain of records kept inside our own MongoDB**, and its only job is to make the payment history **tamper-evident**.

### How it works

Every time a payment is verified, the server creates a **block** containing:

- the amount, currency and status,
- the Razorpay payment ID and order ID,
- **hashed** (scrambled, non-reversible) versions of the student ID, application ID and transaction ID,
- and the **hash of the previous block**.

The transaction ID itself is generated with **HMAC-SHA256** over the application ID, the Razorpay payment ID, a timestamp and random bytes — so it is unique and cannot be reversed back into the original data.

### Why this matters

Because each block carries the fingerprint of the block before it, the blocks form a chain. If someone later opens the database and edits an old payment — changes ₹50,000 to ₹5,000 — that block's hash no longer matches what the next block recorded, and the chain breaks.

`validateChain()` walks the whole chain and detects it instantly.

### What it gives us

- **Proof of integrity** — a donor or an auditor can verify that no payment record was changed after it was written.
- **Privacy** — the real student and transaction IDs are never stored in the block, only their hashes.
- **A complete audit trail** — every disbursement, in order, with cryptographic verification.

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React (Create React App), React Router |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Payments | Razorpay (orders, payment verification, payouts to bank accounts) |
| Integrity | Custom HMAC-SHA256 hash chain stored in MongoDB |
| Uploads | Multer (documents stored under `Server/uploads/`) |

---

## Repository layout

```
├── client/                      # React frontend
│   └── src/
│       ├── student/             # Register, login, dashboard, view scholarships
│       ├── Verifier/            # College: register, apply for a student, upload docs
│       ├── admin/               # Donor: create scholarship, view applications, make payment
│       └── superadmin/          # Approve pending donors and verifiers
└── Server/
    ├── server.js
    ├── models/
    │   ├── user.js              # Student
    │   ├── verifier.js          # Institution
    │   ├── donor.js             # NGO / CSR / individual
    │   ├── superadmin.js
    │   ├── scholarship.js       # Scholarship + eligibility criteria
    │   ├── verifierapplyform.js # The application, payout details, payout history
    │   ├── transaction.js       # Payment record, links to its block
    │   └── block.js             # One link in the audit chain
    ├── controllers/             # student, verifier, admin (donor), superadmin
    ├── routes/
    ├── services/
    │   ├── blockchainService.js # Hash chain: create block, validate chain, stats
    │   └── razorpayService.js   # Orders, payment verification, beneficiaries, payouts
    └── uploads/                 # Uploaded student documents
```

---

## Running it

### Backend

```bash
cd Server
npm install
npm start
```

Required in `Server/.env`:

```
BLOCKCHAIN_SECRET=your-super-secret-key-min-32-chars
```

plus your MongoDB connection string, Razorpay keys and mail credentials.

### Frontend

```bash
cd client
npm install
npm start
```

---

## Main API routes

**Student** (`/student`) — `register`, `login`, `scholarships`, `applicationstatus/:applicationNo`

**Verifier** (`/verifier`) — `register`, `login`, `getallscholarships`, `applyscholarship`, `uploaddocuments/:applicationId`, `getapplicationstatus`

**Donor / Admin** (`/admin`) — `register`, `login`, `createscholarship`, `applications`, `applications/:id/documents/:docId` (verify a document), `applications/:id/create-beneficiary`, `applications/:id/create-order`, `applications/:id/verify-payment` (creates the block), `applications/:id/makepayout`, `applications/:id/send-receipts`, `transactions/search`

**Super Admin** (`/superadmin`) — `pending-donors`, `pending-verifiers`, approve / reject

---

## Design decisions worth knowing

- **The college submits the application, not the student.** This is deliberate. It moves the burden of proof onto an institution that has a reputation to lose, instead of trusting self-uploaded documents.
- **Documents are unverified by default.** A donor must actively mark each one verified before funding.
- **Sensitive payout data.** Bank account numbers are currently stored in plain text alongside a masked version. Before production these should be encrypted, or only the Razorpay beneficiary ID and the masked number should be kept.
- **The hash chain is deliberately simple.** It is a single-server audit log, not a distributed consensus system. It proves *nobody edited the history*; it does not remove the need to trust the server operator. That trade-off was the right one here — real blockchain infrastructure would add cost and latency to a flow that already depends on a centralised payment gateway.
