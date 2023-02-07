import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant'
import { genSign, isAndroid } from 'src/utils/helper'
import {$device_info, $user} from 'src/plugins/storage'
// log 非重要的日志可以在这里禁止掉
const log = (action, prompt, ...args) =>
    ![''].includes(action)
    && console.log(`${action} ${prompt} => `, ...args)
// console.log('$device_info.getItem()', $device_info.getItem()['device-number'] , $device_info.getItem()['terminal-type'], $device_info.getItem()['os-name'])
const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production'? 'https://mf.autostreets.com/app/' : '/api/',
    timeout: 2 * 60 * 1000,
    // responseType: 'json',
    headers: {
        'app-name': 'autostreets',
        'os-name': $device_info.getItem()? $device_info.getItem()['os-name'] : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        'terminal-type':$device_info.getItem()? $device_info.getItem()['terminal-type'] : '',
    }
})

instance.interceptors.request.use(config => {
    const { url, baseURL, data, params } = config
    log(url.startsWith('http') ? url : baseURL + url , '请求参数', data || params)
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use((response) => {
    const { data: respData, config } = response
    const { url, baseURL } = config
    log(url.startsWith('http') ? url : baseURL + url , '请求返回', respData)
    const { data } = respData
    const { success, msg, code } = respData
    if (!success) {
        return Promise.reject({ msg: msg || '网络异常，请稍后再试', code})
    }
    return data
}, error => {
    console.log('请求响应错误 => ', error.response)
    error = error.response
        ? `网络繁忙，请稍后再试[${error.response.status}]`
        : `网络繁忙，请稍后再试(3)`
    return Promise.reject(error)
})

const curl = (url, data = {}, options = {}) => {
    const {
        method,
        loading,
        useToken = true,
    } = options = Object.assign({
        url,
        loading: true,
        method: 'post',
        headers: {},
    }, options)

    let toast
    if (loading) {
        toast = Toast.loading({ message: loading === true ? '加载中...' : loading, duration: 0, forbidClick: true })
    }
    delete options.loading

    const { token, memberSid } = $user.getItem({})
    if (useToken && token) {
        options.headers = Object.assign({ token }, options.headers)
    }

    data = Object.assign({ memberSid, t: Date.now() }, data)
    data.apiSign = genSign(data)

    if (method === 'post') {
      // 因为还会调用契约锁的服务契约锁是json的格式
      // 我们自己的服务是表单格式 所以得判断下
      if (options.headers['Content-Type'] !== 'multipart/form-data' && (!options.headers['Content-Type'] || !options.headers['Content-Type'].includes('application/json'))) {
            data = qs.stringify(data)
      }
      // if (options.headers['Content-Type'] === 'multipart/form-data'){
      if (options.headers['Content-Type'] === 'application/json'){
        // data = qs.stringify(data)
        data = {
          base64Url:data.base64Url
        }
      }
    }

    // console.log('data => ', data)

    options[method === 'get' ? 'params' : 'data'] = data

    return instance(options).finally(() =>
        toast && toast.clear()
    )
}

curl.get = (url, data = {}, options = {}) => {
    return curl(url, data, Object.assign({ method: 'get' }, options))
}

curl.post = (url, data = {}, options = {}) => {
    return curl(url, data, options)
}

export default curl
