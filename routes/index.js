const express = require("express");
const router = express.Router();
const userController = require("../modules/user.controller");
//const checkObjectId = require('../middleware/handleErrors');

router.post("/login",
    userController.login
);
router.post("/create",
    userController.create
);
// router.post("/update/:id", checkObjectId("id"), [],
//     userController.update
// );
router.get("/list", [], userController.list);
router.get("/me", userController.me);
router.post("/me",  [], userController.updateMe);
router.get("/roles", userController.roles);

module.exports = router;