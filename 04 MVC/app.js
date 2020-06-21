// -- Making a Node Js app with Express--
//Importing libraries
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// -- Routes imports --
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// -- Controllers imports --
const errorController = require("./controllers/error");

// -- ENGINE --
// -- ejs --
app.set("view engine", "ejs");
app.set("views", "views"); //Give it the directory of views

//Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
//Dar acceso a public/
//Con eso express da acceso a las requests de usar public/ y sirve lo que se requiera dentro de public/
//Pueden haber más folders registrados, express obtendrá el primero en hacer match
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use(shopRoutes);
//Filter route
app.use("/admin", adminRoutes);

app.use(errorController.get404);

app.listen(3000);
