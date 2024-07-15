// 导入接口API函数
import { reqAddressList, requelAddress } from '../../../../../api/address'
Page({
  // 页面的初始数据
  data: {
    addressList: []
  },
  async delAddress(event) {
    // 解构传递的id
    const { id } = event.currentTarget.data

    const modalRes = await wx.modal({
      content: '您确认删除该收货地址吗'
    })
    if (modalRes) {
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
  }
  // onload 是在页面加载中触发
  //如果当前页面没有销毁，onLoad 钩子函数只会执行一次
  //如果点击了新增、编辑，不会销毁当前页面然后进行新增、编辑页面
  // 在新增、编辑以后，返回到列表页面，这时候 onLoad 不会触发执行
  // 就不会获取最新的数据
  //   onLoad(){
  //   }
})
