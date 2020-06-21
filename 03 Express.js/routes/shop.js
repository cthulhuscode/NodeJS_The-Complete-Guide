const path = require("path");
const rootDir = require("../utils/path");
const express = require("express");
const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res, next) => {
  //console.log("middleware 2");
  //res.json({ Greeting: "Hello" });
  //res.status(200).send("Buenas");
  //res.send("<h1>Welcome to express.js</h1>");
  //res.sendFile(path.join(rootDir, "views", "shop.html")); // shop.html
  const products = adminData.products;

  res.render("shop", {
    prods: products,
    pageTitle: "EnriShop",
    path: "/",
    hasProducts: products.length > 0, //bool value
    activeShop: true,
    productCSS: true,
  }); //using shop.pug
});

router.get("/shop", (req, res, next) => {
  //console.log("middleware 2");
  //res.json({ Greeting: "Hello" });
  //res.status(200).send("Buenas");
  res.send("<h1>Welcome to the shop</h1>");
});

module.exports = router;
