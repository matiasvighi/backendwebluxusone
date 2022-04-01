const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {


  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.send("A token is required for authentication",403);
  }
  try {
    const decoded = jwt.verify(token, "chota"); //variable de entorno chupija la pame
    req.user = decoded;
   
  } catch (err) {
    return res.send("Invalid Token",401);
    
  }
  
 
  return next();
};

module.exports = verifyToken;
