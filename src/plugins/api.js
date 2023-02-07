import curl from 'src/utils/curl'
import jsonp from 'src/utils/jsonp'
import {$device_info, $user} from 'src/plugins/storage'

//接口地址
//http://jira.autostreets.com/wiki/pages/viewpage.action?pageId=5865791#AUC-1246%E4%BC%9A%E5%91%98%E5%90%88%E8%A7%84%E5%8C%96%E7%9B%B8%E5%85%B3%E6%8E%A5%E5%8F%A3API-4.%E7%AB%9E%E6%8B%8DAPP-%E6%88%91%E7%9A%84-%E6%9F%A5%E8%AF%A2%E8%AE%A4%E8%AF%81%E8%BF%9B%E5%BA%A6%EF%BC%88%E6%9C%AC%E6%9C%9F%E6%96%B0%E5%A2%9E%EF%BC%89

export const $api = {
  //二进制上传图片

  imageUpload: (params, loading = true ) => curl.post('https://vas-wap.autostreets.com/fileUpload/base64-image', params, {
  // imageUpload: (params) => curl.post('https://vas-wap.autostreets.com/fileUpload/imageFile', params, {
  // imageUpload: (params) => curl.post('https://epms-app.autostreets.com/certificateBosOrder/imageFileUpload', params, {
    loading,
    headers:{
      // 'Content-Type': 'multipart/form-data'
      'Content-Type': 'application/json'
    }
  }),
  //账户信息获取
  loadMemberInfo: (params) => curl.get('member/loadMemberInfo',params),
  //查询认证进度
  loadMemberAuthInfo: (params, loading = true) => curl.post('memberAuth/loadMemberAuthInfo', params, { loading }),
  //竞拍APP-我的-查询会员曾经的手动实名认证状态
  checkMemberCertificationStatus: (params) => curl.post('/memberAuth/checkMemberCetificationStatus', params),
  //个人认证-实名信息-提交
  saveAuthMember: (params) => curl.post('memberAuth/saveAuthMember', params),
  //个人实名认证-初期化-获取契约锁实名认证的页面
  initAuthMember: (params) => curl.post('memberAuth/initAuthMember', params),
  //个人实名认证-回调页面-校验认证状态
  checkMemberAuthStatus: (params) => curl.post('memberAuth/checkMemberAuthStatus', params),
  //个人认证-签署协议-初期化-获取协议的模板信息
  getAuthAgreeTemplate: (params) => curl.get('memberAuth/getAuthAgreeTemplate', params),
  //签署协议成功页面-校验签署状态
  checkAgreeConfirmStatus: (params) => curl('memberAuth/checkAgreeConfirmStatus', params),
  //个人认证-主营城市-获取
  //'getAuthMemberCitys'
  getAuthMemberCities: () => curl.get('memberAuth/getAuthMemberCitys'),

  //企业认证-是否符合要求-校验接口
  checkAuthCompany:(params) => curl.get('memberAuth/checkAuthCompany', params),

  //锁定为公户
  confirmAuthCompany:(params) => curl.get('memberAuth/confirmAuthCompany', params),

  //企业认证-材料配置-获取
  queryAuthCompanyFiles:(loading = true) => curl('memberAuth/getAuthCompanyFiles' , {}, { loading }),

  //企业认证-企业类型--获取
  queryCompanyType:(loading = true) => curl('memberAuth/getCompanyType', {}, { loading }),

  //-企业信息真实性
  checkRealCompany:(params, loading = true) => curl('memberAuth/checkRealCompany',params, { loading }),

  //-委托人实名认证信息-获取
  queryAuthMemberInfo:(params) => curl.get('memberAuth/getAuthMemberInfo', params),

  //-委托人实名认证信息-获取
  saveAuthCompany:(params) => curl('memberAuth/saveAuthCompany', params),

  //签署协议-校验签署状态
  checkAgreeConfirm: (params) => curl.post('memberAuth/checkAgreeConfirm', params),

  //签署协议-获取协议
  getAgreement: (params) => curl.post('memberAuth/getAgreement', params),

  //签署协议-签署确认
  confirmAgree: (params) => curl.post('memberAuth/confirmAgree', params ,{
    header:{
      'device-number':$device_info.getItem()? $device_info.getItem()['device-number'] : '',
    }
  }),

  //获取确认协议详情
  getConfirmAgree: (params) => curl.post('memberAuth/getConfirmAgree', params),

  //企业认证-法人证件类型-字典配置-获取
  getLegalCardType: (loading = true) => curl.get('memberAuth/getLegalCardType', {}, { loading }),

  //对公账户-开户银行-字典配置-获取
  getBankList: (params) => curl.get('memberAuth/getBank', params),

  //企业认证-第一步-初期化获取默认企业认证填充信息
  initAuthCompanyInfo: (params, loading = true) => curl.post('memberAuth/initAuthCompanyInfo', params, { loading }),

  //企业认证-第二步-初期化获取默认委托人填充信息
  initAuthMemberInfo: (params, loading = true) => curl.post('memberAuth/initAuthMemberInfo', params, { loading }),

  //企业认证-第二步-初期化获取默认对公账户填充信息
  initAuthBankInfo: (params, loading = true) => curl.post('memberAuth/initAuthBankInfo', params, { loading }),

  //企业认证信息-保存
  savePreAuthCompanyInfo: (params, loading = true) => curl.post('memberAuth/savePreAuthCompanyInfo', params, { loading }),

  //对公账户信息-保存
  savePreAuthBankInfo: (params, loading = true) => curl.post('memberAuth/savePreAuthBankInfo', params, { loading }),

  //企业资料信息校验-是否提醒
  changeAuthCompany: (params, loading = true) => curl.post('memberAuth/changeAuthCompany', params, { loading }),

  //企业认证-提交申请
  submitAuthCompany: (params, loading = true) => curl.post('memberAuth/submitAuthCompany', params, { loading }),

  //终止企业认证，转为个人认证
  stopAuthCompany: (params, loading = true) => curl.post('memberAuth/stopAuthCompany', params, { loading }),

  //对公账户管理-列表查询
  companyBankList: (params, loading = true) => curl.post('memberAuth/companyBankList', params, { loading }),

  //对公账户管理-新增
  addCompanyBank: (params, loading = true) => curl.post('memberAuth/addCompanyBank', params, { loading }),

  //对公账户管理-编辑
  editCompanyBank: (params, loading = true) => curl.post('memberAuth/editCompanyBank', params, { loading }),

  //对公账户管理-删除
  delCompanyBank: (params, loading = true) => curl.post('memberAuth/delCompanyBank', params, { loading }),
}

export default {
  install(Vue) {
    Vue.prototype.$api = $api
  }
}
