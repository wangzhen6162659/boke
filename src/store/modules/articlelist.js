const articlelist = {
  state: {
    articleTypes: [],
    articleList: []
  },
  getters: {
    getArticleList: state => state.articleList
  },
  mutations: {
    setArticList (state, obj) {
      state.articleList = obj.data
    }
  },
  actions: {
    set_ArticList ({commit}, obj) {
      // alert(JSON.stringify(obj.data))
      commit('setArticList', obj)
    }
  }
}

export default articlelist
