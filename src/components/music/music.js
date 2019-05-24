import store from 'store'
import fecth from 'utils/fecth.js'
import {Utils} from 'common/js/Utils.js'
import $ from 'jquery'
import {fecthPromise, todoUserInfo} from 'common/api/user.js'
import vueExp from '@/main.js'
import apiList from 'common/api/musicApiList.js'
const musicApi = {
    lastLyric: 0,
    typeType: localStorage.getItem('audioPlayType') || store.getters.getAudioPlayType,
    lyric: {},    // 解析的歌詞
    maxProgressWidth: 0,
    dragProgressTo: 0,
    x: 0,  // x 的位置
    l: 0,  // offsetleft
    parseLrc (lrc) {
        if (!lrc) return ''
        const lyrics = lrc.split('\n')
        let lrcObj = {}
        for (let i = 0; i < lyrics.length; i++) {
            // 解码
            const lyric = decodeURIComponent(lyrics[i])
            const timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g
            const timeRegExpArr = lyric.match(timeReg)
            if (!timeRegExpArr) continue
            const clause = lyric.replace(timeReg, '')
            for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
                const t = timeRegExpArr[k]
                let min = Number(String(t.match(/\[\d*/i)).slice(1))
                let sec = Number(String(t.match(/\:\d*/i)).slice(1))
                const time = min * 60 + sec
                lrcObj[time] = clause
            }
        }
        return lrcObj
    },
    // 获取对应的表单歌曲
    getMusicSheet (id) {
        // const id = 3778678  // 云音乐热歌榜
        fecth.getOut(apiList.getPlaylist,{id: id},{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((res) => {
            // console.log(JSON.stringify(res.data.result.songs))
            // that.musicInfo = res.data.playlist.tracks
            store.dispatch({
                type: 'set_MusicSheetList',
                data: res.data.playlist.tracks
            })
            store.dispatch({
                type: 'set_MusicList',
                data: res.data.playlist.tracks
            })
        }, (err) => {
            console.log(err)
        })
    },

    // 获取专辑信息
    getAlbum (id) {
        fecth.getOut(apiList.getAlbum,{id:id}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((res) => {
            // that.musicInfo = res.data.playlist.tracks
            store.dispatch({
                type: 'set_MusicSheetList',
                data: res.data.songs
            })
            store.dispatch({
                type: 'set_MusicList',
                data: res.data.songs
            })
        }, (err) => {
            console.log(err)
        })
    },

    // 获取歌词
    getMusicLrc (data, that) {
        var picUrl = ''
        const ele = store.getters.getAudioEle
        // alert(data.id)
        if (data.picurl === null){
        fecth.getOut(apiList.getDetail,{ids: data.id}).then((res) => {
          if (res.data.songs[0].al.picUrl !== undefined) {
            picUrl = res.data.songs[0].al.picUrl
            fecth.getOut(apiList.getLyric,{id: data.id}).then((res) => {
              let parseLrc = {}
              if (res.data.lrc === undefined) {
                parseLrc = {'0': '纯音乐,请欣赏'}
              } else {
                parseLrc = this.parseLrc(res.data.lrc.lyric)
                this.lyric = parseLrc
              }
              // 初始化最後一個lrc
              this.lastLyric = -1
              const currentMusic = {
                id: data.id,
                name: data.name,
                url: musicApi.replaceUrl(data.url),
                singer: data.singer,
                duration: data.duration,
                picurl: picUrl,
                index: data.musicndex,
                lyric: parseLrc,
                lrcContent: store.getters.getAudioLrcContent
              }
              store.commit({
                type: 'setCurrentAudio',
                data: currentMusic
              })

              if (data.type !== 'unupdate' && data.type === '') {
                store.dispatch({
                  type: 'set_MusicPlayList',
                  data: data.list
                })
              }
              that.$nextTick(() => {
                try {
                  store.getters.getAudioEle.load()
                  if (store.getters.getAudioEle.paused) {
                    store.getters.getAudioEle.play()
                  }
                } catch (e) {
                  return
                }
                // 设置歌词位置
                store.commit({
                  type: 'setAudiolrcIndex',
                  data: 0
                })
                this.scrollAnimate(document.getElementsByClassName('lrc-wrapper')[0], 0)
                // 设置播放状态
                store.getters.getAudioEle.play()
                store.commit('setAudioIsPlay', !ele.paused)
              })
            }, (err) => {
              console.log(err)
            })
          }
        })
        }
        else {
          fecth.getOut(apiList.getDetail,{ids: data.id}).then((res) => {
            if (res.data.songs[0].al.picUrl !== undefined) {
              picUrl = res.data.songs[0].al.picUrl
              fecth.getOut(apiList.getLyric,{id: data.id}).then((res) => {
                let parseLrc = {}
                if (res.data.lrc === undefined) {
                  parseLrc = {'0': '纯音乐,请欣赏'}
                } else {
                  parseLrc = this.parseLrc(res.data.lrc.lyric)
                  this.lyric = parseLrc
                }
                // 初始化最後一個lrc
                this.lastLyric = -1
                const currentMusic = {
                  id: data.id,
                  name: data.name,
                  url: musicApi.replaceUrl(data.url),
                  singer: data.singer,
                  duration: data.duration,
                  picurl: data.picurl,
                  index: data.musicndex,
                  lyric: parseLrc,
                  lrcContent: store.getters.getAudioLrcContent
                }
                store.commit({
                  type: 'setCurrentAudio',
                  data: currentMusic
                })

                if (data.type !== 'unupdate' && data.type === '') {
                  store.dispatch({
                    type: 'set_MusicPlayList',
                    data: data.list
                  })
                }
                that.$nextTick(() => {
                  try {
                    store.getters.getAudioEle.load()
                    if (store.getters.getAudioEle.paused) {
                      store.getters.getAudioEle.play()
                    }
                  } catch (e) {
                    return
                  }
                  // 设置歌词位置
                  store.commit({
                    type: 'setAudiolrcIndex',
                    data: 0
                  })
                  this.scrollAnimate(document.getElementsByClassName('lrc-wrapper')[0], 0)
                  // 设置播放状态
                  store.getters.getAudioEle.play()
                  store.commit('setAudioIsPlay', !ele.paused)
                })
              }, (err) => {
                console.log(err)
              })
            }
          })
        }
    },
    // 获取音乐时长
    getMusicDurantionType (time) {
        const minT = Math.floor(time / 1000 / 60) >= 10 ? Math.floor(time / 1000 / 60) : '0' + Math.floor(time / 1000 / 60)
        const minS = Math.floor(time / 1000 % 60) >= 10 ? Math.floor(time / 1000 % 60) : '0' + Math.floor(time / 1000 % 60)
        return minT + ':' + minS
    },

    // 滚动歌词到指定句
    // 参数：当前播放时间（单位：秒）
    scrollLyric (time, that) {
        // aler)
      if (this.lyric === '') return false

      time = parseInt(time)  // 时间取整

      if (this.lyric === undefined || this.lyric[time] === undefined) return false  // 当前时间点没有歌词

      if (this.lastLyric === time) return true // 歌词没发生改变

      var i = 0  // 获取当前歌词是在第几行

      // 将此行数 放入vuex
      store.commit({
        type: 'setAudiolrcIndex',
        data: i
      })

      for (var k in this.lyric) {
        if (k > time) break
        i++
      }
      this.lastLyric = time  // 记录方便下次使用
      // $(".lplaying").removeClass("lplaying")     // 移除其余句子的正在播放样式
      // $(".lrc-item[data-no='" + i + "']").addClass("lplaying")    // 加上正在播放样式
      // 再次添加 放入vuex
      store.commit({
        type: 'setAudiolrcIndex',
        data: i
      })
      try {
        var lrcIndex = 0
        for (var j = 0; j < i; j++) {
          lrcIndex += document.getElementsByClassName('lrc-item')[j].offsetHeight
        }
        this.scrollAnimate(that.$refs.lrcWrapper, lrcIndex)
      } catch (e) {
        return
      }
    },

    // 点击播放歌曲
    clickIndex (data, that) {
        var reqId = data.music_id ? data.music_id : data.id
        fecth.getBase(apiList.getCloudUrl,{id: reqId + '.mp3'}).then((res) => {
            // 如果代码不允许被播放（付费音乐）
            if (res.data.data[0].url === null) {
                that.$msg('音乐无法播放,请播放其他音频...')
                const currentMusic = {
                    index: store.getters.getCurrentAudio.index
                }
                store.commit({
                    type: 'setCurrentAudio',
                    data: currentMusic
                })
                this.playNextPrev(that, true)
                return
            }
            const newData = {
                id: reqId,
                name: data.name,
                url: musicApi.replaceUrl(res.data.data[0].url),
                singer: data.singer,
                duration: data.duration,
                picurl: data.pic,
                musicndex: data.index,
                list: data.list,
                type: data.type
            }
            this.getMusicLrc(newData, that)
            // this.musicInfo = res.data.result.songs
        }, (err) => {
            console.log(err)
        })
    },

    // 搜索音乐
    searchMusic (word, pages, that) {
        fecth.getOut(apiList.getSearch,{keywords: word,limit: 100}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((res) => {
            try {
                res.data.result.songs.forEach((value, index, array) => {
                    var ar = {
                      name: value.artists[0].name
                    }
                    var al = {
                      picUrl: value.artists[0].picUrl,
                      id: value.album.id,
                      name: value.album.name
                    }
                    var data = {
                      dt: value.duration,
                      id: value.id,
                      name: value.name,
                      al: al,
                      ar:{
                        0: ar
                      }
                    }
                    that.searchMusicList.push(data)
                })
                store.dispatch({
                    type: 'set_MusicSearchList',
                    data: that.searchMusicList
                })
                store.dispatch({
                    type: 'set_MusicList',
                    data: that.searchMusicList
                })
            } catch (e) {
                return
            }
        }, (err) => {
            console.log(err)
        })
    },

    scrollAnimate (ele, position) {
      ele.style.WebkitTransform = `translate3d(-50%, -${position}px, 0)`
      ele.style.transform = `transform: translate3d(-50%, -${position}px, 0)`
    },

    // 添加到我喜欢的音乐 使用本地存储的方法
    collectMusic (opt) {
        var picUrl = '';
        fecth.getOut(apiList.getDetail,{ids: opt.id}).then((res) => {
          if (res.data.songs[0].al.picUrl !== undefined) {
            picUrl = res.data.songs[0].al.picUrl
          }
          var userInfo = fecth.getCookieValue("_user");
          let options = {
            userId: userInfo.id,
            musicId: opt.id,
            musicName: opt.name,
            singerId: opt.ar[0].id,
            singerName: opt.ar[0].name,
            albumId: opt.al.id,
            albumName: opt.al.name,
            musicDur: opt.dt,
            musicPicurl: picUrl
          }
          let fecthUrl = '/api/admin/collect/saveCollectMusic'
          fecth.postJson(fecthUrl, options).then((res) => {
            res = res.data
            if (res.data) {
              this.$msg('收藏成功！')
            }else{
              this.$msg(res.errmsg)
            }
          }, (err) => {
            this.$msg(err)
          })
        }, (err) => {
              this.$msg(err)
            })
    },

    // 获取本地的音乐
    getLocalMusic (userId, tag) {
          let fecthUrl = '/admin/collect/getCollectMusic';
          fecth.get(fecthUrl, {
              userId: userId
          }).then((res) => {
                var list = [];
                if (res.data){
                  res = res.data;
                  res.data.forEach((value, index, array) => {
                    var ar = {
                      name: value.singerName
                    }
                    var al = {
                      picUrl: value.musicPicurl,
                      id: value.albumId,
                      name: value.albumName
                    }
                    var data = {
                      dt: value.musicDur,
                      id: value.musicId,
                      name: value.musicName,
                      al: al,
                      ar:{
                        0: ar,
                        picUrl: value.musicPicurl
                      },
                      singer_id: value.singerId,
                      singer_name: value.singerName
                    }
                    list.push(data)
                  })
                }
              if (tag == 1){
                store.commit({
                  type: 'setMusicCollectList',
                  data: list
                })
                store.commit({
                  type: 'setMusicList',
                  data: list
                })
              }
              if (tag == 2){
                store.commit({
                  type: 'setMusicCollectListMyself',
                  data: list
                })
              }
          }, (err) => {
              this.$msg(err)
          })
    },

    // 删除收藏的音乐
    deleteMusic (id) {
            let fecthUrl = '/api/admin/collect/deleteCollectMusic'
            fecth.get(fecthUrl, {
                musicId: id
            }).then((res) => {
                if (res.data.data){
                  let collectlist = store.getters.getMusicCollectList
                  this.$msg('取消收藏成功！')
                  collectlist.forEach((v, i, a) => {
                    if (id === v.id) {
                      collectlist.splice(i, 1)
                      return
                    }
                  })
                  store.commit({
                    type: 'setMusicCollectList',
                    data: collectlist
                  })
                } else {
                  this.$msg(res.data.errmsg);
                }
            }, (err) => {
                this.$msg(err)
            })
    },

    // 播放暂停
    playPause () {
        try {
            const ele = store.getters.getAudioEle
            if (!(ele.src.indexOf('.mp3') > 0)) return
            if (ele.paused) {
                ele.play()
            } else {
                ele.pause()
            }
            store.commit('setAudioIsPlay', !ele.paused)
        } catch (e) {
            return
        }
    },
    // 播放下一曲  可调用clickPlayindex  更换index 即可 (第2个参数为 true 或者 false  true表示下一首  false 表示上一首     第3个参数是判断是不是正在播放的音乐触发更新音乐列表    如果是正在播放的音乐点击播放index 的歌曲  和 自动播放 手动播放下一首 则不触发重新填充数据的操作)
    playNextPrev (that, isNext) {
        // alert(store.getters.getCurrentAudio.index)
        // alert(store.getters.getMusicPlayList.length)
        let index = store.getters.getCurrentAudio.index || 0
        const length = store.getters.getMusicPlayList.length || 0
        const musicplaylist = store.getters.getMusicPlayList || []

        // 判断是否是随机模式
        if (this.typeType !== 3) {
            if (isNext) {
                index++
                if (index > length - 1) {
                    index = 0
                }
            } else {
                index--
                if (index < 0) {
                    index = length - 1
                }
            }
        } else {
            index = Math.floor(Math.random() * length)
        }

        if (musicplaylist[index] === undefined) {
            return
        }

        var reqId = musicplaylist[index].music_id ? musicplaylist[index].music_id : musicplaylist[index].id
        fecth.getBase(apiList.getCloudUrl,{id: reqId + '.mp3'}).then((res) => {
            if (res.data.data[0].url === null) {
                let initIndex = 0
                const currentMusic = {
                    index: store.getters.getCurrentAudio.index ? (isNext ? store.getters.getCurrentAudio.index + 1 : store.getters.getCurrentAudio.index - 1) : (isNext ? initIndex + 1 : initIndex)
                }
                store.commit({
                    type: 'setCurrentAudio',
                    data: currentMusic
                })
                this.playNextPrev(that, isNext)
                return
            }
            const newData = {
                id: reqId,
                name: musicplaylist[index].name ? musicplaylist[index].name : musicplaylist[index].music_name,
                url: musicApi.replaceUrl(res.data.data[0].url),
                singer: musicplaylist[index].al.name ? musicplaylist[index].al.name : musicplaylist[index].singer_name,
                duration: musicApi.getMusicDurantionType(musicplaylist[index].dt ? musicplaylist[index].dt : musicplaylist[index].music_dur),
                picurl: musicplaylist[index].al.picUrl,
                musicndex: index,
                list: store.getters.getMusicList,
                type: 'unupdate'
            }
            this.getMusicLrc(newData, that)
        }, (err) => {
            console.log(err)
        })
    },

    // 初始化音乐事件
    initAudioEvent (that) {
        // const _this = this
        // audio Dom元素
        const ele = store.getters.getAudioEle
        // const _this = this
        // 本地音乐初始化  （收藏的歌曲）
        // this.getLocalMusic.call(that)

        ele.onloadedmetadata = () => {
        }

        // 音乐播放结束事件
        ele.onended = () => {
            this.insetMusicListen()
            // 判断用户有没有登陆  登陆了存储用户播放音乐数据
            this.playNextPrev(that, true)
        }
        ele.ontimeupdate = function () {
            if (!that.isDrag) {
                const ele = store.getters.getAudioEle
                const duration = Math.floor(ele.duration)
                const currentT = Math.floor(ele.currentTime)
                musicApi.scrollLyric(currentT, that)
                // 设置currentT
                store.dispatch('set_AudioCurrentTime', currentT)
                // 设置duration
                store.dispatch('set_AudioCurrentD', currentT / duration * 100)
            }
        }
        // 监听缓冲的进度
        ele.onprogress = function () {
            const durationT = Math.floor(ele.duration)
            try {
               if (ele.buffered.length > 0) {
                    var bufferedT = 0
                    for (var i = 0; i < ele.buffered.length; i++) {
                        bufferedT += ele.buffered.end(i) - ele.buffered.start(i)
                        if (bufferedT > durationT) {
                            bufferedT = durationT
                            console.log('缓冲完成')
                        }
                    }
                    var bufferedP = Math.floor((bufferedT / durationT) * 100)
                    that.bufferingP = bufferedP
               }
            } catch (e) {
                return
            }
        }
        // ele.onabort = function () {
        //     this.playNextPrev(that, true)
        // }
    },
    dragMouseDown (that, event) {
        const ele = store.getters.getAudioEle
        if (ele.src.indexOf('.') < 0) return
        var _this = this
        that.isDrag = true
        let e = event || window.event
        var x = e.clientX
        let l = e.target.offsetLeft
        _this.maxProgressWidth = document.getElementById('music_progressD').offsetWidth
        const moveProgress = document.getElementById('music_progress')
        // console.log(this.maxProgressWidth)
        moveProgress.onmousemove = function (event) {
            if (that.isDrag) {
                let e = event || window.event
                let thisX = e.clientX
                _this.dragProgressTo = Math.min(_this.maxProgressWidth, Math.max(0, l + (thisX - x)))
                _this.updateDragProgress(that, _this.maxProgressWidth, _this.dragProgressTo)
                // console.log(_this.dragProgressTo)
                // console.log(_this.maxProgressWidth)
            }
        }
        moveProgress.onmouseup = function (event) {
            const durationT = ele.duration
            if (that.isDrag) {
                that.isDrag = false
                ele.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * durationT)
            }
        }
        moveProgress.onmouseleave = function (event) {
            const durationT = ele.duration
            if (that.isDrag) {
                that.isDrag = false
                ele.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * durationT)
            }
        }
    },
    dragTouchStart (that, event) {
        const ele = store.getters.getAudioEle
        if (ele.src.indexOf('.') < 0) return
        const _this = this
        that.isDrag = true
        const e = event || window.event
        _this.x = e.touches[0].clientX
        _this.l = e.target.offsetLeft
        _this.maxProgressWidth = document.getElementById('music_progressD').offsetWidth
        // console.log(this.maxProgressWidth)
    },
    dragTouchMove (that, event) {
        const _this = this
        if (that.isDrag) {
            let e = event || window.event
            let thisX = e.touches[0].clientX
            _this.dragProgressTo = Math.min(_this.maxProgressWidth, Math.max(0, _this.l + (thisX - _this.x)))
            _this.updateDragProgress(that, _this.maxProgressWidth, _this.dragProgressTo)
        }
    },
    dragTouchEnd (that, event) {
        const _this = this
        const ele = store.getters.getAudioEle
        const durationT = ele.duration
        if (that.isDrag) {
            that.isDrag = false
            ele.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * durationT)
        }
    },
    // 拖动  点击的进度效果   l length  to 移动的位置
    updateDragProgress (that, l, to) {
        const ele = store.getters.getAudioEle
        const durationT = ele.duration
        // const duration = Math.floor(ele.duration)
        // const currentT = Math.floor(ele.currentTime)
        musicApi.scrollLyric(Math.floor(to / l * durationT), that)
        // 设置currentT
        store.dispatch('set_AudioCurrentTime', Math.floor(to / l * durationT))
        // 设置duration
        store.dispatch('set_AudioCurrentD', (Math.floor(to / l * durationT)) / durationT * 100)
        // console.log(currentT + ' ---- ' + duration)
    },

    clickProgress (event) {
        const ele = store.getters.getAudioEle
        const durationT = ele.duration
        const e = event || window.event
        const l = e.offsetX
        const w = document.getElementById('music_progressD').offsetWidth
        // console.log(l + '------------' + w)
        ele.currentTime = Math.floor(l / w * durationT)
    },

    // 由于网易云地址有添加防盗链  m8c,m7c 的地址替换成m8,m7 就可以正常播放
    replaceUrl (url) {
        return url.indexOf('//m7c') < 0 ? (url.indexOf('//m8c') ? url.replace('//m8c', '//m8') : url) : url.replace('//m7c', '//m7')
    },

    insetMusicListen () {
        // todoUserInfo().then((res) => {
        //     let index = store.getters.getCurrentAudio.index
        //     let musicplaylist = store.getters.getMusicPlayList
        //     // let options = {
        //     //     userid: res.id,
        //     //     username: res.username,
        //     //     music_id: musicplaylist[index].music_id || musicplaylist[index].id,
        //     //     music_name: musicplaylist[index].music_name || musicplaylist[index].name,
        //     //     singer_id: musicplaylist[index].singer_id || musicplaylist[index].ar[0].id,
        //     //     singer_name: musicplaylist[index].singer_name || musicplaylist[index].ar[0].name,
        //     //     album_id: musicplaylist[index].album_id || musicplaylist[index].al.id,
        //     //     album_name: musicplaylist[index].album_name || musicplaylist[index].al.name,
        //     //     music_dur: musicplaylist[index].music_dur || musicplaylist[index].dt,
        //     //     music_picurl: musicplaylist[index].music_picurl || musicplaylist[index].al.picUrl,
        //     //     listen_time: Utils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        //     // }
        //     // let fecthUrl = 'http://www.daiwei.org/vue/server/user.php?inAjax=1&do=userMusicListen'
        //     // fecthPromise(fecthUrl, options).then((res) => {
        //     //     console.log(options.music_name + '播放完成')
        //     // }, (err) => {
        //     //     vueExp.$msg(err)
        //     // })
        // }, (err) => {
        //     // vueExp.$msg(err.msg)
        //     // vueExp.$router.push({ path: '/user/login' })
        // })
    },

    setPlayType (type) {
        this.typeType = Number.parseInt(type)
        // 设置本地存储和 store
        store.dispatch({
            type: 'set_AudioPlayType',
            data: this.typeType
        })
        localStorage.setItem('audioPlayType', this.typeType)
    }
}

export default musicApi
