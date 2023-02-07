import {backToApp} from "../plugins/app";

export default {
  methods:{
    checkBack(){
      if (window.history.state && window.history.state.key) {  //返回上级h5
        console.log(window.history.state)
        console.log(window.history.state.key)
        this.$router.go(-1);
      } else {  //返回app页面    console.log(123213)
        console.log('backToApp')

        backToApp();
      }
    }
  }
}