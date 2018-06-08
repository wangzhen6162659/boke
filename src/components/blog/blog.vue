<template>
  <div class="blog">
    <div class="select_button">
      <router-link to="/新歌" class="todo_btn playing_btn">新歌</router-link>
      <router-link to="/排行" class="todo_btn playing_btn">排行</router-link>
      <router-link to="/榜单" class="todo_btn playing_btn">榜单</router-link>
      <router-link to="/歌手" class="todo_btn playing_btn">歌手</router-link>
    </div>
  </div>
</template>
<script>
  import store from 'store'
  // import fecth from 'utils/fecth.js'
  export default {
    data () {
      return {
        isgetimagebybing: store.getters.getShowBingImage
      }
    },
    compile: {
      getIsAPP () {
        return store.getters.getGlobalInfo
      }
    },
    methods: {
      getBlogType () {
        // let api = 'http://192.168.1.124:9999/api/admin/article/findTypeByUser?id=1'
        // fecth.get(api).then((res)=>{
        //   let article = {
        //     articleName
        //   }
        // })
      }
    },
    mounted () {
      this.getBlogType()
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
</style>
