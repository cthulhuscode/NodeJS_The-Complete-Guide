const fs = require("fs"); //Para el sistema de archivos

exports.requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  //Agregando routing
  if (url === "/") {
    //Configurar los headers, metadatos. Indica, parte del contenido será HTML
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>My first webpage with pure NodeJS</title><head>");
    res.write("<body><h1>Users</h1>");
    res.write(
      "<div><ul><li>Huxley</li><li>Sabato</li><li>Sartre</li></ul></div>"
    );
    res.write('<h2><form action="/create-user" method="POST">Add user</h2>');
    res.write(
      '<input type="text" name="message"><button type="submit">Send</button></form>'
    );
    res.write("</body>");
    res.write("</html>");
    //Método para enviar los datos al cliente, dar una respuesta
    return res.end();
  }

  //Agregando routing
  if (url === "/users") {
    //Configurar los headers, metadatos. Indica, parte del contenido será HTML
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>My first webpage with pure NodeJS</title><head>");
    res.write("<body><h1>Users</h1>");
    res.write(
      "<div><ul><li>Huxley</li><li>Sabato</li><li>Sartre</li></ul></div>"
    );
    res.write("</body>");
    res.write("</html>");
    //Método para enviar los datos al cliente, dar una respuesta
    return res.end();
  }

  //Redirecting requests and making a file
  if (url === "/create-user" && method === "POST") {
    const body = []; //guardar los valores de lo recibido del input

    //Obtener el message enviado desde /
    //Escuchar el evento data, chunk: parte de lo que se está enviando, los datos se envían por partes (chunks)
    req.on("data", (chunk) => {
      body.push(chunk); //Guardar cada parte de la request, puede ser ejecutado múltiples veces según el tamaño del dato
    });

    //Al terminar lo anterior ejecutar lo siguiente
    return req.on("end", () => {
      //Convertir los datos de los chunks en algo válido para el usuario
      const parsedBody = Buffer.concat(body).toString();
      const user = parsedBody.split("=")[1];

      console.log(user);
      res.write(`<h1>Hello ${user}</h1>`);

      return res.end();
    });
  }
};
