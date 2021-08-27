const express = require("express");
const router = express.Router();
const auth = require('../../../middleware/auth')
const { USER_ROLES } = require("../../../common/constants");
const userController = require("../user/user.controller");
const checkObjectId = require('../../../middleware/checkObjectId');

router.post("/login", [],
    userController.login
);
router.post("/create", [],
    userController.create
);
router.post("/update/:id", auth(USER_ROLES.ADMIN), checkObjectId("id"), [],
    userController.update
);
router.get("/list", auth(USER_ROLES.ADMIN), userController.list);
router.get("/me", auth(USER_ROLES.ADMIN), userController.me);
router.post("/me", auth(USER_ROLES.ADMIN), [], userController.updateMe);
router.get("/roles", userController.roles);
router.get("/view/:id", auth(USER_ROLES.ADMIN), checkObjectId("id"), userController.findById);
router.delete("/delete/:id", auth(USER_ROLES.ADMIN), checkObjectId("id"), userController.delete);

module.exports = router;