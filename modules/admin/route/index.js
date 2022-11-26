const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const productRoutes = require("./product");
const orderRoutes = require("./order");
const bankRoutes = require("./bank");
const expenseRoutes = require("./expense");

router.use("/user", userRoutes);

router.use("/product", productRoutes);

router.use("/order", orderRoutes);

router.use("/bank", bankRoutes);

router.use("/expense", expenseRoutes);

module.exports = router;