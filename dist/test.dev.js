"use strict";

var val = "margin-top: 32px; margin-left: 24px; max-width: 690px; overflow: hidden; text-overflow: ellipsis; line-height: 36px; white-space: nowrap; color: rgb(51, 51, 51); font-family: PingFangSC; font-size: 32px; font-weight: 500;";
var reg = /([\w-]+)\: ([\w-]+)\;/g;
var obj = {};

while (1) {
  var res = reg.exec(val);

  if (!res) {
    break;
  }

  obj[res[1]] = res[2];
}

console.log("🚀 ~ file: test.js ~ line 10 ~ obj", obj);