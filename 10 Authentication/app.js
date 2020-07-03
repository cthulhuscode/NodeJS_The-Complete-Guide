const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); //pasar la variable session
const flash = require("connect-flash");
const multer = require("multer");

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

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//Filtrar tipo de archivo
const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else cb(null, false);
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
//Get image, use the input name
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));

//Serve the images folder
app.use("/images", express.static(path.join(__dirname, "images")));

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

//CSRF
//Locals: Local variables that are passed into the views
//They will ony exists in the views which are rendered
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  //throw new Error("Sync Dummy");

  //Take the user from the session
  if (!req.session.user) return next();

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      //Pass the object with the data and methods to the request
      req.user = user;
      next();
    })
    .catch((err) => {
      //next is used when an asynchronous error is thrown
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//Errors
app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  //res.status(error.httpStatusCode).redirect("/500");
  console.log(req.session);
  res.status(500).render("500", {
    pageTitle: "Error ocurred!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
