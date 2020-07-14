const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");



const app = express();

app.use(bodyParser.urlencoded({
  extended: true
})); // the app.use pass the methods of the library to use directly ie: req.body.fName

app.use(express.static("public")); //tells Express.js where to find static files ie: images .css etc.

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/failure", function(req, res){ // you end here if the chimp goes mad and tyou press the Try Again button.
  res.redirect("/"); // and you will start again because I am redirecting you to the "/" route.
});

//---- The method POST is triggered by the user filling the form and click the button ---
app.post("/", function(req, res) {
  const firstName = req.body.fName; // getting data from the form which must have the method "post" and the action "/"
  const lastName = req.body.lName; // body-parser will decode and pass data in the form fields according their name.
  const email = req.body.email; // here whe strore the posted data in their respective variables.

  const data = { //construct a Json object with the field names required by the Mailchimp API
    members: [ // see https://mailchimp.com/developer/reference/lists/#post_/lists/-list_id-
      {
        email_address: email,
        status: "subscribed",
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
    auth: "cocodrilio:71692a10b16f073f6ed2ff226a0746db-us10" //The chimp requires any string (duh) as username and the Api key ass password for authentication
  };

  const httpsRequest = https.request(url, options, function(response) { // definition of httpsRequest takes an url and options, as callback we define a anonymous function with a parameter called "response"
    if (response.statusCode === 200) { //Are we ok Mr. chimp?
      res.sendFile(__dirname + "/success.html") // if so let subscriber know! Note the use of "res" because we are inside the app.post callback function!
    } else {
      res.sendFile(__dirname + "/failure.html") // Alas!, we are NOT ok and I will let him know! The chimp is angry now!
    };

    response.on("data", function(data) { // In this case "data" is what mailchimp responds
      console.log(JSON.parse(data)); //with "response" on "data" we log it to console parsed as JSON
    });
  });
  httpsRequest.write(jsonData); //Send the request to mailchim servers. We want to post this jsonData to the lists.
  httpsRequest.end(); // the end is here.
  // console.log(firstName, lastName, email);

});
//Post end here.
const PORT = process.env.PORT || 3000
app.listen(PORT || 3000, function() { //porcess.env.PORT for Heroku compatibility also keep 3000 for local port.
  console.log("Server running on port " + PORT); //if I am not in Heroku of course!
});

// API Key
// 71692a10b16f073f6ed2ff226a0746db-us10
// Audience unique id bd5d16f128
//
