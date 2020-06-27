const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

//dotenv config
dotenv.config({ path: "./config/config.env" });

//DB
//const db = require("./config/db.js");
const sequelize = require("./config/db.js");

//Models
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

//Controlllers
const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

//Route files
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        }) //Save the user in the req, includes the methods and all the things that comes with the sequelize object
        .catch((err) => console.log(err));
});

//Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

//Sequelize model associations
//Database relations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); //Delete everything in the relation
User.hasMany(Product);
User.hasOne(Cart);

Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//Create models and so on
sequelize
    //.sync({ force: true }) //overwrite tables, recommended only for dev mode
    .sync()
    .then((result) => {
        return User.findByPk(1);
    })
    .then((user) => {
        if (!user)
            return User.create({ name: "Enrique", email: "enridev@gmail.com" });

        return user;
    })
    .then((user) => {
        return user.createCart();
    })
    .then((cart) => {
        app.listen(3000);
    })
    .catch((err) => console.log(err));
