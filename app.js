//jshint esversion: 6

const mailchimp = require("@mailchimp/mailchimp_marketing");

const express = require("express");
const bodyParser = require("body-parser");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({encoded: true}));

app.get("/", function(req, res){
    res.sendfile(__dirname + "/signup.html"); 
});

mailchimp.setConfig({
    apiKey: "5fccda58b63524a2469abe7f343dca17-us1",
    server: "us1"
});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;

    const listId = "24784c7e2e";

    const subscribingUser = {
        firstName: firstName,
        lastName: secondName,
        email: email
    };

    async function run() {
        try{
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
        
        
        console.log(response);
        res.sendFile(__dirname + "/success.html");
        }
    catch (err) {
        console.log("====== ERROR ======");
        console.log(JSON.parse(err.response.error.text).detail);
        res.sendFile(__dirname + "/failure.html");
      }
    };

    run();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
  });


app.listen(process.env.POST || 3000, function(){
    console.log("The server is running on port 3000.");
});

//API key
//5fccda58b63524a2469abe7f343dca17-us1

//List Id   
//24784c7e2e
