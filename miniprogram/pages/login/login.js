// pages/login/login.js
// 导入封装通用模块方法
import { toast } from '../../utils/extendApi'
// 导入接口API函数
import { reqLogin, reqUserInfo } from '../../api/user'
// 导入本地存储api
import { setStorage } from '../../utils/storage'
// 导入ComponentWithStore方法
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
// 导入store对象
import { userStore } from '../../stores/userstores'

// 使用ComponentWithStore方法
ComponentWithStore({
  // 让页面和store对象建立关联
  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo'],
    actions: ['setToken', 'setUserInfo']
  },
  methods: {
    //进行授权登陆
    login() {
      //使用wx.login获取用户的临时登陆凭证code
      wx.login({
        success: async ({ code }) => {
          // console.log(code);

          if (code) {
            // 在获取到临时登陆凭证code后需要传递给开发者服务器
            const res = await reqLogin(code)
            // console.log(res)
            // 登陆成功以后，需要将服务器响应的自定义登录态存储到本地
            setStorage('token', res.data.token)
            // 将自定义登录态token存储到Store对象
            this.setToken(res.data.token)

            // 获取用户信息
            this.getUserInfo()
            // 返回上一级页面
            wx.navigateBack()
          } else {
            toast({ title: '授权失败，请重新授权' })
          }
        }
      })
    },
    // 获取用户信息
    async getUserInfo() {
      // 调用接口，获取用户信息
      const { data } = await reqUserInfo()
      // 将用户信息存储到本地
      setStorage('userInfo', data)
      // 将用户信息存储到Store对象
      this.setUserInfo(data)
    }
  }
})
