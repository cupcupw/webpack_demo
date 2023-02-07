import md5 from 'md5'
import {backToApp} from "../plugins/app";

//接口签名
export function genSign(param) {
  const SIGN_KEY = isAndroid() ? '865e437f-c1eb-4a84-a9bb-26b134a1fcd0' : 'e0b8f547-36ae-48ea-b0e1-6018febcdb1e'
  const parameter = {
    ...param,
    apiKey: SIGN_KEY,
  }
  function raw(args) {
    let keys = Object.keys(args);
    keys = keys.sort()
    let newArgs = {};
    keys.forEach(function (key) {
      newArgs[key] = args[key];
    });
    let string = '';
    for (let k in newArgs) {
      string += ',' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  }
  let tem = parameter;
  let autoMd5 = "";
  if(tem.t){
    // delete tem.t;
  }
  if(tem.apiKey){
    delete tem.apiKey;
  }
  // 如果参数值为空则不参与签名
  for (let i in tem) {
    if (tem[i] === "" || tem[i] === null || tem[i] === undefined) {
      delete tem[i];
    }
  }
  tem.apiKey = SIGN_KEY;
  autoMd5 = md5(decodeURI(raw(tem)));
  return autoMd5;
}


export function isAndroid() {
  const u = navigator.userAgent
  return  u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
}


export function isIos() {
  const u = navigator.userAgent
  // ios终端
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}
export const getRedirectLocation = (url) => new Promise((resolve, reject) => {
  if(isIos() || true){
    resolve(url)
    return
  }
  const xhr = new XMLHttpRequest()
  xhr.open('get', url)
  xhr.onload = (res) => {
    if (xhr.responseURL) {
      url = xhr.responseURL
        .replace('http://114.67.97.89:9180', 'https://mf.autostreets.com/qiyuesuo') // 测试
        .replace('http://114.67.85.214:9180', 'https://mf.autostreets.com/qiyuesuo') // stage
        .replace('http://114.67.112.7:9180', 'https://mf.autostreets.com/qiyuesuo') // prod
    }
    resolve(url)
  }
  xhr.onerror = reject
  xhr.send()
})
