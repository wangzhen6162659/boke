const shareInfo = {
  state: {
    shareUrl: "",
    shareImg: "",
    shareDesc: "",
    shareTitle: "",
  },
  getters: {
    getShareInfo: state => state.shareInfo
  },
  mutations: {
    setShareInfo (state, obj) {
      state.shareInfo = obj.data
    }
  },
  actions: {
    set_ArticList ({commit}, obj) {
      // alert(JSON.stringify(obj.data))
      commit('setShareInfo', obj)
    }
  }
}

export default shareInfo
