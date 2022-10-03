const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../../models/user");
const config = require("../../../config/var");
const constatnts = require("../../../common/constants");
const crypto = require("crypto");
const { USER_ROLES, SALT_ROUNDS } = constatnts;
const {
    app: { jwt_key, app_url },
} = config;
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.register = async(req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;
        const user_exists = await User.findOne({
            $or: [
                { email: body.email }
            ]
        });
        
        if (user_exists) {
            return res.status(200).json({
                success: false,
                error_message: "User already exists"
            });
        }
        const password_hash = bcrypt.hashSync(body.password, SALT_ROUNDS);
        let user = new User();
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.email = body.email;
        user.phoneNumber = body.phoneNumber;
        user.address = body.address;
        user.password_hash = password_hash;
        user.role = body.role;
        user.city = body.city;
        user.gstin = body.gstin;
        user.state = body.state;
        user.zipcode = body.zipcode;
        user.created_at = new Date();
        user.updated_at = new Date();
        user = await user.save();

        return res.status(200).json({
            success: true,
            user_id: user._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            email: email
        });

        if (!user) {
            return res.status(200).json({
                success: false,
                error_message: "User not found",
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password_hash);
        if (!validPassword) {
            return res.status(200).json({
                success: false,
                error_message: "Incorrect password",
            });
        }

        const token = jwt.sign({ email: user.email, user_id: user._id, firstName: user.firstName, 
            lastName: user.lastName, phone: user.phone, role: user.role },
            'invoice-management',
        );
        return res.status(200).json({
            success: true,
            token: token,
        });
    } catch (err) {
        next(err);
    }
};

exports.update = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ errors: errors.array({ onlyFirstError: true }) });
        }

        const body = req.body;
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(200).json({
                success: false,
                error_message: "User not found"
            });
        }
        
        const password_hash = body.password ? bcrypt.hashSync(body.password, SALT_ROUNDS) : user.password_hash;
        const updated_data = {
            _id: req.params.id,
            firstName : body.firstName,
            lastName : body.lastName,
            email : body.email,
            phone : body.phone,
            address: body.address,
            role: body.role,
            password_hash: password_hash,
            gstin: body.gstin,
            status: body.status,
            city: body.city,
            state: body.state,
            zipcode: body.zipcode,
            updated_at: new Date(),
        }

        const updated_user = await User.updateOne({ _id: req.params.id },
            updated_data
        );

        return res.status(200).json({
            success: true,
            user_id: updated_data._id,
        });
    } catch (err) {
        next(err);
    }
};

exports.delete = async(req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(200).json({
                success: false,
                error_message: "User not found"
            });
        }

        User.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.n > 0) {
                    return res.status(200).json({
                        success: true,
                        success_message: "User deleted successfully!",
                    });
                } else {
                    res.status(200).json({ success: false, error_message: "Not authorized!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Deleting user failed!",
                });
            });
    } catch (err) {
        next(err);
    }
};

exports.findById = async(req, res, next) => {
    try {
        User.findById(req.params.id)
            .then((user) => {
                if (user) {
                    return res.status(200).json({
                        success: true,
                        user: user,
                    });
                } else {
                    return res
                        .status(404)
                        .json({ success: false, error_message: "User not found!" });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    error_message: "Fetching user failed!",
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
        let filter_query = { role: { $in: [USER_ROLES.CUSTOMER] } };
        
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
                    { firstName: { $regex: `${query.query}`, $options:"i" } },
                    { lastName: { $regex: `${query.query}`, $options:"i" } },
                    { email: { $regex: `${query.query}`, $options:"i" } },
                ]
            };
        }
        const users = await User.find({...filter_query, ...search_query })
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        // get total documents in the User collection
        const count = await User.find({...filter_query, ...search_query }).countDocuments();

        // return response with users, total pages, and current page
        return res.status(200).json({
            users,
            total_users: count,
            total_pages: Math.ceil(count / limit),
            current_page: page,
        });
    } catch (err) {
        next(err);
    }
};
