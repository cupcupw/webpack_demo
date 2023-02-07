<template>
  <as-view :title="computedTitle" @left="$app.backToApp">
    <div class="certification-warning" v-if="memberInfo.authAgreeStatus !== 1">
      <van-icon  name="warning-o" size="16px" color="#BCBEC0"></van-icon>
      <p>完成竞拍认证的会员才能参加竞拍</p>
    </div>
    <div class="certification-warning" v-if="memberInfo.marginCashStatus === 0">
      <van-icon name="warning-o" size="16px" color="#BCBEC0"></van-icon>
      <p>充值<span style="color: #F26654">满2000元</span>保证金完成开户后可参拍</p>
    </div>
    <div class="certification-warning" v-if="computedType === 2 && memberInfo.marginCashStatus === 0">
      <van-icon name="warning-o" size="16px" color="#BCBEC0"></van-icon>
      <p>企业用户需使用对公账号转账进行保证金充值</p>
    </div>
    <h3 class="certification-title">{{ computedTitle }}</h3>
    <steps class="certification-steps" ref="steps" :status="computedStatus" :steps="computedSteps" :active-step="computedActiveStep" :is-bold-title="false" is-button>
      <template v-slot:other="{ button }">
        <button class="steps-btn"
                :class="{
                  'is-completed': computedBtnText(button) === '去完成' || computedBtnText(button) === '继续认证',
                  'is-active': computedBtnText(button) === '待完成',
                  'is-fail': computedBtnText(button) === '重新提审' || computedBtnText(button) === '重新认证'
                }"
                @click="handleBtnClick(button.title)"
        >
          {{ computedBtnText(button) }}
          <van-icon v-if="computedBtnText(button) === '已完成'" name="arrow"/>
        </button>
      </template>
      <template v-slot:tip="{ tip }" >
        <div v-if="computedShowTip(tip) || tip.key === 'agreeStatus'" class="steps-tip">
          <div class="steps-tip-text" v-if="computedShowTip(tip)" >
            <van-icon name="warning-o" size="0.32rem" color="#F78A5A"></van-icon>
            <p>{{ computedShowTipText(tip) }}</p>
          </div>
          <div v-else class="tips-steps-block">
            <div class="tips-steps" v-for="(button,index) in tip.children" :key="index">
              <span class="tips-steps-label" :class="{'tips-steps-label-finished': computedStatus[button.key] === 1}"> {{button.title}} </span>
              <button class="steps-btn"
                      :class="{
                  'is-completed': computedBtnText(button) === '去完成',
                  'is-active': computedBtnText(button) === '待完成',
                  'is-fail': computedBtnText(button) === '重新提审' || computedBtnText(button) === '重新认证'
                }"
                      @click="handleBtnClick(button.title)"
              >
                {{ computedBtnText(button) }}
                <van-icon v-if="computedBtnText(button) === '已完成'" name="arrow"/>
              </button>
            </div>
          </div>
        </div>
      </template>
    </steps>
    <certification-info ref="info"></certification-info>
    <div class="certification-transform"
         v-if="memberInfo.authCategory===2 && [0,2].includes(memberInfo.authCompanyStatus)"
         @click="handleStopAuthCompany"
    >中止企业认证，转为个人认证</div>
  </as-view>
</template>

<script>
import {Icon} from "vant";
import Steps from "../../components/steps";
import {mapState} from "vuex";
import CertificationInfo from "../../components/certification-info";
export default {
  name: "person-steps",
  data() {
    return {
      memberInfo: {},
    }
  },
  async created() {
    await this.handleGetMemberInfo()
  },
  mounted() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  },
  computed: {
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
    //authMemberStatus  个人实名认证状态：0-待认证 1-已认证 2-认证失败 3-认证中、默认0
    //authAgreeStatus 用户参拍协议-签署协议状态：0-未签署 1-已签署、默认0
    // vasAgreeStatus 增值服务协议-签署协议状态：0-未签署 1-已签署、默认0
    //authCompanyStatus  企业认证状态：0-待认证 1-已认证 2-审核失败 3-待审核、默认0
    //marginCashStatus 是否充值保证金： 0-未充值 1-已充值
    computedBtnText() {
      return (item) => {
        const {
            authMemberStatus,
            authAgreeStatus,
            authCompanyStatus,
            vasAgreeStatus,
            marginCashStatus
        } = this.memberInfo
        if(['个人实名认证', '委托人实名认证'].includes(item.title)) {
          if( authMemberStatus === 1 ) return '已完成'
          if( authMemberStatus === 2 ) return '重新认证'
          if( authMemberStatus === 3 ) return '继续认证'

          else return '去完成'
        }
        if(['签署《用户参拍协议》', '委托人签署《用户参拍协议》'].includes(item.title)) {
          if(authAgreeStatus === 1) return '已完成'
          if(authAgreeStatus === 0 && authMemberStatus === 1) return '去完成'
          else return '待完成'
        }
        if(['签署《增值服务协议》', '委托人签署《增值服务协议》'].includes(item.title)) {
          if(vasAgreeStatus === 1) return '已完成'
          if(vasAgreeStatus === 0 && authAgreeStatus === 1) return '去完成'
          else return '待完成'
        }
        if(item.title === '企业信息认证') {
          if(authCompanyStatus === 1) return '已完成'
          if(authCompanyStatus === 2) return '重新提审'
          if(authCompanyStatus === 3) return '待审核'
          if(authCompanyStatus === 0 && vasAgreeStatus === 1) return '去完成'
          else return '待完成'
        }
        if(['充值保证金', '企业充值保证金'].includes(item.title)) {
          if(marginCashStatus === 0){
            if(this.computedType === 2){
                return '待完成'
            }else if(this.computedType === 1 && authAgreeStatus === 1){
              return '去完成'
            }else{
              return '待完成'
            }
          }else if(marginCashStatus === 1){
            return '已完成'
          }else{
            return '待完成'
          }
        }
      }
    },
    computedActiveStep(){
      const {
        authMemberStatus,
        authAgreeStatus,
        vasAgreeStatus,
        authCompanyStatus,
        marginCashStatus
      } = this.memberInfo
      if(this.computedType === 1){
        if(authMemberStatus !==1) return 1
        if(authAgreeStatus !==1 || vasAgreeStatus !==1) return 2
        if(authAgreeStatus===1 && vasAgreeStatus ===1) return 3
        if(marginCashStatus !==1) return 4
      }
      if(this.computedType === 2){
        if(authMemberStatus !==1) return 1
        if(authAgreeStatus !==1 || vasAgreeStatus !==1) return 2
        if(authAgreeStatus===1 && vasAgreeStatus ===1) return 3
        if(authCompanyStatus !==1) return 4
        if(marginCashStatus !==1) return 5
      }
    },
    computedType(){
      return this.memberInfo.authCategory
    },
    computedTitle(){
      return this.computedType === 1?  '个人竞拍认证':'企业竞拍认证'
    },
    computedStatus() {
      const {
        authMemberStatus,
        authAgreeStatus,
        authCompanyStatus,
        vasAgreeStatus,
        marginCashStatus
      } = this.memberInfo
      let agreeStatus
      if (vasAgreeStatus === 1 && authAgreeStatus === 1) {
        agreeStatus = 1
      }
      return {
        authMemberStatus,
        authAgreeStatus,
        authCompanyStatus,
        vasAgreeStatus,
        marginCashStatus,
        agreeStatus
      }
    },
    computedSteps(){
      return this.computedType === 1? this.$constant.PERSON_STEPS_TEMP:this.$constant.COMPANY_STEPS_TEMP
    },
    computedShowTip(){
      return (item) => {
        const { title } = item
        const { memberInfo: { authCompanyInfo, authMemberStatus } } = this
        if(title.includes('实名') && authMemberStatus === 2) return true
        if(title.includes('企业信息认证') &&
          authCompanyInfo !== undefined &&
          authCompanyInfo.auditBackReason !== undefined
        ) return true
      }
    },
    computedShowTipText(){
      return (item) => {
        const { title } = item
        const { memberInfo } = this
        return title === '企业信息认证'
          ? memberInfo.authCompanyInfo.auditBackReason
          : '认证失败，请重新进行认证'
      }
    }
  },
  methods: {
    async checkMemberAuthStatus(){
      const{ memberSid } = this
      this.$api.checkMemberAuthStatus({
        memberSid,
        authId: this.memberInfo.authMemberInfo.id
      }).then(async () => {
        const result = await this.$api.loadMemberAuthInfo({ memberSid })
        Object.keys(result).forEach(k => {
          this.$set(this.memberInfo, k, result[k])
        })
      })
    },
    async checkAgreeConfirmStatus() {
      const { memberSid } = this
      const { agreementId, contractId } = this.$route.query
      this.$api.checkAgreeConfirmStatus({
        memberSid,
        agreementId,
        contractId
      }).then(async () => {
        const result = await this.$api.loadMemberAuthInfo({ memberSid })
        Object.keys(result).forEach(k => {
          this.$set(this.memberInfo, k, result[k])
        })
        this.$forceUpdate()
      })
    },
    async handleGetMemberInfo() {
      const { memberSid } = this
      this.memberInfo = await this.$api.loadMemberAuthInfo({ memberSid })
      if(this.memberInfo.authMemberInfo.id){
        await this.checkMemberAuthStatus(); //这里是因为需要更新状态，有id才能更新,
      }
      // if(this.memberInfo.authAgreeInfo.agreementId && this.memberInfo.authAgreeInfo.contractId){
      //  this.checkAgreeConfirmStatus();//不对接契约锁了 不用刷他们的了
      // }
    },
    // async handleSignAgreement() {
    //   this.$router.push({
    //     path:'/agreement',
    //     query:{
    //       type:this.computedType
    //     }
    //   })
      // const { memberSid } = this
      // const { presignUrl } = await this.$api.getAuthAgreeTemplate({
      //   memberSid,
      //   callBackPageUrl: this.$constant.QIYUESUO_AGREEMENT_CALLBACK_URL
      // })
      // window.location.href = presignUrl
    // },
    //authMemberStatus  个人实名认证状态：0-待认证 1-已认证 2-认证失败 3-认证中、默认0
    //authAgreeStatus 用户参拍协议-签署协议状态：0-未签署 1-已签署、默认0
    // vasAgreeStatus 增值服务协议-签署协议状态：0-未签署 1-已签署、默认0
    //authCompanyStatus  企业认证状态：0-待认证 1-已认证 2-审核失败 3-待审核、默认0
    async handleBtnClick(item, status){
      const { memberSid } = this
      const {
        authMemberStatus,
        authAgreeStatus,
        vasAgreeStatus,
        authCompanyStatus,
        marginCashStatus
      } = this.memberInfo
      if (['个人实名认证', '委托人实名认证'].includes(item)){
        if([1].includes(authMemberStatus)) this.$refs.info.show()
        if([0,2].includes(authMemberStatus)) return this.$router.push(`/person-certification?type=${this.computedType}`);
        if([3].includes(authMemberStatus)){
          const { id:authId , memberCardNo , memberName } = this.memberInfo.authMemberInfo
          this.$api.initAuthMember({
            authId:this.memberInfo.authMemberInfo.id,
            successPage: `${this.$constant.QIYUESUO_SUCCESS_PAGE}?authId=${authId}&memberSid=${memberSid}&type=${this.computedType}`,
            endPage: `${this.$constant.QIYUESUO_END_PAGE}?memberName=${memberName}&memberCardNo=${memberCardNo}&authId=${authId}&memberSid=${memberSid}`
          }).then(res => {
            const { linkUrl } = res
            return this.$helper.getRedirectLocation(linkUrl)
            // if(linkUrl) this.$router.push('/person-certification')
            // window.location.href = linkUrl
          }).then(url => {
            window.location.href = url
          }).toast()
        }
        else return false
      }
      if (['签署《用户参拍协议》', '委托人签署《用户参拍协议》','签署《增值服务协议》','委托人签署《增值服务协议》'].includes(item)) {
        let nameValue = ['签署《用户参拍协议》', '委托人签署《用户参拍协议》'].includes(item)? 3:15;
        let checkStatus = ['签署《用户参拍协议》', '委托人签署《用户参拍协议》'].includes(item)? authAgreeStatus:vasAgreeStatus;
        let previousStatus = ['签署《用户参拍协议》', '委托人签署《用户参拍协议》'].includes(item)? authMemberStatus:authAgreeStatus
        if(checkStatus === 1) {
          console.log(this.$router)
          this.$router.push({
            path:`/preview-agreement?nameValue=${nameValue}`
          })
        }
        else {
          if (previousStatus === 1){
            this.$router.push({
              path:'/agreement',
              query:{
                type:this.computedType,
                nameValue,
                source:'list'
              }
            })
            // this.handleSignAgreement()
          }
          else return false
        }
      }
      if(item === '企业信息认证'){
        if ([1].includes(authCompanyStatus)) this.$refs.info.show('company')
        if ([0,2].includes(authCompanyStatus) && vasAgreeStatus === 1){
          this.$router.push('/company-authentication')
          console.log('重新审核')
        }
      }
      if (['充值保证金'].includes(item)){
        if (marginCashStatus === 0 && vasAgreeStatus === 1){
          this.$app.marginPay()
          console.log('跳转原生')
        }
      }
    },
    handleVisibilityChange() {
      let hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
          'mozHidden' in document ? 'mozHidden' :
            null;
      if (document[hiddenProperty]) {
        //当离开H5 跳转到app原生的页面时,这里会被触发
      } else {
        //当从原生页面用户一系列操作后,返回H5的时候,这里会被触发
        this.handleGetMemberInfo()
      }
    },
    handleStopAuthCompany() {
      this.$dialog.confirm({
        title: '转认证确认',
        message: '企业认证还未完成，是否中止企业认证，转为个人认证？',
        confirmButtonColor: '#1BB295'
      }).then(async () => {
        await this.$api.stopAuthCompany({ memberSid: this.memberSid })
        location.reload()
      }).toast()
    }
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  },
  components: {
    VanIcon: Icon,
    Steps,
    CertificationInfo
  },
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";
.icon-tips{
  align-items: center;
}
.as-view{
  @extend %w100;
  @extend %bsb;
  height: 100%;
  background-color: #f5f5f5;
}
.certification-warning{
  @extend %df;
  @extend %df1;
  @extend %aic;
  margin-top: j(10);
  padding: j(12) j(16);
  font-size: j(14);
  color: #666;
  background-color: #fff;
}
.certification-warning > p {
  @extend %df1;
  margin-left: j(6);
}
.certification-title{
  @extend %df;
  @extend %df1;
  font-size: j(14);
  margin-top: j(8);
  padding: j(8) j(16);
}
.steps-box{
  padding: j(16) j(16) 0 j(16);
}
.steps-btn{
  @extend %bn;
  @extend %ao8;
  color: #999;
  height: j(30);
  font-size: j(14);
  background-color: transparent;
  & span{
    margin-right: j(6);
  }
  &.is-completed{
    @extend %ao8;
    @extend %bsb;
    width: j(64);
    color: $green;
    border: 1px solid $green;
    border-radius: j(4);
    & span{
      margin-right: 0;

    }
  }
  &.is-active{
    &:active{
      opacity: 1;
    }
  }
  &.is-fail{
    @extend %ao8;
    @extend %bsb;
    color: $orange;
    width: j(70);
    border: 1px solid $orange;
    border-radius: j(4);
    height: j(30);
  }
}



.steps-tip{
  @extend %df;
  @extend %df1;
  @extend %bsb;
  vertical-align: middle;
  color: $orange;
  margin-left: j(18);
  font-size: j(12);
  & > p{
    margin-left: j(6);
  }
}
.steps-tip-text{
  @extend %df;
  @extend %df1;
  @extend %bsb;
  vertical-align: middle;
  color: $orange;
  margin-top: j(10);
  line-height: j(12);
  font-size: j(12);
  padding: j(12) j(6);
  background: rgba(247,138,90,0.08);
  border-radius: j(4);
  & > p{
    margin-left: j(6);
  }
}
.tips-steps-block{
  width: 100%;
}
.tips-steps{
  @extend %df;
  @extend %jcs;
  @extend %aic;
  margin: j(7) 0 ;
}
.tips-steps-label{
  font-size: j(14);
  color: #999;
  &-finished {
    color: #333;
  }
}
.certification-transform {
  @extend %df;
  @extend %jcc;
  @extend %ao8;
  color: #1BB295;
  padding: j(16) 0;
  margin-top: j(16);
  font-size: j(15);
  background-color: #fff;
}
.orange {
  color: $orange;
  background-color: rgba(247,138,90,0.08);
}
.certification-warning {
  button {
    @extend %ao8;
    border: j(1) solid #1BB295;
    border-radius: j(4);
    padding: j(5) j(12);
    color: #1BB295;
    background-color: #fff;
  }
}
.no-margin-top{
  margin-top: 0;
}
</style>
