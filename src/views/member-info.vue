<template>
  <as-view class="member-info"  @left="$app.backToApp">
    <div class="member-info-title">认证信息</div>
    <div v-if="computedType === 2" class="form_content">
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
      >
        <template v-slot:suffix>
          <span @click="superHandle(item)" class="preview">
              查看协议
          </span>
        </template>
      </component>
    </div>
    <div v-if="computedType === 2 && computedUploadMaterialValue" class="form_content">
      <component
          v-bind="uploadMaterial"
          disabled
          :is="uploadMaterial.is"
          v-model="uploadMaterial.value"
      ></component>
    </div>
    <div @click="handleUpdate" class="update-btn" v-if="computedType === 1">
      申请企业认证
    </div>
    <van-dialog  v-model="show"
                 title="企业认证提示"
                 class="next"
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
import UploadMaterial from "./company/components/upload-material";

import {mapState} from "vuex";

export default {
  name: "member-info",
  data(){
    return {
      memberInfo:{},
      files:[],
      show:false,
      authMemberInfo:{
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
        },
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
        authAgreeConfirmTime:{
          is:'as-cell',
          label: '用户参拍协议签署时间',
          value:'',
          to:'/preview-agreement',
          query:{
            nameValue:3
          }
        },
        vasAgreeConfirmTime:{
          is:'as-cell',
          label: '增值服务协议签署时间',
          value:'',
          to:'/preview-agreement',
          query:{
            nameValue:15
          }
        },

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
    }
  },
  components:{
    UploadMaterial
  },
  computed:{
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
    computedType(){
      console.log('123', this.memberInfo)
      return this.memberInfo.authCategory? this.memberInfo.authCategory:1
    },
    computedUploadMaterialValue() {
      const { uploadMaterial } = this
      return uploadMaterial.sources[0].url !== '' && uploadMaterial.sources[1].url !== '' && uploadMaterial.sources[2].url !== ''
    },
  },

  created() {
    this.handleGetMemberInfo();
    this.$api.queryAuthCompanyFiles().then(res=>{
      this.files = res
    }).toast()
  },
  watch: {},
  methods:{
    handleUpdate(){
      this.$api.checkAuthCompany({
        memberSid:this.memberSid
      }).then(res => {
        this.$router.push({
          path:'/certification-process',
          query:{
            type:2
          }
        })
      }).catch(res=>{
        this.show = true
        return
      })
    },
    async handleGetMemberInfo() {
      console.log(this.memberSid)
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
        this.$banana.assignment({
          ...res.authMemberInfo,
          authAgreeConfirmTime:res.authAgreeConfirmTime.slice(0,11),
          vasAgreeConfirmTime:res.vasAgreeConfirmTime.slice(0,11)
        },this.authMemberInfo)
        console.log(this.authMemberInfo);
        this.$banana.assignment(res.authCompanyInfo,this.authCompanyInfo)
        let { entrustFileUrl,businessLicenseUrl,auctionAgreeUrl } = res.authCompanyInfo
        if(entrustFileUrl) this.uploadMaterial.sources[0].url = entrustFileUrl;
        if(businessLicenseUrl) this.uploadMaterial.sources[1].url = businessLicenseUrl;
        if(auctionAgreeUrl) this.uploadMaterial.sources[2].url = auctionAgreeUrl;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/define";
.member-info{
  background-color: #F5F5F5;
  &::v-deep{
    .as-cell-value{
      color:#333333;
    }
  }
  .preview{
    display: flex;
    align-items: center;
    color: #1BB295;
    margin-left: j(20);
  }
  &-title{
    margin:j(10) j(15);
    font-size: j(14);
    font-weight: bold;
  }
  .form_content{
    margin-top: j(10);
    background-color: #ffffff;
  }
  .update-btn{
    @extend %df;
    @extend %aic;
    @extend %jcc;
    box-sizing: border-box;
    border: 1px solid #1BB295;
    font-size: j(15);
    width: j(343);
    padding: j(12) 0;
    margin: j(40) auto;
    border-radius: j(4);
    color: #1BB295;
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
}
</style>
