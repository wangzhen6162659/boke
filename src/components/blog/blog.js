import store from 'store'
import {fecthPromiseJson} from 'common/api/user.js'
const blogApi = {
  getArticleList (axiodata, list) {
    return new Promise((resolve, reject) => {
      let apiUrl = 'http://192.168.1.124:9999/api/admin/article/pageByUser'
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
