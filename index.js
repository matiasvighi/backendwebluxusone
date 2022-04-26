const { request, response } = require('express')

const bcrypt = require('bcryptjs');
const cors = require('cors')
const express = require ('express')
const res = require('express/lib/response')
const app = express()
const jwt = require("jsonwebtoken")
require ("./mongoose.js")
const User = require("./models/user");
const auth = require("./auth");
const user = require('./models/user');


require("dotenv").config();


app.use(express.json())
app.use(cors())
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', '/api/');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});





// Register

app.post("/welcome", auth, async (req, res) => {

  console.log(req.user,"req entero");
  const identificator = req.user.user_id;
  const identificatorw = {_id : identificator};
  console.log(identificatorw,"ID que voy a buscar")
  var username = await User.findOne(identificatorw);
 
  console.log(username,"email del usuario");
  const identificatordb = username.id 
  const name = username.first_name 
  const email = username.email
  const lastname = username.last_name
  const password = "no te voy a pasar la clave pa"
  //const mensaje = `{nombre: ${name} ID: ${identificatordb}} `;
  const mensaje = {first_name : name, id : identificatordb, last_name : lastname, password : password, email : email };
  console.log (mensaje); 
 
  res.send(mensaje);
 // res.send(firstname);s
  
});



app.post("/register", async (req, res) => {
   // Our register logic starts here
   try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;
    console.log("se supone que cree las variables");
    // Validate user input
    if (!(email && password && first_name && last_name)) {
      console.log("se supone que el if da mal");
      res.send("All input is required",400); 
        }

    // check if user already exist
    // Validate if user exist in our database
    console.log("le pregunto a la db si ese usr existe",email);
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      console.log("el usr existe!")
      return res.send("User Already Exist. Please Login",409); 
    }
    console.log("el usr no existe")
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token  
    const token = jwt.sign(
      { user_id: user._id, email },
      "chota", // este es la clave del token, (averiguar como es lo de las variables de entorno)
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    console.log("token",token);

    // return new user
    res.send(user,201); 
  } catch (err) {
    console.log(err,"este error");
  }
  // Our register logic ends here

  });


  
  // Login
  app.post("/login", async (req, res) => {
      // our login logic goes here


      // Our login logic starts here
      try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
          res.send("All input is required",400);
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            "chota",
            {
              expiresIn: "2h",
            }
          );

          // save user token
          user.token = token;

          // user
          res.send(user);
        }
        res.send("Invalid Credentials",400);
      } catch (err) {
        console.log(err);
      }
      // Our register logic ends here
});

 





const PORT = 8002
app.listen (PORT, () => {
console.log("server is running on port",PORT)
})