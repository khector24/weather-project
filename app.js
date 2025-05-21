require("dotenv").config();

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("index")
});

app.post("/", (req, res) => {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "imperial";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);

            if (weatherData.cod !== 200) {
                return res.render("weather-response", {
                    error: "City not found. Please try again.",
                    temp: null,
                    description: null,
                    iconURL: null,
                    city: query
                });
            }

            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            res.render("weather-response", {
                temp,
                description,
                iconURL,
                city: query,
                error: null
            });
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.")
}); 