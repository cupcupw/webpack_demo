<template>
  <as-popup class="agreement" :title="agreement.name" :visible.sync="visible">
    <article v-html="agreement.content"></article>
  </as-popup>
</template>

<script>
export default {
  name: "agreement-popup",
  data () {
    return {
      visible: false,
      agreement: {}
    }
  },
  methods: {
    async show(id) {
      this.visible = true
      const data = await this.$api.getAgreement({nameValue: id})
      this.agreement = data
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
  }
}
</script>

<style scoped>
  .agreement{
    padding: j(0) j(16);
  }
</style>
