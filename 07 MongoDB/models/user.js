const mongodb = require("mongodb");
const getDb = require("../config/db").getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection("users").insertOne(this);
    }

    getCart() {
        const db = getDb();
        //Get products Ids
        const producIds = this.cart.items.map((i) => {
            return i.productId; //pass only the Ids
        });
        return db
            .collection("products")
            .find({ _id: { $in: producIds } })
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return {
                        ...p,
                        quantity: this.cart.items.find((i) => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity, //extract the quantity
                    };
                });
            });
    }

    addToCart(product) {
        //Check if the product already exists
        const cartProductIndex = this.cart.items.findIndex((cp) => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        //Pass the existing products
        const updatedCartItems = [...this.cart.items];

        //If product already exists
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            //if the product does not exist. Add a new one
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity,
            });
        }

        //If cart is empty
        const updatedCart = {
            items: updatedCartItems,
        };
        const db = getDb();
        return db
            .collection("users")
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter((item) => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection("users")
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            );
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then((products) => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name,
                    },
                };
                return db.collection("orders").insertOne(order);
            })
            .then((result) => {
                return db
                    .collection("users")
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    );
            });
    }

    getOrders() {
        const db = getDb();
        return db
            .collection("orders")
            .find({ "user._id": new ObjectId(this._id) })
            .toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection("users")
            .findOne({ _id: new ObjectId(userId) })
            .then((user) => {
                return user;
            })
            .catch((err) => console.log(err));
    }
}

module.exports = User;
