const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "products.json"
);

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            //If ID exists then EDIT the product
            if (this.id) {
                //Get index of the existing product
                const existingProductIndex = products.findIndex(
                    (prod) => prod.id === this.id
                );
                console.log(existingProductIndex);
                const updatedProducts = [...products];
                //Replace with updated product
                updatedProducts[existingProductIndex] = this;
                //Write changes
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {
                //SAVE new product
                //Create an ID
                this.id = Math.random().toString();
                products.push(this);
                //Make changes
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const product = products.find((prod) => prod.id === id);
            const updatedProducts = products.filter((p) => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    //Delete from the cart
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find((p) => p.id === id);
            cb(product);
        });
    }
};
