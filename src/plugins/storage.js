import { cache , local} from 'as-cocoon/plugins/storage'

export const $user = cache.generate('$$USER_INFO')
export const $device_info = local.generate('$$device_info')
export default {
    install (Vue) {
        Vue.prototype.$user = $user
        Vue.prototype.$device_info = $device_info
    }
}
