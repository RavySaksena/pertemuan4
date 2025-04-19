const express = require("express")
const bodyParser = require("body-parser")
const session = require('express-session');

const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

 // body-perser to parse request body 
 app.use(bodyParser.urlencoded());

 app.set("view engine", "ejs");

 // static files
 app.use(express.static('public'));

 // Enabling sessions
 app.use(session({
    secret: 'some_secret_key',
    resave: false,
    saveUninitialized:true,
 }));

//  routes
 const index = require("./routes/index");
 const auth = require("./routes/auth");

 app.use('/', index)
 app.use("/auth", auth);

 app.listen(3000)
 console.log("Server is running on port 3000");