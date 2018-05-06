import info   = require('systeminformation');

interface Output {
  full_text: string,
  short_text: string,
  color: string
};
interface MemInfo {
  total: string, // human-readable memory total, like 900M or 8G
  available: string, // human readable available memory (ignores cache usage)
  percent: number, // the percent available
}
const print = (text) => console.log(
  text.full_text + '\n' + text.short_text + '\n' + text.color + '\n'
);

function percentSymbol(disp: boolean){
  return disp? "%" : "";
}
function percentOutput(value: number, max: number, free: boolean) {
  return numericOutput(max / value * 100, 100, free, true);
}
function showMax(percent: boolean, max: number){
  /*  wow that looks like a bunch of nonsense. If percent is true, sends back
   *  an empty string, otherwise it sends back a slash and then the max, so
   *  it looks like free/max.
   */
  return percent ? "" : `of ${prettyPrintMemorySize(max)}`;
}
function numericOutput(
      value: number, max: number, free: boolean, percent: boolean = false
    ): Output {
  const strvalue: string = percent?
    Math.round(value).toString() : prettyPrintMemorySize(value);
  let color: string;
  if ( value < (max * 0.75)) {
    color = "#FFFFFF";
  } else if (value < (max * .9)) {
    color = "#FFFF00";
  } else {
    color = "#FF0000";
  }
  return {
    full_text: `${strvalue}${percentSymbol(percent)} ${free? "free" :"used"} ${showMax(percent, max)}`,
    short_text: `${strvalue}${percentSymbol(percent)} ${free? "free" :"used"}`,
    color: color
  };
}

function prettyPrintMemorySize(amount: number): string {
  if (amount < 2**10 ){
    return amount + "B";
  } else if (amount < 2**20){
    return Math.round(amount / 2**10) + 'K';
  } else if (amount < 2**30){
    return Math.round(amount / 2**20) + 'M';
  } else {
    return (amount / 2**30).toPrecision(3) + 'G';
  }
}

export function memoryPercentFree(){
  info.mem(data => print(percentOutput(data.available, data.total, true)));
}
export function memoryPercentUsed(){
  info.mem(
    data => print(
      percentOutput(
        data.total - data.available, data.total, false
      )
    )
  );
}
export function memoryUsedOutOfMax(){
  info.mem(
    data => print(
      numericOutput(
        data.total - data.available, data.total, false
      )
    )
  );
}
export function memoryFreeOutOfMax(){
  info.mem(data => print(numericOutput(data.available, data.total, true)));
}
