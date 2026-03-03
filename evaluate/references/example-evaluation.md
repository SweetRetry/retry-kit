# Example Evaluation — REST API Design

This file demonstrates the expected depth and format for every section of the Evaluation Report.
Use it to calibrate how granular Evidence Inventory entries should be, and how specific
Deduction Log findings must be before a point is removed.

---

**Input being evaluated** (abbreviated for illustration):

```
POST /api/v1/orders
POST /api/v1/orders/cancel     ← cancels an order
GET  /api/orders               ← missing version prefix
POST /api/v1/payment/charge    ← no idempotency mechanism documented
Errors returned as HTTP 200 with { "success": false, "msg": "..." }
No rate limiting mentioned.
No authentication scheme documented.
```

---

## Evaluation Report

**Domain**: Public-facing REST API design (e-commerce order + payment endpoints)
**Baseline**: Industry standard for production REST APIs (RFC 7231, REST maturity model Level 2+)
**Axes**: URL Consistency (20%) | Error Contract (25%) | Idempotency (25%) | Security Surface (20%) | Versioning (10%)
**Input Completeness**: ~40% — only endpoint list and error format provided; auth, rate limiting,
and request/response schemas are absent. Deductions for absence marked [?] at 50% weight.

---

### Evidence Inventory

| Present | Claimed, Not Demonstrated | Absent (Expected) |
|---|---|---|
| POST /api/v1/orders — versioned, reasonable verb | — | Request schema (required fields, types) |
| POST /api/v1/orders/cancel — cancel via POST | — | Response schema for success and error cases |
| GET /api/orders — endpoint exists | — | Authentication scheme (API key, OAuth, JWT) |
| Error format: HTTP 200 + `{ "success": false, "msg": "..." }` | — | Rate limiting headers or policy |
| POST /api/v1/payment/charge — endpoint exists | — | Idempotency mechanism (header, key field) |
| — | "v1" implies versioning strategy | Version deprecation policy |
| — | — | Pagination for collection endpoints |

---

### Deduction Log

| # | Evidence (cite specific finding) | Dimension | Severity | Deduction |
|---|---|---|---|---|
| 1 | `GET /api/orders` is missing the `/v1/` version prefix present on all other endpoints. A client pinned to v1 calling this endpoint will break silently on future version changes — this is a core routing inconsistency. | URL Consistency | Functional Gap | −8 |
| 2 | `POST /api/v1/orders/cancel` uses a verb in the URL path. REST convention is `POST /api/v1/orders/{id}/cancellations` (resource-oriented). Current form mixes RPC and REST styles, making the API surface harder to predict. | URL Consistency | Cosmetic | −2 |
| 3 | Errors are returned as HTTP 200 with `{ "success": false }`. This breaks HTTP semantics: clients, proxies, and monitoring tools all treat 2xx as success. A client checking `response.ok` will silently swallow errors. Violates RFC 7231 §6.3. | Error Contract | Structural Flaw | −20 |
| 4 | No idempotency mechanism documented for `POST /api/v1/payment/charge`. A network retry on a charge endpoint without idempotency causes double-billing. Industry standard is a client-generated idempotency key header. [?] | Idempotency | Fatal Defect | −25 × 50% = −13 |
| 5 | No authentication scheme present in input. Cannot determine if endpoints are protected. [?] | Security Surface | Structural Flaw | −15 × 50% = −8 |
| 6 | No rate limiting documented. Payment endpoints with no rate limit are trivially abusable for enumeration or billing exhaustion. [?] | Security Surface | Functional Gap | −8 × 50% = −4 |

**Raw deductions**: −8 −2 −20 −13 −8 −4 = −55
**Final Score**: max(0, 100 − 55) / 100 = **45 / 100**

> Note: Finding #4 is a Fatal Defect. Fatal ceiling check: Idempotency dimension (25% weight)
> cannot contribute more than 30% × 25 = 7.5 points to the final score. Actual contribution
> after deduction: 25 − 13 = 12 points — within ceiling, no adjustment needed.

---

### Dimension Scores

| Dimension | Score | Verdict | Rationale |
|---|---|---|---|
| URL Consistency (20%) | 10/20 | Warn | Version prefix missing on one endpoint; RPC-style verb in path |
| Error Contract (25%) | 5/25 | Fail | HTTP 200 for errors violates RFC 7231 — breaks all standard HTTP tooling |
| Idempotency (25%) | 12/25 | Fail | No idempotency key on payment charge; double-billing risk on retry |
| Security Surface (20%) | 8/20 | Warn | Auth and rate limiting absent from input; scored at 50% weight |
| Versioning (10%) | 10/10 | Pass | v1 prefix present on most endpoints; version-in-URL is a valid strategy |

---

### Priority Fix

**Recover ~20 points**: Change all error responses to use appropriate HTTP status codes
(`400` for client errors, `422` for validation failures, `500` for server errors) and return
a structured error body: `{ "error": { "code": "ORDER_NOT_FOUND", "message": "..." } }`.
This single change fixes the entire Error Contract dimension and makes the API compatible
with HTTP clients, proxies, APM tools, and retry logic that rely on status codes.

---

### Rebuild Checklist

Before iterating on endpoint design, validate these foundational assumptions:

1. **HTTP semantics are respected end-to-end**: Every middleware, gateway, and client must
   handle 4xx/5xx correctly — if any layer converts errors to 200, fixing the API layer alone
   won't help.
2. **Payment idempotency is a system-level guarantee**: The idempotency key must be stored
   and checked at the database or service layer, not just passed through as a header.
3. **"v1" implies a versioning contract**: Define what constitutes a breaking change and
   how long v1 will be supported before introducing v2 — otherwise versioning is cosmetic.
