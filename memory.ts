const os = require('os');

interface Output = {
  full_text: string,
  short_text: string,
  color: string
};

const perc_sym       = (disp: boolean) => disp? "%" : "";
const percent_output = (value: number) => numeric_output(value, 100, True);
const showMax        = (percent: boolean, max: number) => percent?"":`/${max}`;
// wow that looks like a bunch of nonsense. If percent is true, sends back an
// empty string, otherwise it sends back a slash and then the max, so it looks
// like free/max.

function numericOutput(
    value: number, max: number, percent: boolean = False
  ): Output {
    let color: string;
    if ( value < (max * 0.75)) {
      color = "#FFFFFF";
    } else if (value < (max * .9)) {
      color = "#FFFF00";
    } else {
      color = "#FF0000";
    }
    return {
      full_text: `${value}${perc_sym(percent)}${showMax(percent, max)}`,
      short_text: `${value}${perc_sym(percent)}`,
      color: color
    };
}
