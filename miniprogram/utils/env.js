//配置环境变量

//当前小程序的账户信息
const { miniProgram } = wx.getAccountInfoSync()
// 获取小程序的版本
const { envVersion } = miniProgram

let env = {
  baseURL: 'https://gmall-prod.atguigu.cn/mall-api'
}

switch (envVersion) {
  case 'develop':
    env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  case 'trial':
    env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
    break
  case 'reless':
    env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
    break

  default:
    env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
    break
}
export { env }
