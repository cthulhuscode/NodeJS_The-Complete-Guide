const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//dotenv config
dotenv.config({ path: "./config/config.env" });

//Controlllers
const errorController = require("./controllers/error");

//Models
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

//Route files
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("5ef64336685243278c8c8c16")
        .then((user) => {
            req.user = user;
            next();
        }) //Save the user in the req, includes the methods and all the things that comes with the mongoose object
        .catch((err) => console.log(err));
});

// //Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

const connectionString =
    "mongodb+srv://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PASS +
    "@courses-sbaks.mongodb.net/shop?retryWrites=true&w=majority";

mongoose
    .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        User.findOne().then((user) => {
            if (!user) {
                const user = new User({
                    name: "Enri",
                    email: "enridev@gmail.com",
                    cart: {
                        items: [],
                    },
                });
                user.save();
            }
        });

        app.listen(3000);
    })
    .catch((err) => console.log(err));
