<template>
  <as-view title="竞拍认证" class="index" :use-left-event="false" @left="$app.backToApp">
    <div v-for="(item, key) in form"
         :key="item.index"
         class="certification-box"
         :class="`certification-${key}`"
         @click="handleJump(item, key)"
    >
      <img :src="item.imgUrl" class="certification-icon" alt="">
      <span>{{ item.label }}</span>
      <van-icon name="arrow" size="18px" color="#C4C4C4"/>
    </div>
    <div class="certification-tip">
      <van-icon name="warning-o" size="18px" color="#BCBEC0"/>
      <p>根据国家规定，参加二手车拍卖前需要进行个人或企业资质认证并且需要签署竞拍协议，否则将不能参与二手车拍卖活动。</p>
    </div>
    <van-dialog  v-model="show"
                 title="企业认证提示"
                 :confirm-button-text="computedSeconds"
                 :class="{'next': !cancelButton}"
                 @closed="handleClosed"
    >
      <div class="message-content">
        进行企业认证前需同时满足以下三个条件：<br>
        1、保证金金额为0元 <br>
        2、没有未付款的订单 <br>
        3、没有处理中的仲裁 <br>
        您目前不符合以上条件，无法进行企业认证。您可以联系您的专属客服或拨打<a class="phone-color" href="tel:400-820-8889"><u>400-820-8889</u></a>咨询。
      </div>
    </van-dialog>
  </as-view>
</template>

<script>
import {Icon, Dialog} from 'vant'
import {$api} from 'src/plugins/api'
import { mapState } from 'vuex'
import {cache} from "as-cocoon/plugins/storage/index";


export default {
  name: "index",
  data() {
    return {
      form: {
        person: {
          label: '个人认证',
          imgUrl: require('../assets/images/person_certification.png'),
          path: '/person-certification'
        },
        company: {
          label: '企业认证',
          imgUrl: require('../assets/images/company_certification.png'),
          path: '/certification-process'
        }
      },
      timer: null,
      seconds: -1,
      show: false,
      cancelButton: true,
      isCancel: false,
      src: '',
      result: {}
    }
  },
  computed: {
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
    computedSeconds() {
      return this.seconds > 0 ? this.seconds + '秒后可确认' : '确认'
    }
  },
  async beforeRouteEnter(to, from, next) {
    let memberSid = cache.getItem('$$MEMBER_SID')
    let { authCategory } = await $api.loadMemberAuthInfo({memberSid})
    if(authCategory){
      next({
        path: '/person-steps',
        replace: true
      })
    }else {
      next()
    }
  },
  methods: {
    async loadMemberAuthInfo() {
      const { memberSid } = this
      return await this.$api.loadMemberAuthInfo({ memberSid }).then(res => {
        const { authCategory } = res
        if(authCategory){
          return '/person-steps'
        }
      })
    },
    handleJump(item, key) {
      const { path , label } = item
      if( label === '企业认证' ){
        this.$api.checkAuthCompany({
          memberSid:this.memberSid
        }).then(res => {
          this.$router.push({
            path,
            query:{
              type:2
            }
          })
        }).catch(res=>{
          this.show = true
          return
        })
      }else{
        this.$router.push({
          path,
          query:{
            type:1
          }
        })
      }
    },
    handleClosed(){
      console.log(123)
      // !this.isCancel && this.$router.push('/company')
    },
    getTime(duration) {
      this.timer && clearTimeout(this.timer);
      if (duration < -1) return
      this.seconds = duration ;
      this.timer = setTimeout(() => {
        this.getTime(duration - 1);
      }, 1000);
    },
  },
  components: {
    VanIcon: Icon,
    VanDialog: Dialog.Component
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";

.index {
  //@extend %w100;
  @extend %h100;
  @extend %bsb;
  padding: j(16);
}

.certification-box {
  @extend %df;
  @extend %aic;
  @extend %bsb;
  @extend %w100;
  @extend %cp;
  height: j(96);
  margin-bottom: j(16);
  padding: j(16);
}

.certification-box > span {
  flex: 1;
  padding-left: j(14);
  font-size: j(16);
}

.certification-person {
  background: url("../assets/images/person_bg.png") no-repeat center;
  background-size: cover;
}

.certification-person > span {
  color: $orange;
}

.certification-company {
  background: url("../assets/images/company_bg.png") no-repeat center;
  background-size: cover;
}

.certification-company > span {
  color: $green
}

.certification-icon {
  width: j(51);
  height: j(62);
}

.certification-tip {
  @extend %df;
  @extend %df1;
  @extend %jcs;
  height: j(60);
  line-height: j(16);
  font-size: j(14);
  color: #666;
  vertical-align: middle;
}

.certification-tip > i {
  @extend %df;
}

.certification-tip > p {
  @extend %df;
  //width: j(316);
  margin-left: j(6);
  font-size: j(14);
}

/deep/.van-dialog__confirm{
  background-color: $white;
  color: $green;
  font-weight: bold;
}

/deep/.van-dialog__cancel{
  background-color: #F3F3F3;
}

/deep/.van-dialog__message{
  padding: 26px 28px;
}
/deep/.van-dialog{
  width: j(327);
}
.next{
  /deep/.van-dialog__confirm{
    background-color: #F3F3F3;
    color: $green;
  }
}
.message-content{
  padding: j(15) j(30);
  .phone-color{
    color:#1BB295
  }
}
</style>
