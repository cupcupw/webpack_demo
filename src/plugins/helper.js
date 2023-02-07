
import * as helper from 'src/utils/helper'

export default {
    install (Vue) {
        Vue.prototype.$helper = helper
    }
}
