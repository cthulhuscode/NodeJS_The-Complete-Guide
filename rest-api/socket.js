/*This function allows to share the same io connection through the app */

let io;

module.exports = {
  init: (httpServer) => {
    //A node.js function
    io = require("socket.io")(httpServer);
    return io;
  },
  getIO: () => {
    //Get the existing io object
    if (!io) throw new Error("Socket.io not initialized");

    return io;
  },
};
