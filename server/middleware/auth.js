const jwt = require("jsonwebtoken");

const secret = "auth";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, secret, (error, user) => {
      if (error) throw new Error();
      next();
    });
  } catch (error) {
    res.status(401).send({ message: "Please Authenticate" });
  }
};

module.exports = auth;
