const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {

const data = req.body.userdata;
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

    console.log(token,"token");

  if (!token) {
    return res.send("A token is required for authentication",403);
  }
  try {
    console.log("try")
    const decoded = jwt.verify(token, "chota"); //variable de entorno chupija la pame
    req.user = decoded
    req.data = data
    console.log (decoded.token,"decoded");
  } catch (err) {
    return res.send("Invalid Token",401);
    
  }
  
 
  return next();
};

module.exports = verifyToken;
