const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Get the header
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  //Get the token
  const token = authHeader.split(" ")[1];
  let decodedToken;

  //Check if the token is valid
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  //If no token
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
