#!/usr/bin/env node
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var http = require("https");
var dedent = require('dedent');
var url = "https://am.i.mullvad.net/json";
var responseString = "";
function printResults(data) {
    var vpnStatus = data.mullvad_exit_ip ? 'VPN' : 'no vpn';
    if (data.blacklisted.blacklisted) {
        console.log(dedent(__makeTemplateObject(["Public IP: ", " BLACKLISTED\n      BLACKLISTED\n      #FF8888"], ["Public IP: ", " BLACKLISTED\n      BLACKLISTED\n      #FF8888"]), data.ip));
    }
    else {
        console.log(dedent(__makeTemplateObject(["      Public IP: ", " (", "), ", "), ", "\n      ", "\n      ", ""], ["      Public IP: ", " (", "), ", "), ", "\n      ", "\n      ", ""]), data.ip, data.city, data.country, vpnStatus, data.ip, data.mullvad_exit_ip ? "#88FF88" : "#FF8888"));
    }
}
function onData(data) {
    responseString += data;
}
function handleHttpResult(result) {
    var status = result.status;
    // no error checking because fuck it. (it's actually because in this use-case
    // there's just no sane way to display an error.)
    result.setEncoding('utf8');
    result.on('data', onData);
    result.on('end', function () {
        printResults(JSON.parse(responseString));
    });
}
http.get(url, handlHttpResult);
