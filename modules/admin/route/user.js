const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const { USER_ROLES } = require("../../../common/constants");
const userController = require("../user/user.controller");


router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/update/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), userController.update);
router.delete("/delete/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), userController.delete);
router.get("/findById/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), userController.findById);
router.get("/list", auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), userController.list);

module.exports = router;