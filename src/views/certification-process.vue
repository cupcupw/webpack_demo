<template>
  <as-view title="企业认证流程" @left="handleLeft" class="certification-process">
    <steps :steps="computedProcess" :active-step="6">
      <template #default="{ step: { more } }">
        <ul>
          <li  v-for="item in more"
               :key="item.index"
               class="process-steps"
          >
            {{item}}
          </li>
        </ul>
      </template>
    </steps>
    <div class="process-warning">
      <img :src="require('src/assets/images/warning.png')" alt="">
      <p>选择企业认证后，此账号将无法变更为个人认证</p>
    </div>
    <div class="process-button-box">
      <button class="button-cancel" @click="handleLeft">暂不认证</button>
      <button :disabled="!canCertification" class="button-submit" :class="{'is-disabled': seconds > 0}" @click="handleSubmit">{{ computedSeconds }}</button>
    </div>
  </as-view>
</template>

<script>
import Steps from "../components/steps";
import { Button } from 'vant'
import {COMPANY_CERTIFICATION_PROCESS} from "../plugins/constant";
import {mapState} from "vuex";
export default {
  name: "certification-process",
  data() {
    return {
      timer: null,
      seconds: -1,
      canCertification:false
    }
  },
  created() {
    this.timer = 10
    this.getTime(this.timer)
  },
  computed: {
    computedProcess() {
      return this.$constant.COMPANY_CERTIFICATION_PROCESS
    },
    computedSeconds() {
      return this.seconds > 0 ? '确认认证' + '(倒计时' + this.seconds + '秒)' : '确定认证'
    },
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
  },
  methods: {
    handleLeft(){
      if (window.history.state && window.history.state.key) {  //返回上级h5
        this.$router.go(-1);
      } else {  //返回app页面
        this.$app.backToApp();
      }
    },
    getTime(duration) {
      this.timer && clearTimeout(this.timer);
      this.seconds = duration ;
      this.timer = setTimeout(() => {
        this.getTime(duration - 1);
      }, 1000);
      if (duration <= 0 ){
        this.canCertification = true
        return
      }
    },
    handleSubmit() {
      if(this.seconds > 0) return false
      let {memberSid} = this
      this.$api.confirmAuthCompany({
        memberSid,
      }).then(async(res)=>{
        let {authAgreeStatus , vasAgreeStatus} = await this.$api.loadMemberAuthInfo({ memberSid })

        if( authAgreeStatus===1 && vasAgreeStatus === 1 ){
          this.$router.push({
            path:'/company-authentication'
          })
        }else{
          this.$router.push({
            path:'/person-certification',
            query:{
              type:2
            }
          })
        }
      }).toast()
    }
  },
  components: {
    Steps,
    VanButton: Button
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";

.certification-process{
  @extend %w100;
  @extend %bsb;
  padding: j(26) j(16);
  &::v-deep{
    .steps-right{
      padding-bottom: j(22);
    }
    .steps-right-content{
      padding-top: j(4);
    }
  }
}
.process-steps{
  font-size: j(14);
  color: #666;
  padding-top: j(2);
}
.process-warning{
  @extend %df;
  @extend %aic;
  font-size: j(14);
  padding: j(12);
  border-radius: j(4);
  color: #F78A5A;

  background-color: rgba(247, 138, 90, 0.0800);
  & img{
    width: j(16);
    height: j(16);
    margin-right: j(5);
  }
}
.process-button-box{
  @extend %df;
  //@extend %jcs;
  justify-content: space-around;
  margin-top: j(20);
}
.button-cancel, .button-submit{
  @extend %bn;
  @extend %df;
  @extend %aic;
  @extend %jcc;
  @extend %ao8;
  @extend %bsb;
  @extend %cp;
  padding: j(12) 0;
  border-radius: j(4);
  font-size: j(14);
}
.button-cancel{
  @extend %bsb;
  width: j(124);
  color: $green;
  background-color: #fff;
  border: 1px solid $green;
}
.button-submit{
  @extend %bsb;
  width: j(196);
  color: $white;
  background-color: $green;
}
.is-disabled{
  opacity: .8;
  cursor: no-drop;
}
</style>
