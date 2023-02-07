<template>
  <as-view title="签署文件" :use-left-event="false" @left="handleBack" class="agreement">
    <steps class="agree-steps" :steps="computedSteps" direction="horizontal" :active-step="computedActiveStep"/>
    <article class="agree-main" v-html="computedAgreement" @click="handleChildAgreement" />
    <button @click="handleSignAgreement">确认并同意</button>
    <agreement-popup ref="refAgreementPopup" />
  </as-view>
</template>

<script>
import steps from "../components/steps";
import {mapState} from "vuex";
import agreementPopup from "@/components/agreement-popup"
import {COMPANY_STEPS, PERSON_STEPS} from "../plugins/constant";
export default {
  name: "agreement",
  data() {
    return {
      nameValue:3,
      userAgreement: {
        value: 3,
        content: ''
      },
      serviceAgreement: {
        value: 15,
        content: ''
      },
      activeStep: 2
    }
  },
  computed:{
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
    computedSteps(){
      return this.$route.query.type === '1'? this.$constant.PERSON_STEPS: this.$constant.COMPANY_STEPS
    },
    computedAgreement(){
      const {userAgreement, serviceAgreement} = this
      return this.nameValue===3? userAgreement.content:serviceAgreement.content
    },
    computedActiveStep(){
      const { activeStep } = this
      return activeStep
    }
  },
  created() {
    let {nameValue} = this.$route.query
    if(nameValue){
      this.nameValue = Number(nameValue)
    }
    this.getAgreement()
    console.log('this.$router', this.$router)
  },
  methods: {
    async getAgreement(){
      const res1 = await this.$api.getAgreement({
        nameValue: 3
      })
      const res2 = await this.$api.getAgreement({
        nameValue: 15
      })
      this.userAgreement = {
        id:res1.id,
        content:res1.content
      }
      this.serviceAgreement = {
        id:res2.id,
        content:res2.content
      }
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
    handleBack() {
      const { source } = this.$route.query
      if(source === 'list' ){
        this.$router.back()
      }else{
        this.$router.replace({path:'/person-steps'})
      }
    },
    handleSignAgreement(){
      console.log('this.nameValue', this.nameValue)
      console.log(this.nameValue === 3? this.userAgreement.id : this.serviceAgreement.id)
      const { memberSid } =  this
      this.$api.confirmAgree({
        memberSid,
        agreementId: this.nameValue === 3? this.userAgreement.id : this.serviceAgreement.id
      }).then(async res=>{
        if(this.nameValue === 3){
          let { memberSid } = this
          let { vasAgreeStatus }= await this.$api.loadMemberAuthInfo({ memberSid })
          if( vasAgreeStatus === 1 ) return this.$router.push('/person-steps')
          this.nameValue = 15
        }else if(this.nameValue === 15){
          this.handleBack()
          // this.$router.replace('/person-steps')
        }
      }).toast()
    }
  },
  components:{
    steps,
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
  height: 100vh;
  padding: j(0) j(16);
  &::v-deep{
    .steps-label{
      font-size: j(9);
      //text-align: center;
    }
    .steps-item{
      //margin-right: j(6);
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
    margin-bottom: j(40);
    height: j(44);
    color: $white;
    width: j(344);
    font-size: j(14);
    border-radius: j(4);
    background-color: $green;
  }
}
.agree-steps{
  margin-top: j(15);
  //@extend %pf;
  width: 100%;
  @extend %l0;
  @extend %r0;
  top: j(46);
}
.agree-main{
  height: j(460);
  overflow: auto;
  flex: 1;
  margin: j(15) j(0);
}
</style>
