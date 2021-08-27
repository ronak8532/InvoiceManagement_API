const mongoose = require('mongoose');
const object_id = mongoose.Types.ObjectId;

module.exports = (id) => {
    return function(req, res, next) {
        if (id == "order_id") {
            if (!object_id.isValid(req.params.order_id)) {
                return res.status(200).json({
                    success: false,
                    error_message: 'Invalid id'
                });
            }
            next()
        } else if (id == "order_item_id") {
            if (!object_id.isValid(req.params.order_item_id)) {
                return res.status(200).json({
                    success: false,
                    error_message: 'Invalid id'
                });
            }
            next()
        } else if (id == "id") {
            if (!object_id.isValid(req.params.id)) {
                return res.status(200).json({
                    success: false,
                    error_message: 'Invalid id'
                });
            }
            next()

        } else if (id == "invoice_id") {
            if (!object_id.isValid(req.params.invoice_id)) {
                return res.status(200).json({
                    success: false,
                    error_message: 'Invalid id'
                });
            }
            next()
        } else if (id == "account_id") {
            if (!object_id.isValid(req.params.account_id)) {
                return res.status(200).json({
                    success: false,
                    error_message: 'Invalid id'
                });
            }
            next()
        } else if (id == "user_id") {
            if (!object_id.isValid(req.params.user_id)) {
                return res.status(200).json({
                    success: false,
                    error_message: 'Invalid id'
                });
            }
            next()
        }

    }
}