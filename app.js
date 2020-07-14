const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const https = require("https");


const app = express();

app.use(bodyParser.urlencoded({extended: true})); // the app.use pass the methods of the library to use directly ie: req.body.fName
app.use(express.static("public")); //tells Express.js where to find static files ie: images .css etc.


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName; // getting data from the form which must have the method "post" and the action "/"
  const lastName = req.body.lName; // body-parser will decode and pass data posted from the form fields according their name.
  const email = req.body.email; // here whe strore the posted data in their respective variables.

  const data = { //construct a Json object wihth the field names required by the Mailchimp API
    members: [ // https://mailchimp.com/developer/reference/lists/#post_/lists/-list_id-
      {
        email_address: email,
        status: "suscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data); // stringify the JSON object
  // declared all as const because they will not cahnge once they get a value inside the function

  const url = "https://us10.api.mailchimp.com/3.0/lists/bd5d16f128"; //us10 assigned by the apikey at the end -us10 and at the end the list id from mailchimp lists config

  const options = { //this pass options to https module as a JS object - See https documentation in node.js
    method: "POST", //the method is POST because we are triyin to sen data
    auth: "cocodrilio:71692a10b16f073f6ed2ff226a0746db-us10" //mailchimp requires any string as username and the apic key ass password for authentication
  };

  const httpsRequest = https.request(url, options, function(response){
    response.on("data", function{
      console.log(JSON.parse(data));
    })
  });
  httpsRequest.write(jsonData);
  httpsRequest.end();
    // console.log(firstName, lastName, email);

});


app.listen(3000, function(){
  console.log("Server running on port 3000");
});

// API Key
// 71692a10b16f073f6ed2ff226a0746db-us10
// Audience unique id bd5d16f128
//
