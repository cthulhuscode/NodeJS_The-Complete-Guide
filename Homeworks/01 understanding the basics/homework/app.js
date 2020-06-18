const http = require("http"); //Para el server
const { requestHandler } = require("./routes");

//The function will be executed after any request, and this returns a server
const server = http.createServer(requestHandler);

//Así se activa el servidor
server.listen(3000);
