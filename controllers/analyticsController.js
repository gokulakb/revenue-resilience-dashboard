const analyticsModel = require("../models/analyticsModel");

exports.getARPU = async (req, res, next) => {

    try {

        const data = await analyticsModel.getARPU();

        res.json({
            success: true,
            data
        });

    } catch (err) {

        next(err);

    }

};

exports.getCohortRevenue = async (req, res, next) => {

    try {

        const data =
            await analyticsModel.getCohortRevenue();

        res.json({
            success: true,
            data
        });

    } catch (err) {

        next(err);

    }

};

exports.getFailureReport = async (req, res, next) => {

    try {

        const data =
            await analyticsModel.getFailureReport();

        res.json({
            success: true,
            data
        });

    } catch (err) {

        next(err);

    }

};

exports.getReconciliation = async (req, res, next) => {

    try {

        const data =
            await analyticsModel.getReconciliation();

        res.json({
            success: true,
            data
        });

    } catch (err) {

        next(err);

    }

};