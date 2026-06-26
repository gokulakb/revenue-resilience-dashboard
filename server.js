const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { initializeDatabase } = require('./createDatabase');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Revenue Resilience Dashboard API is running',
    endpoints: {
      payments: ['/api/payments', '/api/payments/retry/:id'],
      analytics: ['/api/analytics/arpu', '/api/analytics/cohort', '/api/analytics/failures', '/api/analytics/reconciliation']
    }
  });
});

app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

module.exports = app;
