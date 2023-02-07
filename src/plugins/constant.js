export const PERSON_STEPS = [
  { title: '个人实名认证' },
  { title: '签署协议' },
  { title: '充值保证金' },
]

export const PERSON_STEPS_TEMP = [
  { title: '个人实名认证'  , key:'authMemberStatus'},
  // { title: '签署《用户参拍协议》' , key:'authAgreeStatus' },
  // { title: '签署《增值服务协议》' , key:'vasAgreeStatus' },
  { title: '签署协议' , key:'agreeStatus',
    children:[
      { title: '委托人签署《用户参拍协议》' , key:'authAgreeStatus' },
      { title: '委托人签署《增值服务协议》' , key:'vasAgreeStatus' },
    ]
  },
  { title: '充值保证金' , key:'marginCashStatus'},
]

export const COMPANY_STEPS = [
  { title: '委托人实名认证' },
  { title: '委托人签署协议' },
  { title: '企业信息认证' },
  { title: '企业充值保证金' },
]

export const COMPANY_STEPS_TEMP = [
  { title: '委托人实名认证' , key:'authMemberStatus'},
  // { title: '委托人签署《用户参拍协议》' , key:'authAgreeStatus' },
  // { title: '委托人签署《增值服务协议》' , key:'vasAgreeStatus' },
  { title: '签署协议' , key:'agreeStatus' ,
    children:[
      { title: '委托人签署《用户参拍协议》' , key:'authAgreeStatus' },
      { title: '委托人签署《增值服务协议》' , key:'vasAgreeStatus' },
    ]
  },
  { title: '企业信息认证'  , key:'authCompanyStatus' },
  { title: '企业充值保证金' , key:'marginCashStatus' },
]

export const COMPANY_CERTIFICATION_PROCESS = [
  {
    title: '委托人实名认证',
    subTitle: '委托人完成个人实名认证'
  },
  {
    title: '委托人签署协议',
    subTitle: '委托人在线签署参拍协议'
  },
  {
    title: '提交企业认证信息',
    more: ['委托人提交真实的企业认证信息，并确保营业', '执照注册时间在2周以上']
  },
  {
    title: '上传企业申请材料',
    subTitle: '上传已加盖公章的申请材料：',
    more: ['1、营业执照','2、开户登记表','3、授权委托书']
  },
  {
    title: '企业充值保证金',
    subTitle: '企业对公账户线下转账充值保证金'
  },
]

const BASE_URL = 'https://mf.autostreets.com/h5-static/member-compliance/#/'
const IP_LOCATION = window.location.origin
export const BASE_IMAGE_URL = 'http://images.autostreets.com/'
//用户认证状态：REGISTERED("未认证")，CERTIFYING("认证中")，AUTH_SUCCESS("已认证成功")，AUTH_FAILURE("认证失败")
export const QIYUESUO_CERTIFICATION_STATUS = ['REGISTERED', 'CERTIFYING', 'AUTH_SUCCESS', 'AUTH_FAILURE']

export const QIYUESUO_SUCCESS_PAGE = process.env.NODE_ENV === 'production' ? BASE_URL + `certification-success` : `${IP_LOCATION}/#/certification-success`

// export const QIYUESUO_END_PAGE = process.env.NODE_ENV === 'production' ? BASE_URL + `certification-failure` : `${IP_LOCATION}/#/certification-failure`

export const QIYUESUO_END_PAGE = BASE_URL + `person-steps`

export const QIYUESUO_AGREEMENT_CALLBACK_URL = process.env.NODE_ENV === 'production' ? BASE_URL + `person-steps?activeStep=3` : `${IP_LOCATION}/#/person-steps?activeStep=3`

export const constant = {
  PERSON_STEPS,
  PERSON_STEPS_TEMP,
  COMPANY_STEPS,
  COMPANY_STEPS_TEMP,
  COMPANY_CERTIFICATION_PROCESS,
  QIYUESUO_CERTIFICATION_STATUS,
  QIYUESUO_SUCCESS_PAGE,
  QIYUESUO_END_PAGE,
  BASE_IMAGE_URL,
  QIYUESUO_AGREEMENT_CALLBACK_URL
}

export default {
  install(Vue) {
    Vue.prototype.$constant = constant
  }
}
