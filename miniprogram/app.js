// import { toast } from './utils/extendApi'
import './utils/extendApi'
// import { setStorage, getStorage, removeStorage, clearStorage } from './utils/storage'
import {
  asyncClearStorage,
  asyncGetStorage,
  asyncRemoveStorage,
  asyncSetStorage
} from './utils/storage'
App({
  async onShow() {
    // wx.showToast({
    //   title: 'title',
    //   duration: 2000,
    //   icon: icon,
    //   image: 'image',
    //   mask: true,
    //   success: (res) => {},
    //   fail: (res) => {},
    //   complete: (res) => {}
    // })
    // toast({ title: '数据加载完成', icon: 'success' })
    // wx.toast()
    // wx.toast({ title: '数据加载完成', icon: 'success' })
    // console.log('-----------')
    // wx.showModal({
    //   title: '提示', // 提示的标题
    //   content: '您确定执行该操作吗？', // 提示的内容
    //   confirmColor: '#f3514f',
    //   // 接口调用结束的回调函数（调用成功、失败都会执行）
    //   complete({ confirm, cancel }) {
    //     confirm && console.log('点击了确定')
    //     cancel && console.log('点击了取消')
    //   }
    // })
    // 不传入参数
    // const res = await wx.modal()
    // 传入参数
    // const res = await wx.modal({
    //   title: '新的提示',
    //   content: '您确定执行该操作吗？'
    // })
    // console.log(res)
    // setStorage('name', 'tom')
    // setStorage('age', '10')
    // const name = getStorage('name')
    // console.log(name)
    // removeStorage('name')
    // clearStorage()
    // asyncSetStorage('name', 'jerry').then((res) => {
    //   console.log(res)
    // })
    // asyncSetStorage('age', '10').then((res) => {
    //   console.log(res)
    // })
    // asyncGetStorage('name', 'jerry').then((res) => {
    //   console.log(res)
    // })
    // asyncRemoveStorage('name', 'jerry').then((res) => {
    //   console.log(res)
    // })
    // asyncClearStorage('name', 'jerry').then((res) => {
    //   console.log(res)
    // })
    // const accountInfo = wx.getAccountInfoSync()
    // console.log(accountInfo.miniProgram.envVersion)
  }
})
