// const express = require("express");
// const router = express.Router();
// const userController = require("../modules/user.controller");
// //const checkObjectId = require('../middleware/handleErrors');

// router.post("/login",
//     userController.login
// );
// router.post("/create",
//     userController.create
// );
// // router.post("/update/:id", checkObjectId("id"), [],
// //     userController.update
// // );
// router.get("/list", [], userController.list);
// router.get("/me", userController.me);
// router.post("/me",  [], userController.updateMe);

// module.exports = router;

module.exports = app => {
    const userController = require("../modules/user.controller");
  
    var router = require("express").Router();
  
    router.post("/login",userController.login);

    router.post("/create", userController.create);
    
    router.get("/list", userController.list);
  
    app.use("/api", router);
};