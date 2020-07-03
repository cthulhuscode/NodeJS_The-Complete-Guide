const fs = require("fs");

exports.deleteFile = (filePath) => {
  //unlink deletes the file attached to the path
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};
