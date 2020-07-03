const path = require("path");
const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
//Route protection
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
//isAuth is middleware that protects the route, might be as many parameters in the get() function as you want
//the parameters middleware will be executed from left to right
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title", "Please add a title with only letters and numbers")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Please add a valid price").isFloat(),
    body("description", "Please a valid description")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title", "Please add a title with only letters and numbers")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Please add a valid price").isFloat(),
    body("description", "Please a valid description")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
