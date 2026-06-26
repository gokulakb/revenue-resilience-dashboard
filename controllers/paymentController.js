const paymentModel = require('../models/paymentModel');

const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentModel.createPayment(req.body);

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: payment
    });

  } catch (error) {
    next(error);
  }
};

const listPayments = async (req, res, next) => {
  try {

    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const payments = await paymentModel.listPayments(limit, offset);

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });

  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {

    const payment = await paymentModel.getPaymentById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });

  } catch (error) {
    next(error);
  }
};

const retryPayment = async (req, res, next) => {
  try {

    const result = await paymentModel.retryPayment(req.params.id);

    res.json({
      success: true,
      message: result.message,
      data: result.payment
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  listPayments,
  getPaymentById,
  retryPayment
};