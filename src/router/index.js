import Vue from 'vue'
import VueRouter from 'vue-router'
import store  from 'src/store'
import {setNativeNavStatus}  from 'src/plugins/app'
import {cache, local} from "as-cocoon/plugins/storage/index";
import {$api} from 'src/plugins/api'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = (s => [
  ...s.keys().map(k => s(k).default).flat(),
  { path: '*', redirect: '/' }
])(require.context('./modules/', true, /\.js$/))

const router = new VueRouter({
  mode: 'hash',
  routes
})

router.beforeEach(async (to, from, next) => {
    const { title } = to.meta
    console.log('to==>', to)
    document.title = title || '会员合规性'
    const { memberSid, cellphone } = to.query
    if( memberSid ){
      store.commit('SET_MEMBERSID', memberSid)
    }
    if( cellphone ){
      store.commit('SET_CELLPHONE', cellphone)
    }
    // if(to.name === 'Home' ){
    //   let { authCategory } = await $api.loadMemberAuthInfo({memberSid})
    //   if(authCategory){
    //     next('/person-steps')
    //   }else {
    //     next()
    //   }
    // }
  // console.log('beforeEach =>',cache.getItem('$$SHOWNATIVEHEADER'))
  //   if(cache.getItem('$$SHOWNATIVEHEADER') == 1){
  //     console.log(2222)
  //     await setNativeNavStatus({status:2});
  //     cache.setItem('$$SHOWNATIVEHEADER',2)
  //
  //   }
    next()
})

export default router
