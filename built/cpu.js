"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var info = require("systeminformation");
function main() {
    info.cpuCurrentspeed(function (data) { return console.log("" + data.avg, "" + data.avg, "#FFFFFF"); });
}
exports.default = main;
