const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const { USER_ROLES } = require("../../../common/constants");
const productController = require("../product/product.controller");


router.post("/addProduct",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), productController.addProduct);
router.post("/updateProduct/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), productController.updateProduct);
router.delete("/deleteProduct/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), productController.deleteProduct);
router.get("/findById/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), productController.findById);
router.get("/list", auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), productController.list);

module.exports = router;