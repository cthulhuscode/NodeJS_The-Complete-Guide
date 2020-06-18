// -- Making a Node Js app with Express--
//Importing libraries
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//Configuring templating engine pug
app.set("view engine", "pug"); //Set pug engine
app.set("views", "views"); //Give it the directory of views

//Routes imports
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

//Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
//Dar acceso a public/
//Con eso express da acceso a las requests de usar public/ y sirve lo que se requiera dentro de public/
//Pueden haber más folders registrados, express obtendrá el primero en hacer match
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use(shopRoutes);
//Filter route
app.use("/admin", adminData.routes);

app.use("/", (req, res, next) => {
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.render("404", { pageTitle: "404" });
});

/*
app.use("/", (req, res, next) => {
  //console.log("middleware 3");
  //res.json({ Greeting: "Hello" });
  //res.status(200).send("Buenas");
  res.send("<h1>Always home</h1>");
});
*/

/*
const app = http.createapp(app);

//Así se activa el servidor
app.listen(3000);
*/

/*
//TAREA

app.use((req, res, next) => {
  console.log("Middleware 1");
  next();
});

app.use((req, res, next) => {
  console.log("Middleware 2");
  next();
});

app.use("/users", (req, res, next) => {
  res.send("<h1>Users page</h1>");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Home page</h1>");
});
*/

app.listen(3000);
