const Product = require("../../../models/product");
const config = require("../../../config/var");
const constatnts = require("../../../common/constants");
const { USER_ROLES, SALT_ROUNDS } = constatnts;
const {
    app: { jwt_key, app_url },
} = config;
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.addProduct = async(req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;
        const product_exists = await Product.findOne({
            $or: [
                { productName: body.productName }
            ]
        });
        
        if (product_exists) {
            return res.status(200).json({
                success: false,
                error_message: "Product already exists"
            });
        }
        
        let product = new Product();
        product.productName = body.productName;
        product.price = body.price;
        product.priceWithoutGST = body.priceWithoutGST;
        product.created_at = new Date();
        product.updated_at = new Date();
        product = await product.save();

        return res.status(200).json({
            success: true,
            product_id: product._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(200).json({
                success: false,
                error_message: "Product not found"
            });
        }
        
        const updated_data = {
            _id: req.params.id,
            productName: body.productName,
            price: body.price,
            priceWithoutGST: body.priceWithoutGST,
            updated_at: new Date(),
        }

        const updated_product = await Product.updateOne({ _id: req.params.id },
            updated_data
        );

        return res.status(200).json({
            success: true,
            product_id: updated_product._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async(req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(200).json({
                success: false,
                error_message: "Product not found"
            });
        }

        Product.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.n > 0) {
                    return res.status(200).json({
                        success: true,
                        success_message: "Product deleted successfully!",
                    });
                } else {
                    res.status(200).json({ success: false, error_message: "Not authorized!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Deleting product failed!",
                });
            });
    } catch (err) {
        next(err);
    }
};

exports.findById = async(req, res, next) => {
    try {
        Product.findById(req.params.id)
            .then((product) => {
                if (product) {
                    return res.status(200).json({
                        success: true,
                        product: product,
                    });
                } else {
                    return res
                        .status(404)
                        .json({ success: false, error_message: "Product not found!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Fetching product failed!",
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
                    { productName: { $regex: `${query.query}`, $options:"i" } },
                    { price: { $regex: `${query.query}`, $options:"i" } },
                    { priceWithoutGST: { $regex: `${query.query}`, $options:"i" } },
                ]
            };
        }
        const product = await Product.find({...filter_query, ...search_query })
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // get total documents in the User collection
        const count = await Product.find({...filter_query, ...search_query }).countDocuments();

        // return response with users, total pages, and current page
        return res.status(200).json({
            product,
            total_users: count,
            total_pages: Math.ceil(count / limit),
            current_page: page,
        });
    } catch (err) {
        next(err);
    }
};
