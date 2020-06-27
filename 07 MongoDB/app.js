const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

//dotenv config
dotenv.config({ path: "./config/config.env" });

//Controlllers
const errorController = require("./controllers/error");

//Models
const User = require("./models/user");

//Mongo DB
const mongoConnect = require("./config/db").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

//Route files
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("5ef5195aefcd88ec38f20948")
        .then((user) => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        }) //Save the user in the req, includes the methods and all the things that comes with the sequelize object
        .catch((err) => console.log(err));
});

// //Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});
