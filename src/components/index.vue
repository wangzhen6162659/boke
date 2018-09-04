<template>
    <div style="-webkit-transform:none;transform:none">
      <div class="index">
        <span class="index_title" >博主id：</span>

        <input class="index_input" v-model="inputEmpId"></input>

        <button class="index_input" style="margin-left: 10px" @click="setEmp()"> 查询</button>
      </div>
      <span class="index" style="top:10%;">
        <iframe name="uploadfrm" id="uploadfrm" style="display: none;"></iframe>
        <div>
          <input class="index_input" value="拍照识别" type="file" name="file_head" id="file_head"  @change="getFace($event)"/>
        </div>
        <div data-role="fieldcontain">
          <div id="localImag">
            <img id="preview" width="-1" height="-1" style="display: none" />
          </div>
        </div>
      </span>
    </div>
</template>

<script>
import store from 'store'
import fecth from 'utils/fecth.js'
import apiList from 'common/api/albumApiList.js'
import publicApiList from 'common/api/publicApiList.js'
import myUtiles from 'utils/myUtiles.js'
import Vue from 'vue'
import Exif from 'exif-js'
// import advertisement from 'components/common/advertisement/advertisement'

// 引入背景请求的api  getBingInfo
import {getBingInfo, getMineBgByIndex} from 'common/api/background.js'

export default {
  data () {
    return {
      inputEmpId: ''
    }
  },
  computed: {

  },
  // components: {
  //   advertisement
  // },
  methods: {
    setEmp () {
      this.$router.push('/home/' + this.inputEmpId)
    },
    getFace (e) {
      this.imgPreview(e.target.files[0]);
      // let formdata = new FormData()
      // formdata.append('file', e.target.files[0])
      // fecth.upload(publicApiList.getFace, formdata).then((res) => {
      //   if (res.data.target != null) {
      //     alert('你好' + res.data.target + '!')
      //   }else{
      //     alert('找不到这个人！')
      //   }
      // }, (err) => {
      //   alert(JSON.stringify(err))
      // })
    },
    imgPreview (file) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function(){
        Orientation = Exif.getTag(this, 'Orientation');
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let data = self.compress(img,Orientation);

            let formdata = new FormData()
            file = self.convertBase64UrlToBlob(data);
            formdata.append('file', file)
            fecth.upload(publicApiList.getFace, formdata).then((res) => {
              if (res.data.target != null) {
                self.$msg('欢迎来到,' + res.data.target[0] + '!')
                self.$router.push('/home/' + res.data.target[0])
              }else{
                alert('找不到这个人！')
              }
            }, (err) => {
              alert(JSON.stringify(err))
            })
          }
        }
      }
    },
    convertBase64UrlToBlob (urlData) {

      var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab] , {type : 'image/png'});
    },
    rotateImg (img, direction,canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null)return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext('2d');
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    compress(img,Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素")
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if(Orientation != "" && Orientation != 1){
        switch(Orientation){
          case 6://需要顺时针（向左）90度旋转
            this.rotateImg(img,'left',canvas);
            break;
          case 8://需要逆时针（向右）90度旋转
            this.rotateImg(img,'right',canvas);
            break;
          case 3://需要180度旋转
            this.rotateImg(img,'right',canvas);//转两次
            this.rotateImg(img,'right',canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    toggleFullScreen () {
      if (this.isFullScreen) {
        this.exitFullscreen()
      } else {
        this.fullScreen()
      }
    },

    hideAllList () {
      this.isShowAllList = false
    },

    showAllList () {
      this.isShowAllList = true
    }
  },
  components: {
  },
  watch: {
    // '$route': 'getRoutePath'
    '$route' (to) {
      if (this.$route.params.empId != undefined){
        store.dispatch({
          type: 'set_EmpInfo',
          data: this.$route.params.empId
        })
      }
      if (to.matched[0].path === '/home/:empId') {
        // console.log(to)
        myUtiles.setTitle('NoteX-' + '主页');
      }
    }
  },
  mounted () {
    myUtiles.setTitle('NoteX-' + '首页');
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../common/stylus/global.styl'
  .index
    position:fixed
    top:0
    left:-4%;
    bottom:0
    width:100%;
    display:flex
    align-items:center
    justify-content: center;
    .index_title
      font-size: 24px;
      color:$text_color
    .index_input
      position: relative
      /*background:transparent*/
      /*color:$text_color*/
      resize: none
      outline:none
      border:1px solid $text_color
      box-sizing:border-box
      line-height:1.5
      border-radius: 4px;
  .distinguish
    position:fixed
    top:10%
    left:-4%;
    bottom:0
    width:100%;
    display:flex
    align-items:center
    justify-content: center;
</style>
