const { get } = require('../database');

const idempotencyMiddleware = async (req, res, next) => {
  const key = req.headers['idempotency-key'];

  if (!key) {
    return next();
  }

  try {
    const existingPayment = await get('SELECT id, status FROM payments WHERE idempotency_key = ?', [key]);

    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate payment request detected',
        data: { paymentId: existingPayment.id, status: existingPayment.status }
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = idempotencyMiddleware;
