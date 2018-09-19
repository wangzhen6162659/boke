<template>
    <div style="-webkit-transform:none;transform:none">
      <div class="index">
        <span class="index_title" >博主id：</span>

        <input class="index_input" v-model="inputEmpId"></input>

        <button class="index_input" style="margin-left: 10px" @click="setEmp()"> 查询</button>
      </div>
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
