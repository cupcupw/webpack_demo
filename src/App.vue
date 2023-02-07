<template>
  <div class="box">
    <transition :name="transitionName">
      <router-view class="view-wrap"></router-view>
    </transition>
  </div>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "App",
  data(){
    return {
      transitionName: '',
    }
  },
  created() {
    window['setMemberSid'] =  (data) => {//登录后回调
      this.SET_MEMBERSID(data)
    }
    window['cellphone'] = data => {
      this.SET_CELLPHONE(data)
    }
  },
  watch: {
    '$route' (to, from) {
      const { depth: toDepth } = to.meta;
      const { depth: fromDepth = toDepth } = from.meta;
      this.transitionName = toDepth === undefined || toDepth === fromDepth
          ? '' : toDepth > fromDepth ? 'vux-pop-in' : 'vux-pop-out';
    }
  },
  methods:{
    ...mapMutations(['SET_MEMBERSID','SET_CELLPHONE'])
  }
}
</script>

<style lang="scss">
@import 'assets/scss/base.scss';
.box {
  width: 100%;
  height: 100vh;
  //font-size: 3.6rem;
}
</style>
