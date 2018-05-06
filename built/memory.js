"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var info = require("systeminformation");
;
var perc_sym = function (disp) { return disp ? "%" : ""; };
var percent_output = function (value, max) {
    return numericOutput(max / value * 100, 100, true);
};
var showMax = function (percent, max) { return percent ? "" : "/" + max; };
// wow that looks like a bunch of nonsense. If percent is true, sends back an
// empty string, otherwise it sends back a slash and then the max, so it looks
// like free/max.
function numericOutput(value, max, percent) {
    if (percent === void 0) { percent = false; }
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
        full_text: "" + value + perc_sym(percent) + showMax(percent, max),
        short_text: "" + value + perc_sym(percent),
        color: color
    };
}
function getMemInfo() {
    var meminfo = { total: '', available: '', percent: -1 };
    info.mem(function (data) {
        meminfo = {
            total: data.total,
            available: data.available,
            percent: data.total / data.available * 100
        };
    });
    return meminfo;
}
exports.default = getMemInfo;
function main() {
    console.log(getMemInfo());
}
