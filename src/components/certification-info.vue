<template>
  <as-popup title="认证信息" :visible.sync="visible">
    <div class="member-info-title">认证信息</div>
    <div v-if="computedType === 2 && type === 'company'" class="form_content">
      <component
        v-for="(item,index) in authCompanyInfo"
        :key="index"
        v-bind="item"
        disabled
        :is="item.is"
        v-model="item.value"
      ></component>
    </div>
    <div class="form_content">
      <component
        v-for="(item,index) in authMemberInfo"
        :key="index"
        v-bind="item"
        disabled
        :is="item.is"
        v-model="item.value"
      ></component>
    </div>
    <div v-if="computedType === 2 && type === 'company'" class="form_content">
      <component
        v-bind="uploadMaterial"
        disabled
        :is="uploadMaterial.is"
        v-model="uploadMaterial.value"
      ></component>
    </div>
  </as-popup>
</template>

<script>
import UploadMaterial from "../views/company/components/upload-material";

import {mapState} from "vuex";
export default {
  name: "certification-info",
  props: {
  },
  data() {
    return {
      visible: false,
      memberInfo:{},
      authMemberInfo:{
        memberName:{
          is:'as-field',
          label: '姓名',
          value:'',
        },
        memberPhone:{
          is:'as-field',
          label: '手机号',
          value:'',
        },
        memberCardNo:{
          is:'as-field',
          label: '身份证号码',
          value:'',
        },
        mainCity:{
          is:'as-field',
          label: '主营城市',
          set:(data,item)=>{
            item.value = data.province === data.city ? data.province : data.province + data.city
            item.province = data.province
            item.city = data.city
          },
          province:'',
          city:'',
          value:'',
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
          ]
        }
      },
      authCompanyInfo:{
        companyName:{
          is:'as-field',
          label: '企业名称',
          value:'',
        },
        companyRegNo:{
          is:'as-field',
          label: '企业注册号',
          value:'',
        },
        companyTypeName:{
          is:'as-field',
          label: '企业类型',
          value:'',
        },
        legalPerson:{
          is:'as-field',
          label: '法人姓名',
          value:'',
        },
        legalCardNo:{
          is:'as-field',
          label: '法人证件号码',
          value:'',
        },
      },
      uploadMaterial:{
        is:'upload-material',
        label: '材料照片',
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
      type: 'person'
    }
  },
  computed:{
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
    computedType(){
      return this.memberInfo.authCategory? this.memberInfo.authCategory:1
    },
  },
  created() {
    this.handleGetMemberInfo();
  },
  methods:{
    show(type) {
      this.visible = true
      this.type = type
    },
    async handleGetMemberInfo() {
      const { memberSid } = this
      this.$api.loadMemberAuthInfo({ memberSid }).then(res=>{
        this.memberInfo = res
        Object.keys(res).forEach(k => {
          if(['authMemberInfo', 'authCompanyInfo'].includes(k)){
            const { memberPhone, memberCardNo } = res[k]
            res[k].memberPhone = this.$filters.filterPhone(memberPhone)
            res[k].memberCardNo = this.$filters.filterIDCard(memberCardNo)
          }
        })
        this.$banana.assignment(res.authMemberInfo,this.authMemberInfo)
        this.$banana.assignment(res.authCompanyInfo,this.authCompanyInfo)
        let { entrustFileUrl,businessLicenseUrl,auctionAgreeUrl } = res.authCompanyInfo
        this.uploadMaterial.sources[0].url = businessLicenseUrl;
        this.uploadMaterial.sources[1].url = auctionAgreeUrl;
        this.uploadMaterial.sources[2].url = entrustFileUrl;
      })
    },
  },
  components:{
    UploadMaterial
  },
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";
.member-info{
  background-color: #F5F5F5;
  &-title{
    margin:j(10) j(15);
    font-size: j(14);
    font-weight: bold;
  }
  .form_content{
    margin-top: j(10);
    background-color: #ffffff;
  }
}
</style>
