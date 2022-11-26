const Bank = require("../../../models/bank");
const config = require("../../../config/var");
const constatnts = require("../../../common/constants");
const { USER_ROLES, SALT_ROUNDS } = constatnts;
const {
    app: { jwt_key, app_url },
} = config;
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.addBankBalance = async(req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;
        
        
        let bank = new Bank();
        bank.bankBalance = body.bankBalance;
        bank.dueBalance = body.dueBalance;
        bank.totalBalance = body.totalBalance;
        bank.created_at = new Date();
        bank.updated_at = new Date();
        bank = await bank.save();

        return res.status(200).json({
            success: true,
            bank_id: bank._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateBankBalance = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;
        const bank = await Bank.findOne({ _id: req.params.id });
        if (!bank) {
            return res.status(200).json({
                success: false,
                error_message: "Bank Balance not found"
            });
        }
        
        const updated_data = {
            _id: req.params.id,
            bankBalance: body.bankBalance,
            dueBalance: body.dueBalance,
            totalBalance: body.totalBalance,
            updated_at: new Date(),
        }

        const updated_bank = await Bank.updateOne({ _id: req.params.id },
            updated_data
        );

        return res.status(200).json({
            success: true,
            bank_id: updated_bank._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.findById = async(req, res, next) => {
    try {
        Bank.findById(req.params.id)
            .then((bank) => {
                if (bank) {
                    return res.status(200).json({
                        success: true,
                        bank: bank,
                    });
                } else {
                    return res
                        .status(404)
                        .json({ success: false, error_message: "Bank Balance not found!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Fetching Bank Balance failed!",
                });
            });
    } catch (err) {
        next(err);
    }
};

exports.list = async(req, res, next) => {
    try {
        
        const bank = await Bank.find();

        // return response with users, total pages, and current page
        return res.status(200).json({
            bank
        });
    } catch (err) {
        next(err);
    }
};
