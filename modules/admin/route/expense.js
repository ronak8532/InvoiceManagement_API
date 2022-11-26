const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const { USER_ROLES } = require("../../../common/constants");
const expenseController = require("../expense/expense.controller");


router.post("/addExpense",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), expenseController.addExpense);
router.post("/updateExpense/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), expenseController.updateExpense);
router.delete("/deleteExpense/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), expenseController.deleteExpense);
router.get("/findById/:id",auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), expenseController.findById);
router.get("/list", auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), expenseController.list);

module.exports = router;