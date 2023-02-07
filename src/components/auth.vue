<template>
  <div class="name-auth">
    <steps class="auth-steps"
           :steps="computedProgress"
           :is-bold-title="false"
           :direction="'horizontal'"
           :active-step="activeStep"
    />
    <div class="certification-warning">
      <van-icon name="warning-o" color="#BCBEC0"></van-icon>
      <p>请务必提供本人真实有效的身份信息，便于后续竞拍车辆及退还保证金操作；如果信息虚假或错误，产生纠纷，由个人负责！</p>
    </div>
    <div class="certification-form">
      <span>身份证信息清晰无遮挡，不支持自拍及镜像图片</span>
      <div class="certification-idcard">
        <div class="certification-idcard-img" v-for="(item, key) in idCardForm" :key="key">
          <img :src="computedIdCardSrc(item)"
               alt=""
               @click="handleUploadIdCard(key,item)">
          <img class="certification-idcard-change"
               :src="require('src/assets/images/exchange_picture.png')"
               v-if="item.value"
               alt="" @click.stop="handleUploadIdCard(key,item)">
          <span>{{ key === 'memberCardPic1' ? '上传证件正面照片' : '上传证件反面照片' }}</span>
        </div>
      </div>
    </div>
    <div class="certification-form">
      <component v-for="(item, key) in computedForm"
                 :key="key"
                 :is="item.is"
                 v-bind="item"
                 v-model="item.value"
      />
    </div>
<!--    <div class="certification-agree">-->
<!--      <van-checkbox v-model="isAgreed" shape="square" icon-size="14px" checked-color="#1BB295"/>-->
<!--      <p>阅读并同意<span>《汽车街认证服务协议》</span></p>-->
<!--    </div>-->
    <div class="certification-submit-box">
      <div class="certification-submit" :class="{'disabled': computedIsAgreed}" @click="submit">进行身份核验</div>
    </div>
  </div>
</template>

<script>
import {Checkbox, Icon} from 'vant'
import Steps from "./steps"
import {dataURLtoFile} from "../utils/common";
import {mapState} from "vuex";

export default {
  name: "auth",
  props:{
    isPerson: {type: Boolean, default: true},
    activeStep: {type: Number, default: 2}
  },
  data() {
    const cityOptions = () => this.$api.getAuthMemberCities()
      .then(res => {
        return res.map(k => {
          const {citys, provinceName, provinceAbbr} = k
          let children = citys.map(item => {
            const {cityName, cityAbbr} = item
            return {label: cityName, value: cityName}
          })
          return {label: provinceName, value: provinceName, children}
        })
      })
    return {
      isAgreed: false,
      baseImageUrl: 'http://images.autostreets.com/',
      idCardForm: {
        memberCardPic1: {
          src: require('src/assets/images/id_card_front.png'),
          label: '正面',
          disabled:false,
          // value: 'group1/M00/55/38/10f2f6112f67451a889ec2e18fdd0d49.jpg',//
          value: '',//group1/M00/55/38/10f2f6112f67451a889ec2e18fdd0d49.jpg
          rules: [
            { required: true, message: '请上传证件正面照片' },
          ]
        },
        memberCardPic2: {
          src: require('src/assets/images/id_card_back.png'),
          label: '反面',
          disabled:false,
          // value: 'group1/M00/60/D5/1044802cf3784233bea8fe7846277315.jpg', //
          value: '', //group1/M00/60/D5/1044802cf3784233bea8fe7846277315.jpg
          rules: [
            { required: true, message: '请上传证件反面照片' },
          ]
        }
      },
      objForm: {
        memberName: {
          is:'as-field',
          label: '姓名',
          placeholder: '请填写本人真实姓名',
          value: '',
          clearable: true,
          maxlength: '30',
          disabled: false,
          rules: [
            { required: true, message: '请填写您的姓名' },
          ]
        },
        memberCardNo: {
          is:'as-field',
          label: '身份证号',
          placeholder: '请填写本人真实身份证号',
          value: '',
          clearable: true,
          disabled: false,
          maxlength: 18,
          rules: [
            { required: true, message: '请填写您的身份证号' },
            { validator: this.$regular.regIdCard, message: '身份证号码填写有误' },
          ]
        },
        mainCity: {
          is:'as-picker',
          label: '主营城市',
          placeholder: '请选择',
          options: cityOptions,
          value: '',
          formatter: v => [...new Set(v.map(item => item.label || item.value))].join(' ') , //v.map(item => item.label || item.value).join(' ')
          clearable: true,
          labelKey: 'label',
          valueKey: 'value',
          disabled: false,
          isArrow: true,
          rules: [
            { required: true, message: '请填写主营城市' },
          ]
        }
      },
      scanIdInfo: {},
      status: null,
      authId: null,
      isMemberInfo: false //是否有实名认证信息
    }
  },
  beforeRouteEnter(to, form, next){
    next(vm => {
    })
  },
  created(){
    this.handleGetMemberInfo()
  },
  computed: {
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
    computedProgress() {
      const { isPerson } = this
      const { PERSON_STEPS, COMPANY_STEPS } = this.$constant
      return isPerson ? PERSON_STEPS : COMPANY_STEPS
    },
    computedIsAgreed() {
      const { isAgreed, idCardForm, objForm  } = this
      const totalForm = Object.assign({},idCardForm, objForm)
      const total = Object.keys(totalForm).every(k => {return totalForm[k].value !== ''})
      // return !(isAgreed === true && total === true)
      return !(total === true)
    },
    computedForm() {
      return this.bananaFormatForm(this.objForm)
    },
    computedIdCardSrc() {
      return ( item ) => {
        const { value, src } = item
        if(!value) return src
        else return this.baseImageUrl + value
      }
    },
  },
  methods: {
    // async checkMemberCertification() {
    //   const { objForm, idCardForm, memberSid } = this
    //   const { authHistoryInfo, authHistoryStatus, ...res} = await this.$api.checkMemberCertificationStatus({ memberSid })
    //   this.isMemberInfo = !!Object.keys(authHistoryInfo).length
    //   if( Object.keys(authHistoryInfo).length  ){
    //     Object.keys(objForm).forEach(k => {
    //       objForm[k].disabled = true
    //       objForm[k].isArrow = false
    //     })
    //     this.$banana.assignment(authHistoryInfo, {...objForm,...idCardForm})
    //     if(authHistoryInfo.province && authHistoryInfo.city){
    //       objForm.mainCity.value = [
    //         {
    //           label: authHistoryInfo.province,
    //           value: authHistoryInfo.province,
    //         },
    //         {
    //           label: authHistoryInfo.city,
    //           value: authHistoryInfo.city,
    //         }
    //       ]
    //     }
    //     console.log(authHistoryInfo)
    //     idCardForm.memberCardPic1.value = authHistoryInfo.memberCardPic1 || ''
    //     idCardForm.memberCardPic2.value = authHistoryInfo.memberCardPic2 || ''
    //     idCardForm.memberCardPic1.disabled = true;
    //     idCardForm.memberCardPic2.disabled = true;
    //     console.log('idCardForm',idCardForm)
    //   }
    // },
    async handleGetMemberInfo() {
      let { objForm, idCardForm, memberSid } = this
      const { authMemberStatus,  authMemberInfo,authHistoryStatus,authHistoryInfo, ...res} = await this.$api.loadMemberAuthInfo({ memberSid })

      this.status = authMemberStatus
      this.authId = authMemberInfo.id
      // this.isMemberInfo = !!Object.keys(authMemberInfo).length
      // if( Object.keys(authMemberInfo).length ){ //res.authMemberStatus === 0
      //   Object.keys(objForm).forEach(k => {
      //     objForm[k].disabled = true
      //     objForm[k].isArrow = false
      //   })
      if(authHistoryStatus === 1){
        // const { authHistoryInfo, authHistoryStatus, ...res} = await this.$api.checkMemberCertificationStatus({ memberSid })
        this.isMemberInfo = !!Object.keys(authHistoryInfo).length
        if( Object.keys(authHistoryInfo).length  ) {
          Object.keys(objForm).forEach(k => {
            objForm[k].disabled = true
            objForm[k].isArrow = false
          })
          this.$banana.assignment(authHistoryInfo, {...objForm, ...idCardForm})
          if (authHistoryInfo.province && authHistoryInfo.city) {
            objForm.mainCity.value = [
              {
                label: authHistoryInfo.province,
                value: authHistoryInfo.province,
              },
              {
                label: authHistoryInfo.city,
                value: authHistoryInfo.city,
              }
            ]
          }
          console.log(authHistoryInfo)
          idCardForm.memberCardPic1.value = authHistoryInfo.memberCardPic1 || ''
          idCardForm.memberCardPic2.value = authHistoryInfo.memberCardPic2 || ''
          idCardForm.memberCardPic1.disabled = true;
          idCardForm.memberCardPic2.disabled = true;
        }
      }else{
        if([2,3].includes(authMemberStatus) && Object.keys(authMemberInfo).length){
          this.$banana.assignment(authMemberInfo, {...objForm,...idCardForm})
          if(authMemberInfo.province && authMemberInfo.city){
            objForm.mainCity.value = [
              {
                label: authMemberInfo.province,
                value: authMemberInfo.province,
              },
              {
                label: authMemberInfo.city,
                value: authMemberInfo.city,
              }
            ]
          }
          idCardForm.memberCardPic1.value = authMemberInfo.memberCardPic1 || ''
          idCardForm.memberCardPic2.value = authMemberInfo.memberCardPic2 || ''
        }
      }
      //
      // if(Object.keys(authMemberInfo).length === 0){
      //   return this.checkMemberCertification()
      // }
    },
    async submit(){
      let { isAgreed, idCardForm, objForm, scanIdInfo, status, authId, isMemberInfo } = this
      let { mainCity:{ value }, ...form } = objForm
      let [ province = {}, city = {} ] = value
      delete province.children
      Object.assign( form, { province, city })
      const validateForm = Object.assign({}, idCardForm, objForm)
      const submitForm = Object.assign({}, idCardForm, form)
      try {
        this.$banana.validate(validateForm)
      }catch (e) {
        console.log('e',e)
        return this.$toast(e)
      }
      this.$emit('submit', { submitForm, status, authId, isMemberInfo })
    },
    handleUploadIdCard(side,item) {
      if(item.disabled) return
      // if(this.isMemberInfo&& [1,3].includes(this.status)) return
      console.log(side, side.charAt(side.length-1), '上传')
      //type: 1 身份证扫描, memberCardPic: 1正面 2反面
      this.$app.scanCamera({type: 1, memberCardPic: side.charAt(side.length-1)}).then(res=>{
        console.log('scanCamera =>',res)
        const { scanInfo, sourceBase64 } = res
        // if(!scanInfo.length && process.env.NODE_ENV !== 'development' ) return
        const { idCardForm, objForm, baseImageUrl, scanIdInfo } = this
        const [ , memberName, sex, nationality, birth, address, memberCardNo, ...others] = scanInfo
        const base64Url = 'data:image/jpeg;base64,' + sourceBase64;
        if(side === 'memberCardPic1'){
          objForm.memberName.value = memberName
          objForm.memberCardNo.value = memberCardNo
          Object.assign(scanIdInfo, { memberName, memberCardNo })
        }
        this.$api.imageUpload({base64Url}).then( res => {
          console.log('imageUpload =>',res)
          idCardForm[side].value = res.saveUrl
          this.$toast('上传成功')
          this.$emit('upload', res.saveUrl, side)
        })
      })
    }
  },
  components: {
    VanIcon: Icon,
    VanCheckbox: Checkbox,
    Steps
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";
.certification-warning{
  @extend %df;
  vertical-align: middle;
  margin: j(10) 0;
  padding: j(12) j(22);
  font-size: j(14);
  line-height: j(18);
  background-color: $white;
}
.certification-warning > p{
  flex: 1;
  margin-left: j(6);
  color: #666;
}
.certification-form{
  padding: j(12) j(15) 0 j(15);
  background-color: $white;
  & span:first-child:before{
    content: '*';
    color: red;
    margin-right: j(6);
  }
}
.certification-idcard{
  @extend %pr;
  @extend %df;
  @extend %jcs;
  @extend %bsb;
  @extend %bwb;
  padding-top: j(12);
  padding-bottom: j(24);
}
.certification-idcard-img{
  @extend %pr;
  @extend %df;
  @extend %fdc;
  @extend %aic;
  @extend %bsb;
}
.certification-idcard-img > img{
  @extend %pr;
  width: j(145);
  height: j(86);
  padding: j(10);
  background-color: #F2F4F4;
  @extend %cp;
}
.certification-idcard-img > span{
  margin-top: j(12);
}
.certification-idcard-img .certification-idcard-change{
  @extend %pa;
  @extend %b0;
  top: 62%;
  width: j(24);
  height: j(24);
  background-color: transparent;
}
.certification-agree{
  @extend %df;
  @extend %aic;
  margin-top: j(16);
  margin-left: j(15);
  font-size: j(14);
  & p{
    margin-left: j(6);
  }
  & p span{
    color: $green;
  }
}
.certification-submit-box{
  height: j(80);
}
.certification-submit{
  @extend %bn;
  @extend %df;
  @extend %pr;
  @extend %aic;
  @extend %jcc;
  @extend %cp;
  @extend %bsb;
  @extend %cfff;
  @extend %ma;
  @extend %ao8;
  width: j(355);
  height: j(48);
  border-radius: j(4);
  margin: j(16) auto;
  font-size: j(14);
  background-color: $green;
  &.disabled {
    cursor: no-drop;
    opacity: .8;
    &:active{
      opacity: .8;
    }
  }
}
/deep/ .as-cell-value input::placeholder{
  color: #b9b9b9;
}
/deep/ .van-icon-warning-o{
  padding-top: j(2);
}
.auth-steps{
  padding: j(16) j(0);
}
.steps-box{
  justify-content: space-around;
}
/deep/.steps-line__horizontal{
  //width: j(100);
  //left: 135%;
}
/deep/.van-picker__confirm{
  color: $green;
}
</style>
