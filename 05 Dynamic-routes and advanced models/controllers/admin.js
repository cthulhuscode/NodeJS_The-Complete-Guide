const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price); //null as ID
    product.save();
    res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
    //Getting query params
    const editMode = req.query.edit;
    if (!editMode) return res.redirect("/");

    //get product info
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        //if no exists
        if (!product) return res.redirect("/");

        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product,
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const body = req.body;
    const updatedProduct = new Product(
        body.productId,
        body.title,
        body.imageUrl,
        body.description,
        body.price
    );
    updatedProduct.save();
    res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products",
            path: "/admin/products",
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect("/admin/products");
};
