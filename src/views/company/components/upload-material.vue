<template>
  <div class="upload-material" :class="{'is-material': isMaterial}">
<!--    <div class="pic_title">{{ label }}</div>-->
    <div :class="{'pic_title': isMaterial}">{{ label }}</div>
    <div class="pic_content" :class="{'is-material': isMaterial}">
      <div v-for="(item,index) in sources" :key="index" class="pic_block">
          <div class="pic_block_none" v-if="item.url === ''" >
            <input @click="handleClick($event,index)" type="file" accept="image/*" @change="handleFile($event,index)" >
            <img src="../../../assets/images/icon_upload.png" >
            <p class="title">{{item.label}}</p>
          </div>
          <div class="pic_block_has" v-else>
            <van-icon v-if="!disabled" @click="$emit('remove',index ,item)" class="icon_delete" name="delete-o" />
            <van-icon v-else @click="$refs.refImgPreview.show([{src:computedImg(item.url)}])" class="icon_delete" name="eye-o" />
            <img class="preview_pic" :src="computedImg(item.url)" alt="">
            <p class="title">{{item.picLabel}}</p>
          </div>
      </div>
    </div>
    <as-img-preview ref="refImgPreview"/>
  </div>
</template>

<script>
import {dataURLtoFile } from "../../../utils/common";
import img from 'src/utils/image'
import {Icon as VanIcon} from 'vant'

export default {
  name: "upload-material",
  props:{
    label:String,
    sources:{
      type:Array,
      default:()=>[]
    },
    disabled:{
      type:Boolean,
      default:false
    },
    isMaterial: {
      type: Boolean,
      default: false
    }
  },
  created() {
    console.log('sources',this.sources)
  },
  methods:{
    computedImg(src){
      return src.startsWith('http')? src:this.$constant.BASE_IMAGE_URL+src
    },
    async handleFile(e,index){
      let file = e.target.files[0];
      console.log('e.target.files', e.target.files[0])
      file = await img.toBase64(file)
      this.$api.imageUpload({base64Url:file}).then( res => {
          this.$emit('upload',res.saveUrl,index)
      })
    },
    handleClick(e,index){
      if(this.$helper.isAndroid()){
        e.preventDefault();
        this.$app.openFileChooser().then(({sourceBase64:file}) => {
          if(file){
            this.$api.imageUpload({base64Url:'data:image/jpeg;base64,' + file}).then( res => {
              this.$emit('upload',res.saveUrl,index)
            })
          }
        })
      }
    }
  },
  components:{
    VanIcon,
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/define";
.upload-material{
  box-sizing: border-box;
  padding: j(20) j(15) j(0);
  font-size: j(14);
}
.pic_title {
  @extend %df1;
  font-weight: bold;
  margin-bottom: j(16);
}
.pic_content{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: j(9);
}
.pic_block{

  width: j(152);
  height: j(101);
  margin-bottom: j(12);
  border: j(1) dashed #909090;
  .pic_block_has{
    height: 100%;
    position: relative;
    .preview_pic{
      width: 100%;
      height: 100%;
    }
    .title{
      position: absolute;
      width: 100%;
      height: j(23);
      line-height: j(23);
      text-align: center;
      background: rgba(0,0,0,0.5);
      color: #ffffff;
      font-size: j(12);
      bottom: 0;
    }
    .icon_delete{
      font-size: j(20);
      font-weight: bold;

      color: #979797;
      top: j(6);
      right: j(6);
      position: absolute;
    }
  }
}
.pic_block_none{
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: j(12);
  color:#999999;
  input{
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  img{
    width: 24px;
    height: 24px;
  }
  .title{
    margin:j(4) j(14);
    text-align: center;
  }
}

.is-material {
  &.upload-material {
    @extend %df;
    @extend %fdc;
    @extend %aic;
  }
  .pic_content {
    @extend %fdc;
  }
  .pic_block {
    width: j(240);
    height: j(135);
  }
}
</style>
