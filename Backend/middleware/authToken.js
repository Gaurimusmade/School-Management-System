const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authToken = async (req, res, next) => {
  const auth_header = req.headers.authorization;
  let token = auth_header && auth_header.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ msg: "User not logged in" });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ msg: "Forbidden : User not logged in" });
    req.user = { ...user };
    next();
  });
};

module.exports = authToken;
