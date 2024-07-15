import WxRequest from 'mina-request'
import { getStorage, clearStorage } from './storage'
import { modal, toast } from './extendApi'
import { env } from './env'
// ----------------- 实例化 ----------------------

// 对 WxRequest 进行实例化
const instance = new WxRequest({
  baseURL: env.baseURL, // 请求基准地址
  timeout: 10000, // 微信小程序 timeout 默认值为 60000
  isLoading: false
})

// // 配置请求拦截器
instance.interceptors.request = (config) => {
  // 在发送请求之前做些什么

  const token = getStorage('token')

  if (token) {
    // 如果存在 token ，则添加请求头
    config.header['token'] = token
  }

  return config
}

// 响应拦截器
instance.interceptors.response = async (response) => {
  //   console.log(response)

  const { isSuccess, data } = response

  if (!isSuccess) {
    wx.showToast({
      title: '网络异常请重试',
      icon: 'error'
    })
    return response
  }
  switch (data.code) {
    case 200:
      // 对响应数据做点什么
      return data

    case 208:
      const res = await modal({
        content: '鉴权失败，请重新登陆',
        showCancel: false //不显示取消按钮
      })

      if (res) {
        clearStorage()

        wx.navigateTo({
          url: '/pages/login/login'
        })
      }

      return Promise.resolve(response)

    default:
      toast({
        title: '程序出现异常，请联系客服'
      })
  }
}

// 将 WxRequest 的实例通过模块化的方式暴露出去
export default instance
export { env }
