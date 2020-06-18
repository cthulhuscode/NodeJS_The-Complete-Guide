const path = require("path");
const rootDir = require("../utils/path");
const express = require("express");
const router = express.Router();

const products = [];

// @path /admin/add-product
// @method GET
router.get("/add-product", (req, res, next) => {
  //console.log("middleware 3");
  //res.json({ Greeting: "Hello" });
  //res.status(200).send("Buenas");
  //res.send("<h1>Add a product</h1><form action='/admin/add-product' method='POST'><input type='text' name='product'><button type='submit'>Send</button></form>");
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
  });
});

//  @path /admin/add-product
//  @method POST
router.post("/add-product", (req, res, next) => {
  products.push({ product: req.body.product });
  //Redirigir al root
  res.redirect("/");
});

/*
Las rutas pueden ser iguales siempre y cuando los métodos sean distintos
*/

exports.routes = router;
exports.products = products;
