<template>
  <as-view :title="computedTitle">
    <auth :is-person="!(this.computedType === '2')"
          :active-step="1"
          @submit="handleSubmit"
    />
  </as-view>
</template>

<script>
import Auth from 'src/components/auth'
import { Icon, Checkbox } from 'vant'
import {mapState} from "vuex";
export default {
  name: "name-auth",
  data() {
    return {
      isAgree: false,
      disable:false
    }
  },
  computed: {
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
    computedType:function(){
      return this.$route.query.type
    },
    computedTitle(){
      return this.computedType === '2'?  '企业竞拍认证':'个人竞拍认证'
    },
  },
  mounted() {
  },
  methods: {
    async handleSubmit(info){
      // if(this.disable) return
      const { memberSid, cellphone: memberPhone } = this
      console.log(cellphone)
      let { submitForm: form, status, authId:id = null, isMemberInfo } = info
      form = this.$banana.extract(form)
      Object.assign(form, {
        memberSid,
      })
      const { memberName, memberCardNo } = form
      const data = await this.$api.saveAuthMember(form)
      const { authId } = data;
      // let successPage = `${this.$constant.QIYUESUO_SUCCESS_PAGE}?authId=${authId}&memberSid=${memberSid}`;
      // let endPage = `${this.$constant.QIYUESUO_END_PAGE}?memberName=${memberName}&memberCardNo=${memberCardNo}&authId=${authId}&memberSid=${memberSid}`
      // this.$app.initAuthMember({authId,successPage,endPage})
      this.disable = true
      this.$api.initAuthMember({
        authId,
        successPage: `${this.$constant.QIYUESUO_SUCCESS_PAGE}?authId=${authId}&memberSid=${memberSid}`,
        endPage: `${this.$constant.QIYUESUO_END_PAGE}?memberName=${memberName}&memberCardNo=${memberCardNo}&authId=${authId}&memberSid=${memberSid}`
      }).then(res => {
        const { memberSid, linkUrl, cellphone } = res
        return this.$helper.getRedirectLocation(linkUrl)
      }).then(url => {
        window.location.href = url
      }).toast().finally(()=>{
        this.disable = false
      })
    },
  },
  components: {
    VanIcon: Icon,
    VanCheckbox: Checkbox,
    Auth,
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";
.as-view{
  @extend %h100;
  background-color: #f5f5f5;
}
</style>
