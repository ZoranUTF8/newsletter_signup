const express = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
//The public folder which holds the CSS
app.use(express.static("public")); // static files path
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));



//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

// mailchimp config
mailchimp.setConfig({
  apiKey: "9dc678ec9fdc26b4e721581b8b6ed713-us1",
  server: "us1"
});

//As soon as the sign in button is pressed execute this
app.post("/", function(req, res) {

  // GET THE DATA FROM INPUT FORM
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // API LIST ID
  const listId = "7100ea1e8e";

  // data object with user data to send to mailchimp
  const userData = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  // FUNCION ???
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: userData.email,
      status: "subscribed",
      merge_fields: {
        FNAME: userData.firstName,
        LNAME: userData.lastName
      }
    });


    // if goes well log contacts id
    res.sendFile(__dirname + "/success.html")
    console.log("Successfully added contact as an audience member. The contact id: " + response.id);
  };

  // catches clicked on try again (failure.html), goes back to start page
  app.post("/failure", function(req, res) {
    res.redirect("/");
  });
  app.post("/success", function(req, res){
    res.redirect("/");
  })

  // IN CASE SIGNUP FAILED SENDS failure.html
  run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

// process.env.PORT ( dinamic port) heroku can chose the port || or localhost 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000");
});
// API KEY
// 9dc678ec9fdc26b4e721581b8b6ed713-us1
// LIST ID
// 7100ea1e8e
