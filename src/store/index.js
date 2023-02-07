
import Vue from 'vue'
import Vuex from 'vuex'
import { cache } from 'as-cocoon/plugins/storage'

Vue.use(Vuex);

const memberSid = {
  1: '02b17c4229964da2b7afa9b678724bd0', //13912233777
  2: 'eb151cb2508242a5b88eb0058389c3a0', // 已完成
  3: 'b77288aac54f40a2906fcb0ab079cd10',
  4: '59638e6be59a4b97afe9569437e6d491',
  5: '2afa1b68458b418ab137217b0cffde95',
  6: '2da8290f0832443b8ec33827191ee64c',
  7: 'd823f23afa0440a6992f842f6d42e090',
  8: 'c4332b8ad2af4451a4342cef6a62b2b4',
  9: '18462b5af9584644bbb7cfe6d4fc4347',
  10: 'e17b9fffebc9419e82c8b6ead227d303',
  11: '6fac9a05880e4ceeb95ae8016d124242',
  12: '4bf69c785115424fb7acae4573ebc5b9',
  13: 'a41a2c523b964d4088fdadbb3c2b7707', //公司审核失败
  14: '42c4ba8544ac40b18fc364cb613573bb', // 个人认证失败

}

const cellphone = {
  1: '13912233777', //已实名 未签署 有公司
  2: '13912233888', //已实名 未签署
  3: '13912233999', //已实名 已签署
  4: '13912233666',
  5: '13912233555',
  6: '13912233333',
  7: '13912233222',
  8: '13912233111',
  9: '13912233998',
}


export default new Vuex.Store({
    state: {
      memberSid:cache.getItem('$$MEMBER_SID'),
      // memberSid: process.env.NODE_ENV === 'development' ? memberSid[10] : cache.getItem('$$MEMBER_SID'),
      cellphone: 13524327888
    },
    mutations: {
        SET_MEMBERSID(state, memberSid){
            state.memberSid = memberSid
            cache.setItem('$$MEMBER_SID', memberSid)
        },
        SET_CELLPHONE(state, cellphone){
          state.cellphone = cellphone
          cache.setItem('$$CELLPHONE', cellphone)
        }
    }
});
