const express = require("express");
const router = express.Router();
const adminRoutes = require("../modules/admin/routes/index");

/**
 * User routes
 */
router.use("/admin", adminRoutes);

module.exports = router;
