// pages/profile/profile.js
import { userBehavior } from './behavior'
import { getStorage, setStorage } from '../../../../utils/storage'
import { toast } from '../../../../utils/extendApi'
import { reqUploadFile, reqUpdataUserInfo } from '../../../../api/user'
Page({
  // 注册behavior
  behaviors: [userBehavior],

  // 页面的初始数据
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },
  // 更新用户信息
  async updataUserInfo() {
    // 调用接口API函数更新
    const res = await reqUpdataUserInfo(this.data.userInfo)
    if (res.code === 200) {
      // 用户信息更新以后，需要将最新的用户信息存储到本地

      setStorage('userInfo', this.data.userInfo)
      // 用户信息更新以后，需要将最新的用户信息同步到Store

      this.setUserInfo(this.data.userInfo)

      // 给用户进行提示
      toast({ title: '用户信息更新成功' })
    }
  },

  // 更新用户头像
  async chooseAvatar(event) {
    // console.log(event)

    // 获取头像的临时路径
    // 临时路径具有失效时间，需要将临时路径上传到公司的服务器，获取永久的路径
    // 在获取永久路径以后，需要使用永久路径更新 headimgurl
    // 用户点击 保存按钮，才算真正的更新了头像和昵称
    const { avatarUrl } = event.detail
    // 第二种本地资源上传的方式：使用mina-request提供的upload实例方法
    const res = await reqUploadFile(avatarUrl, 'file')
    // console.log(res)
    this.setData({
      'userInfo.headimgurl': res.data
    })
    // 第一种本地资源上传的方式
    // 在获取头像临时路径后，需要将临时路径通过 wx.uploadFile 上传到服务器
    //   wx.uploadFile({
    //     url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload', //开发者服务器地址

    //     filePath: avatarUrl, //要上传的文件资源路径
    //     name: 'file', //文件对应的key
    //     header: {
    //       token: getStorage('token')
    //     },
    //     success: (res) => {
    //       // console.log(res)
    //       // 调用uploadfile方法，返回的数据是JSON字符，需要自己使用JSON.parse进行转换
    //       const uploadRes = JSON.parse(res.data)
    //       // console.log(uploadRes)
    //       this.setData({
    //         'userInfo.headimgurl': uploadRes.data
    //       })
    //     }
    //   })

    // this.setData({
    //   'userInfo.headimgurl': avatarUrl
    // })
  },
  getNiceName(event) {
    // console.log(event)
    const { nickname } = event.detail.value
    // console.log(nickname)
    this.setData({
      'userInfo.nickname': nickname,
      isShowPopup: false
    })
  },
  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true,
      'userInfo.nickname': this.data.userInfo.nickname
    })
  },

  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  }
})
