export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home'),
    meta: { depth: 1, title: '竞拍认证' }
  },
  {
    path: '/verification-code',
    name: 'verification-code',
    component: () => import('@/views/verification-code'),
    meta: { depth: 3, title: '身份验证' }
  },
  {
    path: '/certification-success',
    name: 'certification-success',
    component: () => import('@/views/status/success'),
    meta: { depth: 3, title: '认证成功' }
  },
  {
    path: '/certification-failure',
    name: 'certification-failure',
    component: () => import('@/views/status/failure'),
    meta: { depth: 3, title: '认证失败' }
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: () => import('@/views/agreement'),
    meta: { depth: 3, title: '合同' }
  },
  {
    path: '/preview-agreement',
    name: 'preview-agreement',
    component: () => import('@/views/preview-agreement'),
    meta: { depth: 3, title: '查看协议' }
  },
  {
    path: '/awake',
    name: 'awake',
    component: () => import('@/views/status/awake'),
    meta: { depth: 3, title: '唤醒APP' }
  },
  {
    path: '/public-account',
    name: 'public-account',
    component: () => import('@/views/account/public-account'),
    meta: { depth: 2,title: '对公账户管理' }
  }
]
