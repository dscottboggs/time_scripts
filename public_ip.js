#!/usr/bin/env node
const http = require("https")
const dedent = require('dedent');

const url = "https://am.i.mullvad.net/json";
let responseString = "";

function printResults(data) {
  const vpnStatus = data.mullvad_exit_ip? 'VPN': 'no vpn';
  if (data.blacklisted.blacklisted) {
    console.log(dedent `Public IP: ${data.ip} BLACKLISTED
      BLACKLISTED
      #FF8888`
    );
  } else {
    console.log(dedent
`      Public IP: ${data.ip} (${data.city}), ${data.country}), ${vpnStatus}
      ${data.ip}
      ${data.mullvad_exit_ip? "#88FF88": "#FF8888"}`
    );
  }
}

function onData(data){
  responseString += data
}

function handleHttpResult(result) {
  const { status } = result;
  // no error checking because fuck it. (it's actually because in this use-case
  // there's just no sane way to display an error.)
  result.setEncoding('utf8');
  result.on('data', onData);
  result.on('end', () => {
    printResults(JSON.parse(responseString));
  });
}

http.get(url, handlHttpResult);
