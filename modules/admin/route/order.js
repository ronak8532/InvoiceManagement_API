const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const { USER_ROLES } = require("../../../common/constants");
const orderController = require("../order/order.controller");


router.post("/placeOrder",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), orderController.placeOrder);
router.post("/updateOrder/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), orderController.updateOrder);
router.delete("/deleteOrder/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), orderController.deleteOrder);
router.get("/findById/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), orderController.findById);
router.get("/list",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), orderController.list);
router.get("/getLastOrder",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), orderController.getLastOrder);

module.exports = router;