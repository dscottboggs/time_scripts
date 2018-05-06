import info = require("systeminformation");

export default function main(){
    info.cpuCurrentspeed(data => console.log(
        `${data.avg}`, `${data.avg}`, "#FFFFFF"
    ));
}
