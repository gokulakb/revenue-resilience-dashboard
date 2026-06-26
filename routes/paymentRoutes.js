const express = require('express');
const router = express.Router();

const {
  createPayment,
  listPayments,
  getPaymentById,
  retryPayment
} = require('../controllers/paymentController');

router.post('/', createPayment);

router.get('/', listPayments);

router.get('/:id', getPaymentById);

router.post('/retry/:id', retryPayment);

module.exports = router;