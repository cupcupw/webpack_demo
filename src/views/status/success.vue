<template>
  <as-view title="认证通过" :use-left-event="false" @left="handleBack" class="certification-status">
    <img :src="require('src/assets/images/success.png')" alt="">
    <h1>认证通过</h1>
    <button @click="handleSignAgreement">去签署协议</button>
  </as-view>
</template>

<script>
import {mapState} from "vuex";
import {QIYUESUO_AGREEMENT_CALLBACK_URL} from "../../plugins/constant";

export default {
  name: "success",
  data() {
    return {

    }
  },
  computed: {
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
  },
  beforeRouteEnter(to, from ,next){
    const { query } = to
    const { authId, status } = query
    console.log('query =>',query)
    next(vm => {
      vm.handleAuthCallback( authId )
    })
  },
  methods: {
    async handleAuthCallback(authId){
      const { memberSid } = this
      await this.$api.checkMemberAuthStatus({
        authId,
        memberSid
      })
    },
    handleBack() {
      this.$router.replace({path:'/person-steps'})
    },
   async handleSignAgreement() {
      //todo 本期暂不用契约锁电子合同，使用原先合同
     //  const { memberSid } = this
     //  const { agreementId, contractId, presignUrl, ...res} = await this.$api.getAuthAgreeTemplate({
     //    memberSid,
     //    callBackPageUrl: this.$constant.QIYUESUO_AGREEMENT_CALLBACK_URL
     //  })
     // window.location.href = presignUrl
     let {memberSid} = this
     const {authCategory} = await this.$api.loadMemberAuthInfo({
       memberSid
     })
     await this.$router.replace({
       path:'/agreement',
       query:{
         type:authCategory
       }
     })
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";
.certification-status{
  @extend %df;
  @extend %fdc;
  @extend %aic;
  @extend %h100;
  @extend %w100;
  @extend %bsb;
  padding: j(26) j(16);
  & img{
    width: j(64);
    height: j(64);
  }
  & h1{
    margin-top: j(20);
    font-size: j(20);
  }
  & button{
    @extend %pf;
    @extend %b0;
    @extend %bn;
    @extend %ao8;
    bottom: j(106);
    height: j(44);
    color: $white;
    width: j(344);
    font-size: j(14);
    border-radius: j(4);
    background-color: $green;
  }
}
</style>
