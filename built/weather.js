#!/usr/bin/env node
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var https = require('https');
var dedent = require('dedent');
var CITY_ID = 5206379;
var API_KEY = "b0f891eb3e45d840d7f85328d6352a89";
var BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
var UNITS = "imperial";
var degrees = UNITS === "imperial" ? "F" : "C";
var DEBUG = process.env.BLOCK_WEATHER_DEBUG;
var windSpeedFromData = function (speed) {
    if (DEBUG) {
        console.log("Wind speed: " + speed);
    }
    var output = "";
    if (15 < speed && speed < 25) {
        output = "breezy";
    }
    else if (25 <= speed && speed < 35) {
        output = "windy";
    }
    else if (speed > 35) {
        output = "very windy -- " + Math.round(speed) + "MPH";
    }
    return output;
};
var handleHttpResult = function (response) {
    var responseString = "";
    var statuscode = response.statuscode;
    if (statuscode != 200) {
        // Error from the HTTP request. Disappear.
        console.error("Error: " + statuscode);
        //process.exit(1);
    }
    response.setEncoding('utf8');
    response.on('data', function (data) {
        if (DEBUG) {
            console.log("Received data: " + data);
        }
        responseString += data;
    });
    response.on('end', function () { return printResults(interpretResults(JSON.parse(responseString))); });
};
var interpretResults = function (data) {
    if (DEBUG) {
        console.log("Full JSON Response: " + data);
    }
    return {
        status: data.weather[0].description,
        temp: Math.round(data.main.temp),
        wind_speed: windSpeedFromData(data.wind.speed)
    };
};
var printResults = function (data) { return console.log(dedent(__makeTemplateObject(["  Currently ", " and ", ". ", "\n  ", "; ", "\n  ", ""], ["  Currently ", " and ", ". ", "\n  ", "; ", "\n  ", ""]), data.status, data.temp, data.wind_speed, data.status, data.temp, getColorFromTemp(data.temp))); };
var hexFromRGB = function (red, green, blue) {
    c = { red: red, green: green, blue: blue };
    for (var i in c) {
        if (c[i] < 0) {
            c[i] = 0;
        }
        if (c[i] > 255) {
            c[i] = 255;
        }
    }
    var hex = function (number) {
        var numstr = Math.round(number).toString(16).toUpperCase();
        if (numstr.length == 1) {
            return '0' + numstr;
        }
        return numstr;
    };
    return "#" + hex(c.red) + hex(c.green) + hex(c.blue);
};
var getColorFromTemp = function (temperature) { return hexFromRGB((temperature * 2) / 100 * 255, temperature <= 50 ? 100 : (200 - temperature * 2) / 100 * 255, temperature >= 50 ? 0 : (200 - temperature * 2) / 100 * 255); };
https.get(BASE_URL + "?id=" + CITY_ID + "&units=" + UNITS + "&APPID=" + API_KEY, handleHttpResult);
