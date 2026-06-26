const { get, all } = require("../database");

// ARPU
async function getARPU() {

    const result = await get(`
        SELECT
            COUNT(DISTINCT user_id) AS payingUsers,
            SUM(amount) AS totalRevenue
        FROM payments
        WHERE status='succeeded'
    `);

    const payingUsers = result.payingUsers || 0;
    const totalRevenue = result.totalRevenue || 0;

    return {
        totalRevenue,
        payingUsers,
        arpu:
            payingUsers === 0
                ? 0
                : Number((totalRevenue / payingUsers).toFixed(2))
    };

}

// Cohort Revenue
async function getCohortRevenue() {

    return await all(`
        SELECT
            cohort_name,
            user_count,
            payment_count,
            total_revenue
        FROM cohorts
        ORDER BY id
    `);

}

// Failure Report
async function getFailureReport() {

    const report = await get(`
        SELECT

        COUNT(*) AS totalPayments,

        SUM(
            CASE
                WHEN status='succeeded'
                THEN 1
                ELSE 0
            END
        ) AS successfulPayments,

        SUM(
            CASE
                WHEN status='failed'
                THEN 1
                ELSE 0
            END
        ) AS failedPayments

        FROM payments
    `);

    const total = report.totalPayments || 0;
    const failed = report.failedPayments || 0;

    return {

        totalPayments: total,

        successfulPayments:
            report.successfulPayments || 0,

        failedPayments: failed,

        failureRate:
            total === 0
                ? "0%"
                : ((failed / total) * 100).toFixed(2) + "%"

    };

}

// Reconciliation
async function getReconciliation() {

    const result = await get(`
        SELECT

        SUM(
            CASE
                WHEN status='succeeded'
                THEN amount
                ELSE 0
            END
        ) AS collected,

        SUM(
            CASE
                WHEN status='failed'
                THEN amount
                ELSE 0
            END
        ) AS failedRevenue,

        SUM(
            CASE
                WHEN status='succeeded'
                THEN 1
                ELSE 0
            END
        ) AS successCount,

        SUM(
            CASE
                WHEN status='failed'
                THEN 1
                ELSE 0
            END
        ) AS failedCount

        FROM payments
    `);

    return {

        recordedRevenue:
            result.collected || 0,

        successfulPayments:
            result.successCount || 0,

        failedPayments:
            result.failedCount || 0,

        failedRevenue:
            result.failedRevenue || 0,

        difference: 0

    };

}

module.exports = {

    getARPU,

    getCohortRevenue,

    getFailureReport,

    getReconciliation

};