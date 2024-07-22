import { reqGoodsInfo } from '@/api/goods'
import { reqAddcart, reqCartList } from '@/api/cart'
// 导入创建的behavior
import { userBehavior } from '@/behaviors/userBehavior'
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: 0, //控制是加入购物车还是立即购买 0 加入购物车 1立即购买
    allCount: ''
  },
  // 全屏预览图片
  previewImage() {
    wx.previewImage({
      urls: this.data.goodsInfo.detailList
    })
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({ show: false })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    console.log(event.detail)
    this.setData({
      count: Number(event.detail)
    })
  },
  // 弹窗的确定按钮触发的事件处理函数
  async handlerSubmit() {
    // 解构相关的数据
    const { token, count, blessing, buyNow } = this.data
    //  获取商品的id
    const goodsId = this.goodsId

    // 判断用户是否进行了登陆，如果没有登陆需要跳转到登陆页面
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    // 区分处理加入购物车已经立即购买
    // buyNow === 0 加入购物车
    // buyNow === 1 立即购买
    if (buyNow === 0) {
      const res = await reqAddcart({
        goodsId,
        count,
        blessing
      })
      if (res.code === 200) {
        wx.toast({
          title: '加入购物车成功'
        })
        // 再加入购物车成功以后，需要重新计算购物车商品的购买数量
        this.getCartCount()

        this.setData({
          show: false
        })
      }
    } else {
      wx.navigateTo({
        url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId} & blessing=${blessing}`
      })
    }
  },
  // 计算购物车商品的数量
  async getCartCount() {
    // 使用token判断用户是否登陆
    // 如果没有token 说明用户没有登陆，就不执行后续的逻辑
    if (!this.data.token) return
    // 如果有token 说明用户进行了登陆，获取购物车列表的数据
    // 然后计算的出购买的数量
    const res = await reqCartList()
    // 判断购物车中是否存在商品
    if (res.data.length !== 0) {
      let allCount = 0
      res.data.forEach((item) => {
        allCount += item.count
      })
      this.setData({
        //info 属性的属性值要求是 字符串类型
        //而且如果购买的数量大于 99，页面上需要展示 99+
        allCount: allCount > 99 ? '99+' : allCount + ''
      })
    }
  },

  // 获取商品详情的数据
  async getGoodsInfo() {
    const { data: goodsInfo } = await reqGoodsInfo(this.goodsId)
    this.setData({
      goodsInfo
    })
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // 将商品 id 挂载到this上
    this.goodsId = options.goodsId
    // 调用获取商品详情数据的方法
    this.getGoodsInfo()

    // 计算购买的数量
    this.getCartCount()
  },
  // 转发功能，转发给好友、群聊
  onShareAppMessage() {
    return {
      title: '所有的怦然心动，都是你',
      path: '/pages/index/index',
      imageUrl: '../../../../../assets/images/love.jpg'
    }
  },
  // 能够把小程序分享到朋友圈
  onShareTimeline() {}
})
