const express = require("express");
const router = express.Router();
const userRoutes = require("./user");

/**
 * User routes
 */
router.use("/user", userRoutes);

module.exports = router;
