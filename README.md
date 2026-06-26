# Revenue Resilience Dashboard

A complete Node.js + Express + SQLite API for simulating payment gateway failures, handling idempotent payments, retrying failed payments, and exposing analytics for ARPU, cohorts, failures, and reconciliation.

## Features

- Payment processing with simulated 70% success / 30% failure behavior
- Idempotency middleware using an `Idempotency-Key` header
- Retry endpoint for failed payments
- SQLite-backed persistence with seeded users, payments, and cohorts
- MVC structure with controllers, models, routes, middleware, and utilities
- CORS enabled and Morgan logging included
- Render-ready Node.js service configuration

## Project Structure

- controllers/
- routes/
- middleware/
- models/
- utils/
- database/
- server.js
- database.js
- createDatabase.js
- package.json

## Installation

```bash
npm install
node createDatabase.js
npm start
```

## API Endpoints

### Payments

- POST /api/payments
- GET /api/payments
- POST /api/payments/retry/:id

### Analytics

- GET /api/analytics/arpu
- GET /api/analytics/cohort
- GET /api/analytics/failures
- GET /api/analytics/reconciliation

## Sample Request

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: payment-001" \
  -d '{"user_id": 1, "amount": 125.5}'
```

## Render Deployment

1. Create a new Web Service on Render.
2. Connect this repository.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Deploy.

## Notes

The SQLite database file is created under the database directory on first run.
