//导入封装的 网络请求模块实例

import http from '../utils/http'

export const reqIndexData = () => {
  // 通过Promise.all进行并发请求
  // return Promise.all([
  //   http.get('/index/findBanner'),
  //   http.get('/index/findCategory1'),
  //   http.get('/index/advertisement'),
  //   http.get('/index/findListGoods'),
  //   http.get('/index/findRecommendGoods')
  // ])
  // 使用封装的all方法发送请求
  return http.all(
    http.get('/index/findBanner'),
    http.get('/index/findCategory1'),
    http.get('/index/advertisement'),
    http.get('/index/findListGoods'),
    http.get('/index/findRecommendGoods')
  )
}
