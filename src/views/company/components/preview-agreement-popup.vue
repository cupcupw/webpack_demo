<template>
  <as-popup class="agreement" :title="title" :visible.sync="visible">
    <article class="agree-main" v-html="content" @click="handleChildAgreement" />
    <agreement-popup ref="refAgreementPopup" />
  </as-popup>
</template>

<script>
import agreementPopup from "../../../components/agreement-popup.vue";
import {mapState} from "vuex";
export default {
  name: "preview-agreement-popup",
  data() {
    return {
      content:'',
      visible: false,
      title: '',
    }
  },
  computed:{
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
  },
  methods: {
     show(nameValue, title) {
      this.visible = true
       this.title = title
      this.getAgreement(nameValue)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    async getAgreement(nameValue){
      const res1 = await this.$api.getConfirmAgree({
        nameValue: nameValue,
        memberSid: this.memberSid
      })
      this.content = res1.agreementContent
    },
    // 查看子协议
    handleChildAgreement(e){
      e.preventDefault()
      const { target } = e
      const id = target.getAttribute('href')
      if(target.nodeName.toLocaleLowerCase() === 'a' && id){
        this.$refs.refAgreementPopup.show(id)
      }
    },
  },
  components:{
    agreementPopup
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";
.agreement{
  @extend %df;
  @extend %fdc;
  @extend %aic;
  @extend %h100;
  @extend %w100;
  @extend %bsb;
  padding: j(0) j(16);
  &::v-deep{
    .steps-label{
      font-size: j(9);
      //text-align: center;
    }
    .steps-item{
      margin-right: j(6);
    }
    .steps-item:last-child{
      margin-right: 0;
    }
  }
  & img{
    width: j(64);
    height: j(64);
  }
  & h1{
    margin-top: j(20);
    font-size: j(20);
  }
  & button{
    //@extend %pf;
    @extend %b0;
    @extend %bn;
    //@extend %ao8;
    //bottom: j(106);
    margin-top: j(15);
    height: j(44);
    color: $white;
    width: j(344);
    font-size: j(14);
    border-radius: j(4);
    background-color: $green;
  }
}
.agree-steps{
  @extend %l0;
  @extend %r0;
  top: j(46);
}
.agree-main{
  flex: 1;
  box-sizing: border-box;
  padding: j(20) 0 j(30);
}
</style>
