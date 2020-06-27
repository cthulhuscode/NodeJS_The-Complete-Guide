const mongoosse = require("mongoose");
const Schema = mongoosse.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User", //Must be exactly the same name of the model (User), it will make a relation with User
        required: true,
    },
});

//Product is used as a collection name, convert it into lower case and in plural
module.exports = mongoosse.model("Product", productSchema);

// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         let dbOp;

//         if (this._id) {
//             //Update the product
//             dbOp = db
//                 .collection("products")
//                 .updateOne({ _id: this._id }, { $set: this });
//         } else {
//             //Create a new document
//             dbOp = db.collection("products").insertOne(this);
//         }
//         return dbOp
//             .then((result) => console.log(result))
//             .catch((err) => console.log(err));
//     }

//     static fetchAll() {
//         //returns a cursor
//         const db = getDb();
//         return db
//             .collection("products")
//             .find()
//             .toArray()
//             .then((products) => {
//                 return products;
//             })
//             .catch((err) => console.log(err));
//     }

//     static findById(prodId) {
//         const db = getDb();
//         return db
//             .collection("products")
//             .find({ _id: mongodb.ObjectId(prodId) }) //_id can't be compare with a string but ObjectId
//             .next()
//             .then((product) => {
//                 console.log(product);
//                 return product;
//             })
//             .catch((err) => console.log(err));
//     }

//     static deletebyId(prodId) {
//         const db = getDb();
//         return db
//             .collection("products")
//             .deleteOne({
//                 _id: new mongodb.ObjectId(prodId),
//             })
//             .then((result) => console.log("Deleted"))
//             .catch((err) => console.log(err));
//     }
// }

// module.exports = Product;
