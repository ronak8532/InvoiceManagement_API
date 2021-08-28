const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const { USER_ROLES } = require("../../../common/constants");
const userController = require("../user/user.controller");
const checkObjectId = require('../../../middleware/checkObjectId');

router.post("/login",
    userController.login
);
router.post("/create",
    userController.create
);
router.post("/update/:id", checkObjectId("id"), [],
    userController.update
);
router.get("/list", [], userController.list);
router.get("/me", userController.me);
router.post("/me",  [], userController.updateMe);
router.get("/roles", userController.roles);
router.get("/view/:id",  checkObjectId("id"), userController.findById);
router.delete("/delete/:id",  checkObjectId("id"), userController.delete);

module.exports = router;