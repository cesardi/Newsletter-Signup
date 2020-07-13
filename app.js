const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true})); // the app.use pass the methods of the library to use directly ie: req.body.fName
app.use(express.static("public")); //tells Express.js where to find static files ie: images .css etc.


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  var firstName = req.body.fName; // getting data from the form which must have the method "post" and the action "/"
  var lastName = req.body.lName; // body-parser will decode and pass data posted from the form fields according their name.
  var email = req.body.email; // here whe strore the posted data in their respective variables.
  // console.log(firstName, lastName, email);
});





app.listen(3000, function(){
  console.log("Server running on port 3000");
});

// API Key
// 71692a10b16f073f6ed2ff226a0746db-us10
// Audience unique id bd5d16f128 
