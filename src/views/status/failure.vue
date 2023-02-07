<template>
  <as-view title="认证失败" class="certification-status" :use-left-event="false" @left="handleBack">
    <div class="status-header">
      <img :src="require('src/assets/images/failure.png')" alt="">
      <h1>认证失败</h1>
      <p>无法确认为同一人</p>
    </div>
    <div class="status-body">
      <h1>核对身份信息</h1>
      <component v-for="(item,key) in objInfo"
                 :key="key"
                 :is="item.is"
                 v-bind="item"
      />
      <div style="flex: 1"></div>
      <div class="btn-box">
        <button @click="$router.replace('/person-steps')">退出认证</button>
        <button @click="handleTryAgain">再试一次</button>
      </div>
    </div>
  </as-view>
</template>

<script>
export default {
  name: "failure",
  data() {
    return {
      objInfo: {
        memberName: {
          label: '姓名',
          value: '',
          is: 'as-cell'
        },
        memberCardType: {
          label: '证件类型',
          value: '身份证',
          is: 'as-cell'
        },
        memberCardNo: {
          label: '证件号码',
          value: '',
          is: 'as-cell'
        },
        memberSid: {
          value: ''
        }
      },
      objFrom: {
        authId: {
          value: ''
        },
        auditStatus: {
          value: ''
        },
        auditBackReason: {
          value: ''
        }
      },
    }
  },
  beforeRouteEnter(to, from, next){
    console.log(to)
    const { query } = to
    const { authId, status: auditStatus  } = query
    next(vm => {
      vm.info = query
      vm.$banana.assignment(query, vm.objInfo)
      vm.$banana.assignment({authId, auditStatus}, vm.objFrom)
      // vm.handleAuthCallback(authId, auditStatus)
      console.log(vm.$banana.extract(vm.objFrom))
      console.log(vm.objInfo)
    })
  },
  methods: {
    handleBack() {
      this.$router.replace({path:'/person-steps'})
    },
    async handleAuthCallback(authId, auditStatus, auditBackReason = '无法确认为同一人'){
      await this.$api.callBackAuthMember({
        authId,
        auditStatus,
        auditBackReason
      })
    },
    async handleTryAgain() {
      const { memberName, memberCardNo, memberSid } = this.$banana.extract(this.objInfo)
      const { authId } = this.$banana.extract(this.objFrom)
      await this.$api.initAuthMember({
        authId,
        successPage: `${this.$constant.QIYUESUO_SUCCESS_PAGE}?authId=${authId}&memberSid=${memberSid}`,
        endPage: `${this.$constant.QIYUESUO_END_PAGE}?memberName=${memberName}&memberCardNo=${memberCardNo}&authId=${authId}&memberSid=${memberSid}`
      }).then(res => {
        const { memberSid, linkUrl, cellphone } = res
        console.log('initAuthMember =>',res)
        window.location.href = linkUrl
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
  @extend %w100;
  @extend %h100;
  @extend %bsb;
  background-color: #f5f5f5;
}
.status-header{
  @extend %df;
  @extend %fdc;
  @extend %aic;
  padding: j(56) 0;
  background-color: #fff;
  & img{
    width: j(64);
    height: j(64);
  }
  & h1{
    margin-top: j(20);
    font-size: j(20);
  }
  & p{
    margin-top: j(6);
    font-size: j(14);
    color: #666;
  }
}
.status-body{
  @extend %df;
  @extend %fdc;
  @extend %df1;
  margin-top: j(10);
  padding: j(16);
  background-color: #fff;
  & h1{
    font-size: j(14);
    margin-bottom: j(16);
  }
}
.btn-box{
  @extend %df;
  @extend %pf;
  @extend %l0;
  @extend %r0;
  justify-content: space-around;
  bottom: j(106);
  text-align: center;
  background-color: #fff;
  & button{
    @extend %bn;
    @extend %ao8;
    height: j(44);
    color: $white;
    width: j(160);
    font-size: j(14);
    border-radius: j(4);
    background-color: $green;
  }
  & button:nth-child(1){
    border: 1px solid $green;
    color: $green;
    background-color: #fff;
  }
}

/deep/ .as-cell{
  padding-left: 0;
  padding-right: 0;
}
</style>
