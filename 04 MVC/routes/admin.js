const path = require("path");
const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");

// @path /admin/add-product
// @method GET
router.get("/add-product", productsController.getAddProduct);

//  @path /admin/add-product
//  @method POST
router.post("/add-product", productsController.postAddProduct);

/*
Las rutas pueden ser iguales siempre y cuando los métodos sean distintos
*/

module.exports = router;
