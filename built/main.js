"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memory_1 = require("./memory");
var cpu_1 = require("./cpu");
function main() {
    //setInterval(displayFunction, 1000);
    displayFunction();
}
var displayFunction;
switch (process.env.BLOCK_INSTANCE) {
    case 'load':
    case 'cpu':
        displayFunction = cpu_1.default;
        break;
    case 'percent_free':
    case '%free':
        displayFunction = memory_1.memoryPercentFree;
        break;
    case 'free':
        displayFunction = memory_1.memoryFreeOutOfMax;
        break;
    case 'percent_used':
    case '%used':
        displayFunction = memory_1.memoryPercentUsed;
        break;
    case 'used':
        displayFunction = memory_1.memoryUsedOutOfMax;
        break;
    default:
        displayFunction = function () { return ''; };
        break;
}
main();
