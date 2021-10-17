const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.firstName; 
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log(firstName, lastName, email);

    const data = {
        members: [
        {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us5.api.mailchimp.com/3.0/lists/b4625d2a49";
    const options = {
        method: "POST",
        auth: "vkay01:b95bc1e3cc3dbffda43b0b44d3579fd9-us5"
    }

    const request = https.request(url, options, function(response){
        console.log(response.statusCode);
        if (response.statusCode === 200){
            console.log(__dirname+"/success.html");
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(port, function(){
    console.log("Newsletter Server has started successfully on system assigned port");
})


//api key - b95bc1e3cc3dbffda43b0b44d3579fd9-us5
//audience id - https://us5.admin.mailchimp.com/lists/settings/defaults?id=528554 : b4625d2a49