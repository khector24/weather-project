import dotenv from "dotenv";

import express from "express";
import https from "https";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index")
});

app.post("/", async (req, res) => {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "imperial";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const weatherData = await response.json();

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

    } catch (err) {
        console.error("Fetch error:", err);
        res.render("weather-response", {
            error: "Something went wrong. Please try again.",
            temp: null,
            description: null,
            iconURL: null,
            city: query
        });
    }
});


app.listen(3000, function () {
    console.log("Server is running on port 3000.")
}); 