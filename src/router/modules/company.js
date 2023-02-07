export default [
  {
    path: '/company-authentication',
    name: 'company-authentication',
    component: () => import('@/views/company/company-authentication'),
    meta: { depth: 2, title: '企业认证' }
  },
  {
    path: '/certification-process',
    name: 'certification-process',
    component: () => import('src/views/certification-process'),
    meta: { depth: 2, title: '企业认证流程' }
  },
  {
    path: '/member-info',
    name: 'member-info',
    component: () => import('src/views/member-info'),
    meta: { depth: 2, title: '认证信息' }
  }
]
