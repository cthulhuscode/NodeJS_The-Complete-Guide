const path = require("path");

//Indica la ruta desde la cual la aplicación se ejecuta
module.exports = path.dirname(process.mainModule.filename);
