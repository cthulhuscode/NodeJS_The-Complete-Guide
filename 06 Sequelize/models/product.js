// -- Sequelize --
const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("product", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Product;

/*
// -- MySQL --
const db = require("../config/db");
const Cart = require("./cart");

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute(
            "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
            [this.title, this.price, this.imageUrl, this.description]
        ); //Question marks to avoid SQL Injection
    }

    static deleteById(id) {}

    static fetchAll() {
        return db.execute("SELECT * FROM products");
    }

    static findById(id) {
        return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
    }
};
*/
