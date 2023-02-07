export default {
    install (Vue) {
        Vue.mixin({
            data () {
                return {
                    superError: '',
                }
            },
            methods: {
                superBackToApp () {
                    this.$app.backToApp()
                },
                // 超级事件处理
                superHandle (options, disabled, $event) {
                    // 这里以后可以做条件判断
                    const { to, fn, query, replace, params, disabled: itemDisabled } = options
                    if (disabled === undefined) {
                        disabled = itemDisabled
                    }
                    if (disabled === true) return
                    if (to) {
                        return this.$router[replace ? 'replace' : 'push']({ path: to, query, params })
                    }
                    if (fn) {
                        return typeof fn === 'function' ? fn.call(this, options, $event) : this[fn](options, $event)
                    }
                },
            },
        })
    }
}
