<template>
  <as-view class="company" :useLeftEvent="false" @left="handleLeft">
    <div class="company_content">
      <div v-if="process === 3 && isWarning"  class="download-tip tips warning">
        <van-icon class="icon" size="20px" name="warning-o" />
        如果您修改了企业信息，请重新下载
      </div>
      <steps :steps="$constant.COMPANY_STEPS"
             :class="{'steps-top': process === 3 && isWarning}"
             :is-bold-title="false"
             :direction="'horizontal'"
             :active-step="3"
      />
      <div class="top_blc" />
      <div v-if="process === 1" class="process_1">
        <div class="tips">
          <van-icon class="icon" size="20px" name="warning-o" />
          <div>
            请务必提供本公司真实有效的信息并请确保营业执照注册时间在2周以上。
          </div>
        </div>
        <div class="from_body">
          <component
              v-for="(item,index) in computedForm"
              :key="index"
              v-bind="item"
              :disabled="process !== 1"
              :is="item.is"
              :isArrow="process !== 3"
              v-model="item.value"
              @upload = " handleUpload(...arguments , item)"
              @remove = "handleRemove(...arguments )"
          ></component>
        </div>
<!--        <div class="certification-agree">-->
<!--          <van-checkbox v-model="isAgreed" shape="square" icon-size="14px" checked-color="#1BB295"/>-->
<!--          <p>阅读并同意<span>《汽车街认证服务协议》</span></p>-->
<!--        </div>-->
      </div>
      <div v-if="process === 2" class="process_2">
        <van-collapse v-model="activeCollapse">
          <van-collapse-item :class="{'active-collapse': activeCollapse.includes('1')}" title="企业信息" name="1">
            <component
              v-for="(item,index) in computedShowForm"
              :key="index"
              v-bind="item"
              disabled
              :is="item.is"
              :isArrow="process !== 2"
              v-model="item.value"
              @upload = " handleUpload(...arguments , item)"
              @remove = "handleRemove(...arguments )"
            ></component>
          </van-collapse-item>
          <as-field :class="{'active': !activeCollapse.includes('1')}" v-if="!activeCollapse.includes('1')" disabled v-bind="computedForm.companyName" />
          <van-collapse-item :class="{'active-collapse': activeCollapse.includes('2')}" title="委托人信息" name="2">
            <component
              v-for="(item,index) in showBlock"
              :key="index"
              v-bind="item"
              disabled
              :is="item.is"
              v-model="item.value"
              @upload = " handleUpload(...arguments , item)"
              @remove = "handleRemove(...arguments )"
            >
              <template v-slot:suffix>
                <button @click="handlePreviewAgreement(item.nameValue, item.label)">查看协议</button>
              </template>
            </component>
          </van-collapse-item>
          <as-field :class="{'active': !activeCollapse.includes('2')}" v-if="!activeCollapse.includes('2')" disabled v-bind="showBlock.memberName" />
        </van-collapse>
        <div class="account_mode">
          <div class="account_title">
            <span>对公账户信息</span>
            <span @click="handleAddAccount">
              <van-icon name="plus" size="14px" style="font-weight: 600"/> 添加对公账户</span>
          </div>
          <div class="account_card" v-for="(v, index) in accountArr" :key="index">
            <component v-for="(item, index) in v" :is="item.is" v-model="item.value" :key="index" v-bind="item" />
            <button v-if="v.isOwnner.value" class="account-btn" @click="handleRemoveAccount(index)">删除该账户</button>
          </div>
        </div>
      </div>
      <div v-if="process === 3" class="process_3" :class="{'is-margin-top': isWarning}">
        <div class="tips">
          <van-icon class="icon" size="20px" name="warning-o" />
          <div>
            请将《{{ files.length>0? files[0].name:'' }}》以及《{{ files.length>0? files[1].name:'' }}》下载到手机，使用A4纸打印后填写、盖章并拍照上传。
          </div>
        </div>
        <div class="download_materials">
          <div class="down_btn" v-for="(item,index) in files" @click="download(index,item.name)" size="large" >点击下载《{{item.name}}》</div>
        </div>
      </div>
      <div v-if="process === 4" class="process_4">
        <div class="from_body">
          <component
              v-bind="uploadMaterial"
              :is="uploadMaterial.is"
              v-model="uploadMaterial.value"
              @upload = " handleUpload(...arguments )"
              @remove = "handleRemove(...arguments )"
          ></component>
        </div>
      </div>
    </div>
    <div class="submit_content">
      <button class="cancel_button" v-if="process === 3" @click="$app.backToApp()">
        {{`准备材料，暂不继续`}}
      </button>
      <button class="submit_button" @click="handleSaveReport">
        {{(process === 3 ? '上传材料': process === 4 ? '提交申请' : '下一步' )+` (${process}/4)`}}
      </button>
    </div>
    <preview-agreement-popup ref="agreement"/>
  </as-view>
</template>

<script>
import { Icon as VanIcon , Button as VanButton , Checkbox as VanCheckbox , Collapse as VanCollapse, CollapseItem as VanCollapseItem, Toast } from 'vant'
import UploadMaterial from "./components/upload-material";
import Steps from "src/components/steps"
import { mapState } from 'vuex'
import image from "../../utils/image";
import {$api} from "../../plugins/api";
import {$app} from "../../plugins/app";
import {BASE_IMAGE_URL} from "../../plugins/constant";
import PreviewAgreementPopup from "./components/preview-agreement-popup.vue";

export default {
  name: "index",
  data(){
    const bankOptions = () => this.$api.getBankList(res => {return res})
    return {
      // isAgreed:false,
      baseImageUrl: 'http://images.autostreets.com/',
      process: 1,
      disable:false,
      files:[],
      uploadMaterial:{
        is:'upload-material',
        label: '上传材料照片',
        isMaterial: true,
        sources:[
          {
            label: '上传营业执照照片',
            picLabel:'营业执照照片',
            url: ''
          },
          {
            label: '上传开户登记表',
            picLabel:'开户登记表',
            url: ''
          },
          {
            label: '上传委托授权书',
            picLabel:'委托授权书',
            url: ''
          }
        ]
      },
      showBlock:{
        memberName:{
          is:'as-field',
          label: '委托人姓名',
          value:'',
        },
        memberCardNo:{
          is:'as-field',
          label: '委托人身份证号',
          value:'',
        },
        mainCity:{
          is:'as-field',
          label: '主营城市',
          set:(data,item)=>{
            let { province , city } = data
            let val = province === city? province:province + city;
            item.value = val
            item.province = province
            item.city = city
          },
          province:'',
          city:'',
          value:'',
        },
        authAgree: {
          is: 'as-cell',
          label: '用户参拍协议签署日期',
          value: '',
          set: (data, item) => {
            item.value = data.authAgreeConfirmTime.split(' ')[0]
            item.nameValue = data.authAgreeNameValue
          }
        },
        vasAgree: {
          is: 'as-cell',
          label: '增值服务协议签署日期',
          value: '',
          set: (data, item) => {
            item.value = data.vasAgreeConfirmTime.split(' ')[0]
            item.nameValue = data.vasAgreeNameValue
          }
        },
        uploadMaterial:{
          is:'upload-material',
          label: '身份证照片',
          value:'',
          set:(data,item)=>{
            item.sources[0].url = data.memberCardPic1;
            item.sources[1].url = data.memberCardPic2;
            console.log('uploadMaterial',item);
          },
          sources:[
            {
              label: '证件正面照片',
              picLabel:'证件正面照片',
              url: ''
            },
            {
              label: '证件反面照片',
              picLabel:'证件反面照片',
              url: ''
            },
          ],
        }
      },
      objForm:{
        companyName:{
          is:'as-field',
          label: '企业名称',
          // value:'邹城润德汽车销售服务有限公司',
          value:'',
          placeholder:'请填写企业名称',
          rules: [
            { required: true, message: '请填写企业名称' }
          ],
        },
        companyRegNo:{
          is:'as-field',
          label: '企业注册号',
          // value:'913708836944110819',
          value:'',
          placeholder:'请填写企业注册号',
          rules: [
            { required: true, message: '请填写企业注册号' }
          ],
        },
        companyType:{
          is:'as-picker',
          label: '企业类型',
          value: '',
          placeholder:'请填写企业类型',
          valueKey:'value',
          labelKey:'name',
          options: [],
          rules: [
            { required: true, message: '请选择企业类型' }
          ],
        },
        legalPerson:{
          is:'as-field',
          label: '法人姓名',
          value:'',
          // value:'罗军',
          placeholder:'请填写法人姓名',
          rules: [
            { required: true, message: '请填写法人姓名' }
          ],
        },
        legalCardType: {
          is: 'as-radio',
          label: '法人证件类型',
          value: '',
          options: [],
          labelKey: 'name',
          rules: [
            { required: true, message: '请选择法人证件类型' }
          ]
        },
        legalCardNo:{
          is:'as-field',
          label: '法人证件号',
          // value:'372330197406241878',
          value:'',
          placeholder:'请填写法人证件号',
          rules: [
            { required: true, message: '请填写法人证件号' },
            {
              validator: (val) => {
                const { legalCardType: { value: type, options } } = this.objForm
                const { name } = options.find(v => +v.value === +type)
                if (name === '身份证') {
                  return this.$regular.regIdCard.test(val)
                }
                else if (name === '护照' ) {
                  const reg = /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/;
                  return reg.test(val)
                }
                else if (name === '港澳证') {
                  const reg =  /^(\d{9}|\d{10}|\d{11})$/;
                  return reg.test(val)
                }
              },
              message: '证件号码填写有误'
            }
          ],
        },

      },
      objAccount: {
        accountName: {
          is: 'as-field',
          label: '账户名称',
          value: '固定为企业名称', //固定为企业名称
          placeholder: '',
          disabled: true,
        },
        bankCode: {
          is: 'as-field',
          label: '银行账号',
          value: '',
          placeholder: '请填写银行账号',
          type: 'number',
          disabled: false,
          clearable: true,
          rules: [
            {required: true, message: '请填写银行账号'},
            {
              validator: (val) => {
                return /^[1-9]\d{9,29}$/.test(val)
              },
              message: '请输入正确的银行账号'
            }
          ],
        },
        bankName: {
          is: 'as-picker',
          label: '开户银行',
          value: '',
          placeholder: '请选择开户银行',
          clearable: false,
          filterable: true,
          disabled: false,
          labelKey: 'name',
          valueKey: 'name',
          options: bankOptions,
          rules: [
            {required: true, message: '请选择开户银行'}
          ],
        },
        subbranchBank: {
          is: 'as-field',
          label: '开户支行',
          value: '',
          placeholder: '请填写开户支行',
          clearable: true,
          disabled: false,
          rules: [
            {required: true, message: '请填写开户支行'}
          ],
        },
        isOwnner: {
          value: 1
        },
        companyRegNo: {
          value: ''
        }
      },
      accountArr: [],
      activeCollapse: [],
      isWarning: false,
    }
  },
  computed: {
    $app() {
      return $app
    },
    computedForm () {
      return this.bananaFormatForm(this.objForm)
    },
    computedShowForm() {
      let form = this.bananaFormatForm(this.objForm)
      const { legalCardType: { options, value } } = form
      const { name } = options.find(v => v.value === value)
      form.legalCardType.is = 'as-field'
      form.legalCardType.value = name
      return form
    },
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
  },
  watch: {
    process () {
      this.$nextTick(() => {
        this.objForm.companyType.options = [...this.objForm.companyType.options]
      })
    },
  },
 async created(){
    await this.init()
  },
  methods: {
    async init(){
      const { memberSid } = this
      const toast = this.$toast.loading({ duration: 0 })
      const [
        companyTypeOptions,
        legalCardTypeOptions,
        files,
        companyInfo,
        memberInfo
      ] = await Promise.all([
        this.$api.queryCompanyType(false),
        this.$api.getLegalCardType(false),
        this.$api.queryAuthCompanyFiles(false),
        this.$api.initAuthCompanyInfo({ memberSid }, false),
        this.$api.initAuthMemberInfo({ memberSid }, false),
      ])
      this.objForm.companyType.options = companyTypeOptions
      this.objForm.legalCardType.options = legalCardTypeOptions
      this.files = files.reverse()
      const {
        entrustFileUrl,
        businessLicenseUrl,
        auctionAgreeUrl,
        companyType = '',
        legalCardType = '',
        ...company
      } = companyInfo
      this.$banana.assignment({
        companyType:  companyType + '',
        legalCardType: legalCardType + '',
        ...company,
      }, this.objForm)
      this.$banana.assignment(memberInfo, this.showBlock)
      this.uploadMaterial.sources[0].url = entrustFileUrl || '';
      this.uploadMaterial.sources[1].url = businessLicenseUrl || '';
      this.uploadMaterial.sources[2].url = auctionAgreeUrl || '';

      toast.close()
    },
    async download(index, name){
      const toast1 = Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      let { memberSid, objForm } = this
      objForm = this.$banana.extract(objForm)
      // index 0 开户登记表 1 委托授权书
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = index === 0 ? require('src/assets/images/auction_agree.png') : require('src/assets/images/entrust_file.png')
      img.onload = async function () {
        const { authMemberInfo } = await $api.loadMemberAuthInfo({ memberSid }, false)
        const legalCardTypeName = objForm.legalCardType
        canvas.width = img.width
        canvas.height = img.height
        ctx.font = '20px PingFang SC'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        if (name === '委托授权书') {
          ctx.fillText(`${objForm.companyName}`, 340, 356) //开户申请及授权公司 companyName
          ctx.fillText(`${objForm.companyRegNo}`, 340, 416) //统一社会信用代码 companyRegNo
          ctx.fillText(`${authMemberInfo.memberName}`, 340, 510) //经办人 memberName
          ctx.fillText(`${authMemberInfo.memberCardNo}`, 340, 570) //身份证 memberCardNo
        }
        else if (name === '开户登记表') {
          ctx.fillText(`${objForm.companyName}`, 380, 370) //companyName 公司名称
          ctx.fillText(`${objForm.companyRegNo}`, 380, 436) //companyRegNo 营业执照代码
          ctx.fillText(`${objForm.legalPerson}`, 380, 502) //legalPerson 法定代表人
          ctx.fillText(`${legalCardTypeName}`, 880, 502) //legalCardTypeName 法人证件类型
          ctx.fillText(`${objForm.legalCardNo}`, 380, 570) //legalCardTypeName 法人证件号
          ctx.fillText(`${authMemberInfo.memberName}`, 380, 636) //memberName 委托参拍人姓名
          ctx.fillText(`${authMemberInfo.memberPhone}`, 880, 636) //memberPhone 委托参拍人联系电话
          ctx.fillText(`${authMemberInfo.memberCardNo}`, 380, 704) //memberCardNo 委托参拍人身份证号
        }
        const url = canvas.toDataURL('image/png')
        let { saveUrl } = await $api.imageUpload({ base64Url: url }, false)
        if (!saveUrl.startsWith('http')) saveUrl = BASE_IMAGE_URL + saveUrl
        console.log(saveUrl)
        $app.downloadImage({image: saveUrl}).then(res => {
          setTimeout(()=>{
            toast1.clear();
            if(Number(res.success) === 1){
              return Toast('保存成功')
            }else{
              return Toast('保存失败')
            }
          },500)
        })
      }
    },
    async handleSaveReport() {
      const { memberSid } = this
      if (this.process === 1) {
        this.$banana.validate(this.objForm)
        const toast = this.$toast.loading({ duration: 0 })
        const { companyRegNo, companyName, legalPerson } = this.$banana.extract(this.objForm);
        await Promise.all([
          this.$api.checkRealCompany({ companyRegNo, companyName, legalPerson }, false),
          this.$api.savePreAuthCompanyInfo({ ...this.$banana.extract(this.objForm), memberSid }, false),
        ])
        const initAuthCompanyInfo = await this.$api.initAuthCompanyInfo({ memberSid }, false)
        initAuthCompanyInfo.companyType += ''
        initAuthCompanyInfo.legalCardType += ''
        this.objAccount.accountName.value = initAuthCompanyInfo.companyName
        this.objAccount.companyRegNo.value = initAuthCompanyInfo.companyRegNo
        this.$banana.assignment(initAuthCompanyInfo, this.objForm)
        const arr = await this.$api.initAuthBankInfo({memberSid, companyRegNo: initAuthCompanyInfo.companyRegNo})
        let obj = JSON.parse(JSON.stringify(this.objAccount))
        arr.forEach(v => {
          this.$banana.assignment(v, obj)
          Object.keys(obj).forEach(k => obj[k].disabled = true)
          if (!v.isOwnner) { obj['bankName'].isArrow = false }
          this.accountArr.push(obj)
          obj = JSON.parse(JSON.stringify(this.objAccount))
        })
        toast.close()
        this.process += 1
      }
      else if (this.process === 2) {
        let bankInfos = []
        let repeat = []
        for (let i = 0; i < this.accountArr.length; i++) {
          let bankCode = ''
          let obj = this.$banana.extract(this.accountArr[i])
          Object.keys(obj).forEach(v => {
            if (v.includes('bankCode')) bankCode = obj[v]
          })
          if(!repeat.includes(bankCode)) {
            repeat.push(bankCode)
          }else {
            return this.$toast('银行卡号不能重复')
          }
          this.$banana.validate(this.accountArr[i]);
          let formatObj = {}
          Object.keys(obj).forEach(v => {
            formatObj[v.split('-')[0]] = obj[v]
          })
          bankInfos.push(formatObj)
        }
        if (!bankInfos.length) { return this.$toast('请添加对公账户') }
        await this.$api.savePreAuthBankInfo({
          memberSid,
          bankInfos: JSON.stringify(bankInfos)
        })
        this.$api.changeAuthCompany({memberSid: this.memberSid}).then(res => {
          console.log('res =>',res)
        }).catch(err => {
          this.isWarning = true
        })
        this.process += 1
      }
      else if (this.process === 3) {
        this.process += 1
      }
      else if (this.process === 4) {
        if(this.disable) return
        const { memberSid } = this;
        const [ businessLicenseUrl, auctionAgreeUrl, entrustFileUrl ] = this.uploadMaterial.sources.map(item => item.url)
        if( !entrustFileUrl || !businessLicenseUrl || !auctionAgreeUrl ){
          return Toast('请上传材料照片')
        }
        this.disable = true
        this.$api.submitAuthCompany({
          memberSid,
          entrustFileUrl,
          businessLicenseUrl,
          auctionAgreeUrl
        }).then(() => {
          this.$router.replace('/person-steps')
        }).finally(() => {
          this.disable = false
        })
        return
      }
    },
    handleUpload(url , index ){
      console.log(...arguments)
      this.$set(this.uploadMaterial.sources[index] , 'url' , url );
    },
    handleRemove(index ,item){
      console.log(index ,item)
      this.$set(item , 'url' , '' );
    },
    handleLeft(back){
      this.$dialog.confirm({
        title: '退出确认',
        message: '退出后当前信息不会保存',
        confirmButtonColor: '#1BB295'
      }).then(() => {
        this.$router.replace('/person-steps')
      }).toast()

    },
    handleAddAccount() {
      console.log(1, this.objAccount)
      const index = this.accountArr.length
      const obj = {}
      Object.keys(this.objAccount).forEach(v => {
        ['isOwnner', 'companyRegNo'].includes(v)  ? obj[v] = {...this.objAccount[v]} : obj[v+'-'+index] = {...this.objAccount[v]}
      })
      this.accountArr.unshift(obj)
    },
    handleRemoveAccount(index) {
      this.accountArr.splice(index, 1)
      console.log(index, this.accountArr)
    },
    handlePreviewAgreement(nameValue, title) {
      title = title.split('签署日期')[0]
      this.$refs.agreement.show(nameValue, title)
    }
  },
  components:{
    PreviewAgreementPopup,
    VanIcon,
    VanButton,
    VanCheckbox,
    Steps,
    UploadMaterial,
    VanCollapse,
    VanCollapseItem,
  },

}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/define";
.top_blc{
  height: j(96);
}
.company{
  height: 100%;
  background-color: #F5F5F5;
  &::v-deep{
    .steps-box{
      padding: j(16);
      position: fixed;
      width: 100%;
      z-index: 99;
      box-sizing: border-box;
    }
  }
}
.company_content{
  background-color: #F5F5F5;
  position: relative;
  overflow: hidden;
}
.submit_content{
  @extend %df;
  @extend %jcs;
  padding: j(32) j(16);
  background-color: #f5f5f5;
  button {
    @extend %ao8;
    @extend %df1;
    @extend %bn;
    width: j(164);
    height: j(44);
    font-size: j(15);
    border-radius: j(4);
    background-color: transparent;
  }
  .cancel_button {
    color: #1BB295;
    border: 1px solid #1BB295;
    background-color: #fff;
    margin-right: j(16);
  }
  .submit_button {
    @extend %bsb;
    color: #fff;
    background-color: #1BB295;
  }
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

.process_1,
.process_2,
.process_3,
.process_4 {
  margin-top: j(10);
}

.process_2 {
  .active-collapse {
    margin-bottom: j(10);
  }
  .active{
    border-top: 1px solid #EEEEEE;
    margin-bottom: j(10);
    background-color: #fff;
  }
  button {
    @extend %bn;
    color: #1BB295;
    margin-left: j(30);
    background-color: transparent;
  }
}

.process_3{
  .download_materials{
    box-sizing: border-box;
    padding: j(20) j(16);
    background: #ffffff;
  }
  .down_btn{
    height: j(52);
    margin-bottom: j(16);
    background-color: #F3F8F9;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: j(15);
    color: #00B8AD;
    font-weight: bold;
  }
  .tips{
    margin-bottom: 0;
  }
}
.tips{
  margin-bottom: j(10);
  padding: j(14) j(18);
  @extend %df;
  @extend %bsb;
  font-size: j(14);
  background: #ffffff;
  @extend %aic;
  color: #666666;
  align-items: flex-start;
  .icon{
    margin-right: j(8);
  }
}
.warning {
  color: #F78A5A;
  background-color: #FEF6F2;
  margin-bottom: 0;
}
.from_body{
  margin-bottom: j(10);
  background: #ffffff;
}
.account_mode {
  margin-top: j(10);
}
.account_title {
  @extend %df;
  @extend %jcs;
  @extend %bsb;
  padding: j(16);
  font-size: j(14);
  font-weight: 600;
  background-color: #fff;
  span:last-child {
    @extend %ao8;
    color: #1BB295;
  }
}
.account_card {
  margin: j(10) j(12);
  border-radius: j(4);
  background-color: #fff;
  button {
    @extend %bn;
    @extend %ao8;
    width: j(287);
    height: j(34);
    margin: j(15) j(32);
    padding: j(8) j(90);
    color: #1BB295;
    border-radius: j(4);
    border: 1px solid #1BB295;
    background-color: #fff;
  }
}
.download-tip{
  @extend %pf;
  @extend %w100;
  @extend %bsb;
  z-index: 99;
}
.steps-top{
  top: j(90);
}
.is-margin-top {
  margin-top: j(80);
}
/deep/.as-radio-option {
  color: #333;
}
/deep/.van-collapse-item__content{
  padding: 0;
}
/deep/.van-cell--clickable:active {
  background-color: #fff;
}
/deep/.van-cell__title {
  font-size: j(14);
  font-weight: 600;
}
</style>
