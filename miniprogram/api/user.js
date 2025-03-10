import http from '../utils/http'

/**
 * @description 进行登录操作
 * @param {*} code  临时登陆凭证
 * @returns Promise
 */

export const reqLogin = (code) => {
  return http.get(`/weixin/wxLogin/${code}`)
}

/**
 * @description 获取用户信息
 * @returns Promise
 */

export const reqUserInfo = () => {
  return http.get(`/weixin/getuserInfo`)
}

/**
 * @description 实现本地资源上传
 * @param {*} filePath  要上传的文件资源路径
 * @param {*} name  文件对应的key
 * @returns Promise
 */

export const reqUploadFile = (filePath, name) => {
  return http.upload(`/fileUpload`, filePath, name)
}
/**
 * @description 更新用户信息
 * @param {*} userInfo 最新的头像和昵称
 * @returns Promise
 */
export const reqUpdataUserInfo = (userInfo) => {
  return http.post(`/weixin/updateUser`, userInfo)
}
