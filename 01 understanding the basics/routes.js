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
    res.write("<body><h1>Hello from my NodeJS Server</h1>");
    res.write('<h2><form action="/message" method="POST">Enter a message</h2>');
    res.write(
      '<input type="text" name="message"><button type="submit">Send</button></form>'
    );
    res.write("</body>");
    res.write("</html>");
    //Método para enviar los datos al cliente, dar una respuesta
    return res.end();
  }

  //Redirecting requests and making a file
  if (url === "/message" && method === "POST") {
    const body = []; //guardar los valores de lo recibido del input

    //Obtener el message enviado desde /
    //Escuchar el evento data, chunk: parte de lo que se está enviando, los datos se envían por partes (chunks)
    req.on("data", (chunk) => {
      console.log(chunk); //Retorna algo como: <Buffer 6d 65 73 73 61 67 65 3d 42 75 65 6e 61 73 72 61 7a 61>
      body.push(chunk); //Guardar cada parte de la request, puede ser ejecutado múltiples veces según el tamaño del dato
    });

    //Al terminar lo anterior ejecutar lo siguiente
    return req.on("end", () => {
      //Convertir los datos de los chunks en algo válido para el usuario
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody); //Retorna como: message=Buenasraza
      //Obtener el puro valor
      const message = parsedBody.split("=")[1]; //Buenasraza

      //Crear el archivo
      fs.writeFileSync("message.txt", message);
      //Redirigir al usuario
      res.statusCode = 302; //El código de redirección
      res.setHeader("Location", "/"); //El usuario irá a la ruta /
      return res.end();
    });
  }
  //Configurar los headers, metadatos. Indica, parte del contenido será HTML
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My first webpage with pure NodeJS</title><head>");
  res.write("<body><h1>Hello from my NodeJS Server</h1>");
  res.write("</body>");
  res.write("</html>");
  //Método para enviar los datos al cliente, dar una respuesta
  res.end();
};
