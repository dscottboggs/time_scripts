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
  text.full_text, '\n', text.short_text, '\n', text.color
);
class MemoryInfo {
  constructor(){}
  percentSymbol(disp: boolean){
    return disp? "%" : "";
  }
  percentOutput(value: number, max: number) {
    return this.numericOutput(max/value * 100, 100, true);
  }
  showMax(percent: boolean, max: number){
    /*  wow that looks like a bunch of nonsense. If percent is true, sends back
     *  an empty string, otherwise it sends back a slash and then the max, so
     *  it looks like free/max.
     */
    return percent ? "" : `/${max}`;
  }
  numericOutput(value: number, max: number, percent: boolean = false): Output {
      let color: string;
      if ( value < (max * 0.75)) {
        color = "#FFFFFF";
      } else if (value < (max * .9)) {
        color = "#FFFF00";
      } else {
        color = "#FF0000";
      }
      return {
        full_text: `${value}${this.percentSymbol(percent)}${this.showMax(percent, max)}`,
        short_text: `${value}${this.percentSymbol(percent)}`,
        color: color
      };
  }
  memoryPercentFree (){
    info.mem(data => print(this.percentOutput(data.available, data.total)));
  }
  memoryFreeOutOfMax(){
    info.mem(data => print(this.numericOutput(data.available, data.total)));
  }
}

export default MemoryInfo;
