import AsUI from "as-cocoon/ui";
import { isEmpty } from 'as-cocoon/plugins/utils/validator'
import AsPlugin from 'as-cocoon/plugins'
import { filterMessage } from 'as-cocoon/plugins/filters'

import { Toast } from 'vant'

const exclude = ['', 'cancel', 'undefined']

const BananaMixin = {
  methods: {
    // 格式化 banana form 表单数据格式
    // 如果有值了 则需要把必填的红点去掉
    bananaFormatForm(s) {
      return Object.keys(s).reduce((r, k) => {
        const item = s[k]
        const {rules = [], hidden, value} = item
        if (!hidden) {
          r[k] = item
        }
        let required = !!rules.find(item => item.required) && isEmpty(value)
        if (k === 'licenseCode' && !required) {
          required = value.length < 3
        }
        if (k === 'vinCode' && !required) {
          required = value.length < 11
        }
        if (item.required === undefined) {
          this.$set(item, 'required', required)
        } else {
          item.required = required
        }
        return r
      }, {})
    },
  }
}
export default {
    install(Vue) {
        Vue.use(AsPlugin, {
          es6Promise: { toast: Toast, exclude },
        })
        Vue.use(AsUI)
        Vue.config.errorHandler = function (err) {
          console.log('err => ', err)
          const message = filterMessage(err)
          if (!exclude.includes(message)) {
            Toast.clear(true) // 注意: 这里不能删除哦
            Toast(message)
          }
        }
        Vue.mixin(BananaMixin)
    }
}
