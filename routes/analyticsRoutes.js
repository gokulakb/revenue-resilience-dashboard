const express = require("express");

const router = express.Router();

const analyticsController =
require("../controllers/analyticsController");

router.get(
    "/arpu",
    analyticsController.getARPU
);

router.get(
    "/cohort",
    analyticsController.getCohortRevenue
);

router.get(
    "/failures",
    analyticsController.getFailureReport
);

router.get(
    "/reconciliation",
    analyticsController.getReconciliation
);

module.exports = router;