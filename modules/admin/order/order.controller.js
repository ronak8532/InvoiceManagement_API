const Order = require("../../../models/order");
const config = require("../../../config/var");
const constatnts = require("../../../common/constants");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.placeOrder = async(req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;

        const order_exists = await Order.findOne({
            $or: [
                { invoiceNo: body.invoiceNo }
            ]
        });
        
        if (order_exists) {
            return res.status(200).json({
                success: false,
                error_message: "Invoice already exists."
            });
        }

        
        let order = new Order();
        order.invoiceNo = body.invoiceNo;
        order.products = body.products;
        order.status = body.status;
        order.customerInfo = body.customerInfo;
        order.subtotal = body.subtotal;
        order.courier = body.courier;
        order.cgst = body.cgst;
        order.sgst = body.sgst;
        order.total = body.total;
        order.roundoff = body.roundoff;
        order.grandtotal = body.grandtotal;
        order.created_at = new Date();
        order.updated_at = new Date();
        order = await order.save();

        return res.status(200).json({
            success: true,
            order_id: order._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateOrder = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;
        const order = await Order.findOne({ _id: req.params.id });
        if (!order) {
            return res.status(200).json({
                success: false,
                error_message: "Order not found"
            });
        }

        const updated_data = {
            _id: req.params.id,
            invoiceNo: body.invoiceNo,
            products: body.products,
            status: body.status,
            customerInfo: body.customerInfo,
            subtotal: body.subtotal,
            courier: body.courier,
            cgst: body.cgst,
            sgst: body.sgst,
            total: body.total,
            roundoff: body.roundoff,
            grandtotal: body.grandtotal,
            updated_at: new Date(),
        }

        const updated_order = await Order.updateOne({ _id: req.params.id },
            updated_data
        );

        return res.status(200).json({
            success: true,
            product_id: updated_order._id,
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteOrder = async(req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id });
        if (!order) {
            return res.status(200).json({
                success: false,
                error_message: "Order not found"
            });
        }

        Order.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.n > 0) {
                    return res.status(200).json({
                        success: true,
                        success_message: "Order deleted successfully!",
                    });
                } else {
                    res.status(200).json({ success: false, error_message: "Not authorized!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Deleting order failed!",
                });
            });
    } catch (err) {
        next(err);
    }
};

exports.findById = async(req, res, next) => {
    try {
        Order.findById(req.params.id)
            .then((order) => {
                if (order) {
                    return res.status(200).json({
                        success: true,
                        order: order,
                    });
                } else {
                    return res
                        .status(404)
                        .json({ success: false, error_message: "Order not found!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Fetching order failed!",
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
                    { invoiceNo: { $regex: `${query.query}`, $options:"i" } },
                    { status: { $regex: `${query.query}`, $options:"i" } }
                ]
            };
        }
        const order = await Order.find({...filter_query, ...search_query })
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // get total documents in the User collection
        const count = await Order.find({...filter_query, ...search_query }).countDocuments();

        // return response with users, total pages, and current page
        return res.status(200).json({
            order,
            total_users: count,
            total_pages: Math.ceil(count / limit),
            current_page: page,
        });
    } catch (err) {
        next(err);
    }
};

exports.getLastOrder = async(req, res, next) => {
    try {
        Order.find().limit(1).sort({$natural:-1})
            .then((order) => {
                if (order) {
                    let invoiceNo = order[0].invoiceNo.split('/').pop()
                    return res.status(200).json({
                        success: true,
                        invoiceNo: invoiceNo,
                    });
                } else {
                    return res
                        .status(404)
                        .json({ success: false, error_message: "Order not found!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Fetching order failed!",
                });
            });
    } catch (err) {
        next(err);
    }
}