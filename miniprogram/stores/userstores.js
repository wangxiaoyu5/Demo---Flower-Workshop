// observable 创建被监测的对象，对象中的属性会被转换为响应式数据
// action 函数用来显示action方法
import { observable, action } from 'mobx-miniprogram'
import { getStorage } from '../utils/storage'
export const userStore = observable({
  // 定义响应式数据


  // token身份令牌
  token: getStorage('token') || '',
  // 用户信息
  userInfo:getStorage('userInfo')||'',
  // 定义action
  // settoken用来修改更新token
  setToken: action(function (token) {
    // 在调用setToken方法时，需要传入token数据进行赋值
    this.token = token
  }),

// 对用户信息进行赋值
setUserInfo: action(function (userInfo) {
  // 在调用setToken方法时，需要传入token数据进行赋值
  this.userInfo = userInfo
})
})
