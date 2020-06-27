const fs = require("fs");
const path = require("path");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "cart.json"
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            //Analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(
                (prod) => prod.id === id
            );
            //Get existing product
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            //Add new product || update one & increase quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;

                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice; //Adding '+' to the variable converts it into a number
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) return;
            const updatedCart = { ...JSON.parse(fileContent) };

            //Get the product to delete
            const product = updatedCart.products.find((prod) => prod.id === id);
            if (!product) return;

            //Delete the product from the cart
            updatedCart.products = updatedCart.products.filter(
                (prod) => prod.id !== id
            );
            updatedCart.totalPrice =
                updatedCart.totalPrice - productPrice * product.qty;

            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) cb(null);
            else cb(cart);
        });
    }
};