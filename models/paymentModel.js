const { run, get, all } = require('../database');
const { v4: uuidv4 } = require('uuid');

async function createPayment(payload = {}) {

  const userId = payload.userId || payload.user_id;
  const amount = payload.amount;
  const currency = payload.currency || 'USD';
  const idempotencyKey = payload.idempotencyKey;

  if (!userId || !amount) {
    const error = new Error('userId and amount are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await get(
    'SELECT id, name FROM users WHERE id = ?',
    [userId]
  );

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const effectiveKey = idempotencyKey || uuidv4();

  const duplicate = await get(
    'SELECT * FROM payments WHERE idempotency_key = ?',
    [effectiveKey]
  );

  if (duplicate) {
    return duplicate;
  }

  const success = Math.random() < 0.7;

  const status = success ? 'succeeded' : 'failed';

  const gatewayResponse = success
    ? 'approved'
    : 'simulated_gateway_failure';

  const result = await run(
    `INSERT INTO payments
    (
      user_id,
      amount,
      currency,
      status,
      gateway_response,
      idempotency_key,
      retry_count
    )
    VALUES
    (?,?,?,?,?,?,0)`,
    [
      userId,
      amount,
      currency,
      status,
      gatewayResponse,
      effectiveKey
    ]
  );

  return await get(
    `SELECT
      p.*,
      u.name AS user_name
    FROM payments p
    JOIN users u
      ON p.user_id=u.id
    WHERE p.id=?`,
    [result.lastID]
  );

}

async function listPayments(limit = 20, offset = 0) {

  return await all(
    `SELECT
      p.*,
      u.name AS user_name
    FROM payments p
    JOIN users u
      ON p.user_id=u.id
    ORDER BY p.created_at DESC
    LIMIT ?
    OFFSET ?`,
    [limit, offset]
  );

}

async function getPaymentById(id) {

  return await get(
    `SELECT
      p.*,
      u.name AS user_name
    FROM payments p
    JOIN users u
      ON p.user_id=u.id
    WHERE p.id=?`,
    [id]
  );

}

async function retryPayment(id) {

  const payment = await getPaymentById(id);

  if (!payment) {
    const error = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }

  if (payment.status === 'succeeded') {
    return {
      payment,
      message: 'Payment already succeeded'
    };
  }

  const success = Math.random() < 0.7;

  const status = success
    ? 'succeeded'
    : 'failed';

  const gateway =
    success
      ? 'approved_on_retry'
      : 'retry_failed';

  await run(
    `UPDATE payments
    SET
      status=?,
      gateway_response=?,
      retry_count=retry_count+1,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=?`,
    [
      status,
      gateway,
      id
    ]
  );

  return {
    payment: await getPaymentById(id),
    message:
      success
        ? 'Retry Successful'
        : 'Retry Failed'
  };

}

module.exports = {
  createPayment,
  listPayments,
  getPaymentById,
  retryPayment
};