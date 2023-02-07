// 全家桶和原生交互
import { isAndroid, isIos } from 'src/utils/helper'
// import { $user } from 'src/plugins/storage'
import { $device_info } from 'src/plugins/storage'


// ;[
//     { fn: 'setLoginToken', key: 'token' },
//     { fn: 'setMemberSid', key: 'memberSid' },
//     { fn: 'setLocationCity', key: 'locationCity' }
// ].forEach(({ fn, key }) =>
//     window[fn] = data => $user.updateItem({ [key]: data })
// )
window['getHttpHeader'] = data => {
  console.log('httpheader',data);
  ['device-number','terminal-type','os-name'].forEach(item => {
    $device_info.updateItem({[item]: JSON.parse(data)[item]})
  })
}
// 统一回调原生
export function callNative (options = {}, callback) {
    const { handler, data = {} } = options
    let cb = ''
    if (callback) {
        cb = `__callback_${Date.now()}_${new Array(6).fill('').map(() => Math.floor(Math.random() * 10)).join('')}`
    }
    console.log('ios',window.webkit)
    console.log('and',window.app)

    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jsBridge) {
        window.webkit.messageHandlers.jsBridge.postMessage({ handler, cb, data })
    } else if(window.app && window.app[handler]) {
      console.log('调用原生服务')
      window.app[handler](JSON.stringify({ data, cb }))
    }
    if (cb) {
        window[cb] = (data) => {
          console.log(data)
            try { data = JSON.parse(data) } catch { }
            callback(data)
            delete window[cb]
        }
    }
}

// 配置支付结果页
// data = { data = { returnSuccessUrl, returnErrorUrl } }
export function setPayReturnUrl (data) {
    callNative({ handler: 'setPayReturnUrl', data })
}

// 埋点统计
export function statistical(data){
    console.log('埋点统计 => ', data)
    if(isIos() && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.webUserData){
        window.webkit.messageHandlers.webUserData.postMessage(data)
    } else if(isAndroid() && window.app && window.app.webUserData){
        window.app.webUserData(JSON.stringify(data))
    }
}

// 返回APP
export const backToApp = () => {
    try {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.backToApp) {
            window.webkit.messageHandlers.backToApp.postMessage(1)
        }
        if (window.app && window.app.backToApp) {
            window.app.backToApp()
        }
    } catch (err) {
        console.log('backToApp => ', err)
    }
}

// 语音输入
export const voiceInput = (data = {}) => {
    return new Promise((resolve, reject) => {
        callNative({ handler: 'voiceInput', data }, resolve)
    })
}

// 身份证相机
export const scanCamera = (data) => {
    return new Promise((resolve, reject) => {
      callNative({ handler: 'scanCamera', data }, resolve)
    })
}
// 身份证相机
export const downloadImage = (data) => {
  return new Promise((resolve, reject) => {
    callNative({ handler: 'downloadImage', data }, resolve)
  })
}
//使用原生头
export const setNativeNavStatus = (data) => {
  return new Promise((resolve, reject) => {
    callNative({ handler: 'setNativeNavStatus', data }, resolve)
  })
}

//去充值
export const marginPay = (data) => {
  return new Promise((resolve, reject) => {
    callNative({ handler: 'marginPay', data }, resolve)
  })
}
 //安卓打开相机
export const openFileChooser = (data) => {
  return new Promise((resolve, reject) => {
    callNative({ handler: 'openFileChooser', data }, resolve)
  })
}
//安卓获取链接
export const initAuthMember = (data) => {
  return new Promise((resolve, reject) => {
    callNative({ handler: 'initAuthMember', data }, resolve)
  })
}


export const $app = {
    voiceInput,
    setPayReturnUrl,
    statistical,
    backToApp,
    scanCamera,
    downloadImage,
    setNativeNavStatus,
    marginPay,
    openFileChooser,
    initAuthMember
}

export default {
    install (Vue) {
        Vue.prototype.$app = $app
    }
}
