const Expense = require("../../../models/expense");
const config = require("../../../config/var");
const constatnts = require("../../../common/constants");
const { USER_ROLES, SALT_ROUNDS } = constatnts;
const {
    app: { jwt_key, app_url },
} = config;
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.addExpense = async(req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;
        
        
        let expense = new Expense();
        expense.expenseDescription = body.expenseDescription;
        expense.amount = body.amount;
        expense.status = body.status;
        expense.created_at = new Date();
        expense.updated_at = new Date();
        expense = await expense.save();

        return res.status(200).json({
            success: true,
            expense_id: expense._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateExpense = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;
        const expense = await Expense.findOne({ _id: req.params.id });
        if (!expense) {
            return res.status(200).json({
                success: false,
                error_message: "Expense not found"
            });
        }
        
        const updated_data = {
            _id: req.params.id,
            expenseDescription: body.expenseDescription,
            amount: body.amount,
            status: body.status,
            updated_at: new Date(),
        }

        const updated_expense = await Expense.updateOne({ _id: req.params.id },
            updated_data
        );

        return res.status(200).json({
            success: true,
            expense_id: updated_expense._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteExpense = async(req, res, next) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id });
        if (!expense) {
            return res.status(200).json({
                success: false,
                error_message: "Expense not found"
            });
        }

        Expense.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.n > 0) {
                    return res.status(200).json({
                        success: true,
                        success_message: "Expense deleted successfully!",
                    });
                } else {
                    res.status(200).json({ success: false, error_message: "Not authorized!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Deleting expense failed!",
                });
            });
    } catch (err) {
        next(err);
    }
};

exports.findById = async(req, res, next) => {
    try {
        Expense.findById(req.params.id)
            .then((expense) => {
                if (expense) {
                    return res.status(200).json({
                        success: true,
                        expense: expense,
                    });
                } else {
                    return res
                        .status(404)
                        .json({ success: false, error_message: "Expense not found!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Fetching Expense failed!",
                });
            });
    } catch (err) {
        next(err);
    }
};

exports.list = async(req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const query = req.query;
        const sort_by = query.sort_by;
        const sort_type = query.sort_type;
        let filter_query = {  };
        
        let sort = {};
        if (sort_by && sort_type && (sort_type == "asc" || sort_type == "desc")) {
            let type = null;
            if (sort_type == "asc") type = 1;
            if (sort_type == "desc") type = -1;
            sort[sort_by] = type;
        }
        let search_query = {};
        if (query.query != undefined && query.query != "") {
            search_query = {
                $or: [
                    { createdAt: { $regex: `${query.query}`, $options:"i" } }
                ]
            };
        }
        const expense = await Expense.find({...filter_query, ...search_query })
            .sort({'_id': -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // get total documents in the User collection
        const count = await Expense.find({...filter_query, ...search_query }).countDocuments();

        // return response with users, total pages, and current page
        return res.status(200).json({
            expense,
            total_users: count,
            total_pages: Math.ceil(count / limit),
            current_page: page,
        });
    } catch (err) {
        next(err);
    }
};
