const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const { USER_ROLES } = require("../../../common/constants");
const bankController = require("../bank/bank.controller");


router.post("/addBankBalance",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), bankController.addBankBalance);
router.post("/updateBankBalance/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), bankController.updateBankBalance);
router.get("/findById/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), bankController.findById);
router.get("/list", auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), bankController.list);

module.exports = router;