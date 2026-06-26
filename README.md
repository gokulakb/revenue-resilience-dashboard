# Revenue Resilience Dashboard

A backend REST API built with **Node.js**, **Express.js**, and **SQLite** to simulate payment processing, deterministic failure handling, and revenue analytics. The project demonstrates reliable payment workflows with idempotency, retry mechanisms, reconciliation reporting, and live analytics such as ARPU and cohort revenue.

## 🚀 Live Demo

**Live API:** https://revenue-resilience-dashboard.onrender.com

---

## 📌 Features

* Payment processing with simulated success and failure scenarios
* Deterministic payment failure handling
* Idempotency support to prevent duplicate payments
* Retry mechanism for failed payments
* SQLite database with automatic initialization and seed data
* ARPU (Average Revenue Per User) analytics
* Cohort revenue reporting
* Payment failure analytics
* Revenue reconciliation report
* RESTful API architecture
* Centralized error handling
* Request logging
* Render-ready deployment

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* SQLite3
* UUID
* CORS
* Morgan

---

## 📂 Project Structure

```text
revenue-resilience-dashboard
│
├── controllers
│   ├── analyticsController.js
│   └── paymentController.js
│
├── database
│   └── revenue-resilience-dashboard.db
│
├── middleware
│   ├── errorHandler.js
│   └── idempotency.js
│
├── models
│   ├── analyticsModel.js
│   ├── paymentModel.js
│   └── userModel.js
│
├── routes
│   ├── analyticsRoutes.js
│   └── paymentRoutes.js
│
├── utils
│   └── logger.js
│
├── createDatabase.js
├── database.js
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/gokulakb/revenue-resilience-dashboard.git
```

Move into the project directory:

```bash
cd revenue-resilience-dashboard
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The application will run on:

```text
http://localhost:10000
```

---

## 📡 API Endpoints

### Home

| Method | Endpoint |
| ------ | -------- |
| GET    | `/`      |

---

### Payments

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| POST   | `/api/payments`           | Create a new payment     |
| GET    | `/api/payments`           | Retrieve all payments    |
| GET    | `/api/payments/:id`       | Retrieve a payment by ID |
| POST   | `/api/payments/retry/:id` | Retry a failed payment   |

---

### Analytics

| Method | Endpoint                        | Description                        |
| ------ | ------------------------------- | ---------------------------------- |
| GET    | `/api/analytics/arpu`           | Calculate Average Revenue Per User |
| GET    | `/api/analytics/cohort`         | Display cohort revenue             |
| GET    | `/api/analytics/failures`       | Payment failure analytics          |
| GET    | `/api/analytics/reconciliation` | Revenue reconciliation report      |

---

## 📥 Sample Request

### Create Payment

```http
POST /api/payments
```

```json
{
  "userId": 1,
  "amount": 500,
  "currency": "USD",
  "idempotencyKey": "payment-001"
}
```

---

## 📤 Sample Response

```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "id": 151,
    "user_id": 1,
    "amount": 500,
    "currency": "USD",
    "status": "succeeded",
    "gateway_response": "approved"
  }
}
```

---

## 📊 Analytics Included

* Average Revenue Per User (ARPU)
* Cohort Revenue
* Payment Success Rate
* Payment Failure Rate
* Revenue Reconciliation
* Retry Tracking

---

## 🧪 Testing

The APIs were tested using **Postman** for:

* Payment creation
* Duplicate payment prevention (idempotency)
* Retrying failed payments
* Payment listing
* ARPU calculation
* Cohort revenue reporting
* Failure analytics
* Revenue reconciliation

---

## 🚀 Deployment

The application is deployed on **Render**.

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

---

## 📖 Future Improvements

* JWT Authentication
* PostgreSQL integration
* Real payment gateway integration (Stripe/Razorpay)
* Swagger/OpenAPI documentation
* Docker support
* CI/CD pipeline
* Role-based access control
* Dashboard frontend

---

