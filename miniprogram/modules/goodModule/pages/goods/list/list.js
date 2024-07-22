// pages/goods/list/index.js
import { reqGoodsList } from '@/api/goods'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    isFinish: false, // 判断数据是否加载完毕
    // isLoading: false, // 判断数据是否记载完毕
    requestData: {
      page: 1, // 页码
      limit: 10, // 每页请求多少条数据
      total: '',
      category1Id: '', // 一级分类 id
      category2Id: '' // 二级分类 id
    }
  },

  // 获取商品列表的数据
  async getGoodsList() {
    // // 数据真正请求中
    // this.data.isLoading = true
    const { data } = await reqGoodsList(this.data.requestData)
    // // 数据加载完毕
    // this.data.isLoading = false
    this.setData({
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total
    })
  },
  // 获取商品列表的数据
  onReachBottom() {
    const { goodsList, total, requestData } = this.data
    // 解构数据
    const { page } = requestData

    // 判断是否加载完毕，如果 isLoading 等于 true
    // 说明数据还没有加载完毕，不加载下一页数据

    // if (isLoading) return

    // 判断数据是否加载完毕
    if (total === goodsList.length) {
      // 如果相等，数据数据加载完毕
      // 如果数据加载完毕，需要给用户提示，同时不继续加载下一个数据
      this.setData({
        isFinish: true
      })
      return
    }

    this.setData({
      // 页码加一
      requestData: { ...this.data.requestData, page: page + 1 }
    })

    // 重新获取商品列表
    this.getGoodsList()
  },
  // 监听页面的下拉刷新
  onPullDownRefresh() {
    // 将数据进行重置

    this.setData({
      goodsList: [],
      total: 0,
      isFinish: false,
      requestData: { ...this.data.requestData, page: 1 }
    })

    // 重新获取列表数据
    this.getGoodsList()
  },

  onLoad(options) {
    // Object.assign 用来合并对象，后面对象对的属性会往前进行合并
    Object.assign(this.data.requestData, options)
    // 获取商品列表的数据
    this.getGoodsList()
  }, // 转发功能，转发给好友、群聊
  onShareAppMessage() {},
  // 能够把小程序分享到朋友圈
  onShareTimeline() {}
})
