const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
const setting = require("./.env");

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");   
});

app.post("/", function(req, res){
    const query = req.body.cityName;
    const apiKey = setting.apiKey;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function(response) {
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            const wind = weatherData.wind.speed;

            res.write("<h1>The temperture in " + query + " is " + temp + "degrees Celcius.</h1>");
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<img src=" + imageURL + ">");
            if (wind <= 1.5) {
                res.write("No wind(" + wind + "m/s)");
            } else if (wind > 1.5 && wind < 5.4) {
                res.write("Slightly breezy(" + wind + "m/s)");
            } else {
                res.write("Watch out! Strong winds!(" + wind + "m/s)");
            }

            res.send();
        })
    })
});


app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})