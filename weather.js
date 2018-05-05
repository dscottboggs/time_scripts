#!/usr/bin/env node
const https = require('https');
const dedent = require('dedent');

const CITY_ID  = 5206379;
const API_KEY  = "b0f891eb3e45d840d7f85328d6352a89";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const UNITS    = "imperial";
const degrees  = UNITS === "imperial"? "F":"C";
const DEBUG    = process.env.BLOCK_WEATHER_DEBUG

const windSpeedFromData = (speed) => {
  if (DEBUG) {
    console.log(`Wind speed: ${speed}`);
  }
  let output = "";
  if (15 < speed && speed < 25) {
    output = "breezy";
  } else if (25 <= speed && speed < 35) {
    output = "windy";
  } else if ( speed > 35){
    output = `very windy -- ${Math.round(speed)}MPH`;
  }
  return output;
}

const handleHttpResult  = (response)  => {
  let responseString = "";
  const { statuscode } = response;
  if (statuscode != 200) {
    // Error from the HTTP request. Disappear.
    console.error(`Error: ${statuscode}`);
    //process.exit(1);
  }
  response.setEncoding('utf8');
  response.on(
    'data',
    (data) => {
      if (DEBUG) {
        console.log(`Received data: ${data}`);
      }
      responseString += data;
    }
  );
  response.on(
    'end',
    () => printResults(interpretResults(JSON.parse(responseString)))
  );
}

const interpretResults = (data) => {
  if (DEBUG) {
    console.log(`Full JSON Response: ${data}`);
  }
  return {
    status: data.weather[0].description,
    temp: Math.round(data.main.temp),
    wind_speed: windSpeedFromData(data.wind.speed)
  }
};

const printResults = (data) => console.log(dedent
`  Currently ${data.status} and ${data.temp}. ${data.wind_speed}
  ${data.status}; ${data.temp}
  ${getColorFromTemp(data.temp)}`
);

const hexFromRGB = (red, green, blue) => {
  c = { red: red, green: green, blue: blue};
  for (var i in c){
    if (c[i] < 0){
      c[i] = 0;
    }
    if (c[i] > 255) {
      c[i] = 255;
    }
  }
  const hex = (number) => {
    const numstr = Math.round(number).toString(16).toUpperCase();
    if (numstr.length == 1){
      return '0' + numstr;
    }
    return numstr;
  }
  return `#${hex(c.red)}${hex(c.green)}${hex(c.blue)}`;
}

const getColorFromTemp = (temperature) => hexFromRGB(
  (temperature * 2) / 100 * 255,
  temperature <= 50? 100: (200 - temperature * 2) / 100 * 255,
  temperature >= 50? 0: (200 - temperature * 2) / 100 * 255
);

https.get(
  `${BASE_URL}?id=${CITY_ID}&units=${UNITS}&APPID=${API_KEY}`,
  handleHttpResult
);
