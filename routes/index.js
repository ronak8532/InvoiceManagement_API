const express = require("express");
const router = express.Router();

const adminRoutes = require("../modules/admin/route/index");

router.use("/admin", adminRoutes);

module.exports = router;