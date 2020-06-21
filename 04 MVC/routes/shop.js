const path = require("path");
const express = require("express");
const router = express.Router();

//Controller files
const productsController = require("../controllers/products");

router.get("/", productsController.getProducts);

module.exports = router;
