import { Toast } from 'vant'

let scriptId = 0
let prefix = '__import__'
const loadJs = async (url) => {
    let script = document.createElement('script')
    let elId = prefix + scriptId

    return new Promise((resolve, reject) => {
        script.onload = (res) => {
            scriptId++
            resolve(0)
            Toast.clear()
        }
        if (!document.querySelector(`#${elId}`)) {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
            })
            script.id = elId
            script.src = url
            script.async = true
            document.head.appendChild(script)
        } else {
            resolve(0)
        }
    })
}
// appid 2037215582
// App Secret Key  0yWk3na4PVhv_sp2F_NJlGA**
const TencentVerify = {
    async open(appid = '2037215582', callback, opts = { needFeedBack: false }) {
        if (!window.TencentCaptcha) {
            await loadJs('https://ssl.captcha.qq.com/TCaptcha.js')
        }
        return new Promise((resolve, reject) => {
            let captcha = new TencentCaptcha(appid, (res) => {
                if (res.ret === 0) {
                    let result = { success: true, msg: '验证成功', params: res }
                    callback && callback(result)
                    resolve(result)
                }
                reject({ success: false, msg: '验证失败' })
                captcha.destroy()
            }, opts)
            captcha.show()
        })
    }
}

export default TencentVerify
