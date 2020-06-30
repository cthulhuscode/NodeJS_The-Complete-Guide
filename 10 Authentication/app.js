const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); //pasar la variable session
const flash = require("connect-flash");
//CSRF attacks protection
const csrf = require("csurf");

//dotenv config
dotenv.config({ path: "./config/config.env" });

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

const MONGODB_URI =
    "mongodb+srv://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PASS +
    "@courses-sbaks.mongodb.net/shop?retryWrites=true&w=majority";

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
});

//Initialize the CSRF protection
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
//Sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET, //the secret for signing the hash, that secretly store an ID
        resave: false, //for not saving the session in every request or response
        saveUninitialized: false, //ensure that no session gets saved for a request
        store: store, //pass the MongoDb 'store' variable for saving there
        //cookie: {maxAge: '', expires: ''}
    })
);
//After initialize the session add CSRF protection
app.use(csrfProtection);

//connect-flash must be used after making the session
app.use(flash());

app.use((req, res, next) => {
    //Take the user from the session
    if (!req.session.user) return next();
    User.findById(req.session.user._id)
        .then((user) => {
            //Pass the object with the data and methods to the request
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

//Locals: Local variables that are passed into the views
//They will ony exists in the views which are rendered
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        app.listen(3000);
    })
    .catch((err) => console.log(err));
