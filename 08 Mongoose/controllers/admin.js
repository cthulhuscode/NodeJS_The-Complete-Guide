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

    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId: req.user, //mongoose automatically will take the _id, is not needed to specify
    });
    product
        .save()
        .then((result) => {
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    //Getting query params
    const editMode = req.query.edit;
    if (!editMode) return res.redirect("/");

    //get product info
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then((product) => {
            //if no exists
            if (!product) return res.redirect("/");

            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
            });
        })
        .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const body = req.body;

    Product.findById(prodId)
        .then((product) => {
            product.title = body.title;
            product.price = body.price;
            product.description = body.description;
            product.imageUrl = body.imageUrl;

            //the product will be updated, not create a new one
            return product.save();
        })
        .then((result) => {
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
    //Product.find().select('name price -_id') only select the name and price, but exclude _id
    //Product.find().populate('userId', 'name') only select the name of the user

    Product.find()
        .populate("userId") //populate() retrieve the whole data/object related to the id that is referenced in the model
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        })
        .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findByIdAndRemove(prodId)
        .then((result) => {
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};