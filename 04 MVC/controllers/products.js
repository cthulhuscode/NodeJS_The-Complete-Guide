const Product = require("../models/Product");

exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {
        pageTitle: "Add product",
        path: "/admin/add-product",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    //Redirigir al root
    res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop", {
            prods: products,
            pageTitle: "EnriShop",
            path: "/",
            hasProducts: products.length > 0, //bool value
            activeShop: true,
            productCSS: true,
        });
    });
};
