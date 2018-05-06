"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var info = require("systeminformation");
;
var print = function (text) { return console.log(text.full_text + '\n' + text.short_text + '\n' + text.color + '\n'); };
function percentSymbol(disp) {
    return disp ? "%" : "";
}
function percentOutput(value, max, free) {
    return numericOutput(max / value * 100, 100, free, true);
}
function showMax(percent, max) {
    /*  wow that looks like a bunch of nonsense. If percent is true, sends back
     *  an empty string, otherwise it sends back a slash and then the max, so
     *  it looks like free/max.
     */
    return percent ? "" : "of " + prettyPrintMemorySize(max);
}
function numericOutput(value, max, free, percent) {
    if (percent === void 0) { percent = false; }
    var strvalue = percent ?
        Math.round(value).toString() : prettyPrintMemorySize(value);
    var color;
    if (value < (max * 0.75)) {
        color = "#FFFFFF";
    }
    else if (value < (max * .9)) {
        color = "#FFFF00";
    }
    else {
        color = "#FF0000";
    }
    return {
        full_text: "" + strvalue + percentSymbol(percent) + " " + (free ? "free" : "used") + " " + showMax(percent, max),
        short_text: "" + strvalue + percentSymbol(percent) + " " + (free ? "free" : "used"),
        color: color
    };
}
function prettyPrintMemorySize(amount) {
    if (amount < Math.pow(2, 10)) {
        return amount + "B";
    }
    else if (amount < Math.pow(2, 20)) {
        return Math.round(amount / Math.pow(2, 10)) + 'K';
    }
    else if (amount < Math.pow(2, 30)) {
        return Math.round(amount / Math.pow(2, 20)) + 'M';
    }
    else {
        return (amount / Math.pow(2, 30)).toPrecision(3) + 'G';
    }
}
function memoryPercentFree() {
    info.mem(function (data) { return print(percentOutput(data.available, data.total, true)); });
}
exports.memoryPercentFree = memoryPercentFree;
function memoryPercentUsed() {
    info.mem(function (data) { return print(percentOutput(data.total - data.available, data.total, false)); });
}
exports.memoryPercentUsed = memoryPercentUsed;
function memoryUsedOutOfMax() {
    info.mem(function (data) { return print(numericOutput(data.total - data.available, data.total, false)); });
}
exports.memoryUsedOutOfMax = memoryUsedOutOfMax;
function memoryFreeOutOfMax() {
    info.mem(function (data) { return print(numericOutput(data.available, data.total, true)); });
}
exports.memoryFreeOutOfMax = memoryFreeOutOfMax;
