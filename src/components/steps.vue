<template>
  <ul class="steps-box" :class="{'is-horizontal': direction === 'horizontal'}">
    <li class="steps-item" v-for="(item, index) in computedSteps" :key="item.index">
      <div class="steps-main">
        <div class="steps-icon-block">
          <div v-if="direction === 'horizontal'" :style="{'opacity':index === 0? 0:1 }" :class="`steps-line__${direction}`"></div>
          <div class="steps-circle-box" >
            <img :class="['steps-circle',index+1 === activeStep? 'steps-circle-active':'']" :src="item.url" alt="">
          </div>
          <div :style="{'opacity':index === computedSteps.length-1? 0:1 }" :class="`steps-line__${direction}`"></div>
        </div>
        <div class="steps-right">
          <div class="steps-right-content">
            <div class="steps-label-box">
              <h3 class="steps-label" :class="{
          'is-label-active': activeStep === index+1,
          'is-bold-title': isBoldTitle,
          'is-next-active': direction === 'vertical'? (index+1 > activeStep && status[item.key] !== 1):index+1 > activeStep
        }">
                {{item.title}}
              </h3>
              <p v-if="item.subTitle && direction !== 'horizontal'"
                 class="steps-sub-label"
              >
                {{item.subTitle}}
              </p>
              <slot :step="item"></slot>
            </div>
            <slot name="other" :button="item"></slot>
          </div>
          <slot name="tip" :tip="item" style="flex: 1"></slot>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import {Icon} from "vant";
import {mapState} from "vuex";
export default {
  name: "steps",
  props: {
    steps: { type: Array, default: () => [] },
    status: {type: Object, default: ()=> {} },
    direction: { type: String, default: 'vertical' }, //horizontal
    activeStep: { type: Number, default: 1 },
    isBoldTitle: { type: Boolean, default: true },
    isButton: { type: Boolean, default: false  }
  },
  computed: {
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
    computedSteps() {
      const { steps, activeStep, direction ,status} = this
      steps.forEach((k,index) => {
        let step = index +1
        if(direction === 'vertical' && status){
          if(status[k['key']] === 1)  step = step + '-success'
        }else{
          if(step < activeStep) direction === 'vertical' ?  step = step + '-success' : step = '-success'
        }
        if(step === activeStep) step = step + '-active'
        k.url = require(`src/assets/images/${direction}/step${step}.png`)
      })
      return steps
    },
  },
  methods: {
    handleClick(item, index) {
      const { activeStep } = this
      let step = index + 1
      if (step < activeStep ) {
        // this.$router.push('/verification-code')
      }
      this.$emit('button-click', { item, index })
    }
  },
  components: {
    VanIcon: Icon
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";
.steps-box{
  @extend %df;
  @extend %fdc;
  background-color: #fff;
}
.steps-item{
  @extend %pr;
  @extend %df;
  align-items: center;
  flex-direction: column;
  //flex-wrap: wrap;
  //margin-bottom: j(28);
  min-height: j(60);
}
.steps-main{
  @extend %df;
  @extend %df1;
  width: 100%;
}
.steps-right-content{
  @extend %df;
  @extend %jcc;
  @extend %aic;
  width: 100%;
  min-height: j(32);
}
.steps-right{
  flex: 1;
  display: flex;
  padding-bottom: j(10);
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
}
.steps-circle{
  width: j(20);
  height: j(20);
  &-active{
    width: j(20);
    height: j(20);
  }
}

.is-horizontal{
  @extend %jcc;
  flex-direction: row;
  .steps-circle{
    width: j(20);
    height: j(20);
    &-active{
      width: j(26);
      height: j(26);
    }
  }
  .is-next-active{
    color: #333;
  }
  .steps-right-content{
    min-height: auto;
  }
  .steps-item{
    @extend %pr;
    //@extend %df;
    //flex-wrap: wrap;
    margin-bottom: j(28);
  }
  .steps-main{
    @extend %df;
    @extend %fdc;
    @extend %aic;
    width: 100%;
  }
  .steps-icon-block{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .steps-item{
    @extend %pr;
    @extend %df;
    @extend %fdc;
    @extend %aic;
    @extend %jcc;
    flex: 1;
    margin-bottom: 0;
    //margin-right: j(12);
    &:last-child{
      margin-right: 0;
    }
  }
  .steps-label-box{
    @extend %aic;
    padding-left: 0;
    padding-top: j(6);
  }
  .steps-label{
    font-size: j(10);
    font-weight: 400;
  }
  .is-label-active{
    color: $green;
  }
}
.steps-icon-block{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.steps-circle-box{
  height: j(32);
  width: j(30);
  display: flex;
  align-items: center;
  justify-content: center;
}


.steps-line__vertical{
  width: 1px;
  flex: 1;
  background: #c0c0c0;
  //position: absolute;
  //background-color: #ebedf0;
  //-webkit-transition: background-color 0.3s;
  //transition: background-color 0.3s;
  //top: j(32);
  //left: 3%;
  //transform: translateX(-3%);
  //width: 1px;
  //height: 70%;
}
.steps-line__horizontal{
  flex: 1;
  //position: absolute;
  background-color: #ebedf0;
  //top: j(12);
  //left: 105%;
  //transform: translateX(-50%);
  //width: 70%;
  height: 1px;
}
//.steps-item:last-child .steps-line__vertical,
//.steps-item:last-child .steps-line__horizontal{
//  height: 0;
//}
.steps-label-box{
  @extend %df;
  @extend %fdc;
  @extend %df1;
  padding-left: j(18);
}
.steps-label{
  font-size: j(14);
  font-weight: 400;
  color: #333;
  @extend %df;
  @extend %df1;
  @extend %aic;
}
.steps-sub-label{
  margin-top: j(4);
  font-size: j(14);
  color: #666;
}

.is-bold-title{
  font-size: j(17);
  font-weight: 800;
}
.steps-btn{
  @extend %bn;
  @extend %ao8;
  font-size: j(14);
  color: #999;
  background-color: transparent;
}
.steps-btn span {
  margin-right: j(6);
}
.btn-uncompleted{
  @extend %ao8;
  @extend %bsb;
  width: j(64);
  color: $green;
  border: 1px solid $green;
  border-radius: j(4);
}
.btn-uncompleted span{
  margin-right: 0;
}
.is-active{
  &:active{
    opacity: 1;
  }
}
.is-next-active{
  color: #ababab;
}

</style>
