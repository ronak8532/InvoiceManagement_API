const { body, query } = require('express-validator')
const constatnts = require("../common/constants");
const { USER_STATUS_LIST, USER_ROLES, ORDER_STATUS_LIST, COUPON_RATE_TYPE, WALLET_CONFIG_TYPE } = constatnts;

exports.validate = (method) => {
    switch (method) {
        case 'userLogin':
            {
                return [
                    body('email', 'Invalid email').isEmail(),
                    body('password', "Password should have min 6 and max 15 charactors.").exists().isLength({ min: 6, max: 15 }),
                ]
            }
        case 'userCreate':
            {
                return [
                    body('email', 'Invalid email').isEmail(),
                    body('password', "Password should have min 6 and max 15 charactors.").exists().isLength({ min: 6, max: 15 }),
                    body('name', 'Name cannot be empty.').exists(),
                    body('phone', 'Phone must have 10 digits.').isLength({ min: 10, max: 10 }),
                    body('status', 'Status cannot be empty.').exists(),
                    body('status', 'Status invalid.').isIn(USER_STATUS_LIST)
                ]
            }
    }
}