import instance from '../../utils/http'
// 导入接口API函数
import { reqSwiperData } from '../../api/index'
Page({
  async handler() {
    const res = await reqSwiperData()
    console.log(res)

    // 第一种调用方式：通过 then 和 catch 接收返回的值
    // instance
    //   .request({
    //     url: 'https://gmall-prod.atguigu.cn/mall-api/index/findBanner',
    //     method: 'GET'
    //   })
    //   .then((res) => {
    //     console.log(res)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })

    // 第二种调用方式：通过 await 和 async 接收返回的值
    // const res = await instance.request({
    //   url: '/index/findBanner',
    //   method: 'GET'
    // })
    // /index/findBanner
    // const res = await instance.get('/cart/getCartList').catch((err) => {
    //   console.log(err)
    // })

    // console.log(res)

    // instance.get('/index/findBanner').then(() => {
    //   instance.get('/index/findBanner').then(() => {})
    // })
    // const res = await instance.get('/index/findBanner', null, {
    //   isLoading: true
    // })
    // console.log(res)

    // const res = await instance.get('/index/findBanner')
    // console.log(res)
  },
  handler1() {
    wx.request({
      url: 'https://gmall-prod.atguigu.cn/mall-api/index/findBanner',

      method: 'GET',
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  async allHandler() {
    //   // 当前一个请求结束后，才能发起下个请求
    //   await instance.get('/index/findBanner')
    //   await instance.get('/index/findCategory1')
    //   await instance.get('/index/findBanner')
    //   await instance.get('/index/findCategory1')

    // await Promise.all([instance.get('/index/findBanner'), instance.get('/index/findCategory1')])

    const res = await instance.all([
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1'),
      instance.get('/index/findBanner'),
      instance.get('/index/findCategory1')
    ])
    console.log(res)
  },
  data: {
    avatarUrl: '../../assets/images/avatar.png'
  },
  async chooseAvatar(event) {
    // 目前获取的微信头像是临时路径
    // 临时路径是有失效时间的，在实际开发中，需要将临时路径上传到公司的服务器
    const { avatarUrl } = event.detail

    const { data: avatar } = await instance.upload(
      '/fileUpload',
      avatarUrl,
      'file'
    )
    this.setData({
      avatarUrl: avatar
    })

    // this.setData({
    //   avatarUrl
    // })
    // wx.uploadFile({
    //   // 要上传的文件路径
    //   filePath: avatarUrl,
    //   // 文件对应的key，
    //   name: 'file',
    //   // 接口地址
    //   url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload',
    //   success: (res) => {
    //     //需要转换
    //     res.data = JSON.parse(res.data)
    //     this.setData({
    //       avatarUrl: res.data.data
    //     })
    //   }
    // })
  }
})
