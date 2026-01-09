const jwt = require("jsonwebtoken");
const authenticateUser = (req, res, next) => {
  const headers = req.headers["authorization"];
  if (!headers)
    return res.status(401).send({ message: "you should login to continue" });
  const token = headers.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .send({ message: "authToken not found kindly login again" });
  jwt.verify(token, process.env.MY_TOKEN, (err, payload) => {
    if (err) {
      return res
        .status(404)
        .send({ message: "error found while verifying token" });
    } else {
      req.name = payload.name;
      req.id = payload.id;
      req.email = payload.email;
      next();
    }
  });
};

module.exports = authenticateUser;
