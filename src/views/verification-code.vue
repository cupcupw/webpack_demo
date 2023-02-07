<template>
  <as-view title="身份验证">
    <div class="code-header">
      <h1>身份验证</h1>
      <p>验证码短信已发送至<span>159****4693</span>，请输入</p>
    </div>
    <van-password-input
      :value="code"
      :mask="false"
      :focused="showKeyboard"
    />
    <van-number-keyboard
      id="keyboard"
      v-model="code"
      :show="showKeyboard"
      theme="custom"
      close-button-text="发送"
      @close="handleFinished"
    />
    <p class="code-btn"
       :class="{'is-disabled': this.seconds > -1}"
       @click="getVerificationCode"
    >{{computedSeconds }}</p>
  </as-view>
</template>

<script>
import {PasswordInput, NumberKeyboard } from 'vant'
import TencentVerify from "../utils/tencentVerify";
export default {
  name: "verification-code",
  data() {
    return {
      code: '',
      showKeyboard: true,
      timer: null,
      seconds: -1,
      isInitial: true,
    }
  },
  computed: {
    computedSeconds() {
      return this.seconds > -1 ?  this.seconds + 's 后重新获取' : this.isInitial ? '获取验证码' : '重新获取验证码'
    }
  },
  methods: {
    handleFinished() {
      const { code } = this
      if(!code || code.length < 6) return
      console.log(this.code)
    },
    getVerificationCode(){
      if(this.seconds > -1) return
      TencentVerify.open().then(async (res) => {
        if (res.success) {
          // const response = await this.$api.sendCode({cellphone: phone.value})
          // if(response.success){
            this.$toast('验证码已发送成功')
            this.isInitial = false
            this.timer = 60
            this.getTime(this.timer)
          // }
        }
      }).catch(err => {console.log(err)})
    },
    getTime(duration) {
      this.timer && clearTimeout(this.timer)
      if (duration < -1) return
      this.seconds = duration || 0;
      this.timer = setTimeout(() => {
        this.getTime(duration - 1);
      }, 1000);
    },
  },
  components: {
    VanPasswordInput: PasswordInput,
    VanNumberKeyboard: NumberKeyboard
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";
.code-header{
  padding: j(16);
  font-size: j(14);
  & h1{
    font-size: j(20);
    margin-bottom: j(6);
  }
}
.code-btn{
  @extend %df;
  @extend %jce;
  @extend %cp;
  padding: j(16);
  font-size: j(14);
  color: $green;
}
.is-disabled{
  color: #666;
}

/deep/.van-key--blue{
  background-color: $green;
}
/deep/.van-key__wrapper:nth-child(11){
  display: none;
}
/deep/.van-key--blue.van-key--active{
  opacity: .8;
}
</style>
