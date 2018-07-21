import store from 'store'
import {fecthPromiseJson} from 'common/api/user.js'
import apiList from 'common/api/articleApiList.js'
const blogApi = {
  getArticleList (axiodata, list) {
    return new Promise((resolve, reject) => {
      let apiUrl = apiList.pageByUser
      fecthPromiseJson(apiUrl, axiodata).then((res) => {
        store.dispatch({
          type: 'set_ArticList',
          data: res.data.data
        })
        resolve(res.data.data)
      }, (err) => {
        reject(err)
      })
    })
  }
}
export default blogApi
