import {
  memoryPercentFree,
  memoryFreeOutOfMax,
  memoryPercentUsed,
  memoryUsedOutOfMax
} from './memory';

import loadAvg from "./cpu";

function main() {
    //setInterval(displayFunction, 1000);
    displayFunction();
}

var displayFunction;
switch (process.env.BLOCK_INSTANCE) {
    case 'load': case 'cpu':
        displayFunction = loadAvg;
        break;
    case 'percent_free': case '%free':
        displayFunction = memoryPercentFree;
        break;
    case 'free':
        displayFunction = memoryFreeOutOfMax;
        break;
    case 'percent_used': case '%used':
        displayFunction = memoryPercentUsed;
        break;
    case 'used':
        displayFunction = memoryUsedOutOfMax;
        break;
    default:
        displayFunction = () => '';
        break;
}

main();
