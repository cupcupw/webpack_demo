export default [
  {
    path: '/person-certification',
    name: 'person-certification',
    component: () => import('@/views/person/person-certification'),
    meta: { depth: 2, title: '个人认证' }
  },
  {
    path: '/person-steps',
    name: 'person-steps',
    component: () => import('@/views/person/person-steps'),
    meta: { depth: 1, title: '个人竞拍认证' }
  }
]
