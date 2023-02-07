
// vant UI 配置

import { Toast, Dialog } from 'vant'

Toast.setDefaultOptions('loading', { forbidClick: true, message: '加载中...' });

export default {
    install (Vue) {
        Vue.use(Toast)
        Vue.use(Dialog)

        // fix finally clear
        const $toast = Vue.prototype.$toast
        const $newToast = function (msg) {
            setTimeout(() => { $toast.call(this, msg) })
        }
        for (let k in $toast) {
            $newToast[k] = $toast[k]
        }
        Vue.prototype.$toast = $newToast
    }
}
