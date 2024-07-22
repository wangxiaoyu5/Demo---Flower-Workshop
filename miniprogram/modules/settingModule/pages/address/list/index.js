// 导入接口API函数
import { reqAddressList, reqDelAddress } from '@/api/address'
import { swipeCellBehavior } from '@/behaviors/swipeCell'
// 获取全局的应用实例
const app = getApp()
Page({
  behaviors: [swipeCellBehavior],

  // 页面的初始数据
  data: {
    addressList: []
  },

  // 删除收货地址
  async delAddress(event) {
    // 解构传递的id
    const { id } = event.currentTarget.dataset
    // 询问用户是否确认删除
    const modalRes = await wx.modal({
      content: '您确认删除该收货地址吗'
    })
    // 如果用户确认删除，需要调用接口API
    // 同时需要给用户提示
    if (modalRes) {
      await reqDelAddress(id)
      wx.toast({ title: '收货地址删除成功' })
      this.getAddressList()
    }
  },

  // 去编辑页面
  toEdit(event) {
    // 获取要更新的收获id
    const { id } = event.currentTarget.dataset

    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },
  async getAddressList() {
    const { data: addressList } = await reqAddressList()
    this.setData({
      addressList
    })
  },
  onShow() {
    this.getAddressList()
  },
  // onload 是在页面加载中触发
  //如果当前页面没有销毁，onLoad 钩子函数只会执行一次
  //如果点击了新增、编辑，不会销毁当前页面然后进行新增、编辑页面
  // 在新增、编辑以后，返回到列表页面，这时候 onLoad 不会触发执行
  // 就不会获取最新的数据

  changeAddress(event) {
    //需要判断是否是从结算支付贡面进入的收货地址列表页面
    //如果是，才能够头取点击的收货她址，否则，不执行后续的逻辑，不执行切换收货地址的逻辑
    if (this.flag !== '1') return

    // 如果是从结算支付贡面进入的收货地址列表页面，需要获取点击的收获地址详细信息
    const addressId = event.currentTarget.dataset.id
    // 从收货地址列表中获取到获取到点击的收货地址详细信息
    const address = this.data.addressList.find((item) => item.id === addressId)
    // 如果获取成功，将数据存储到 globalData 中
    if (address) {
      app.globalData.address = address
      wx.navigateBack()
    }
  },

  onLoad(options) {
    // 接受传递的参数，挂载到页面的实例上，方便其他方法中使用
    this.flag = options.flag
  }
})
