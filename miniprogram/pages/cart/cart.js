import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/stores/userstores'
import {
  reqCartList,
  reqUpdateChecked,
  reqCheckAllStatus,
  reqAddcart,
  reqDelCart
} from '@/api/cart'
// debounce 防抖方法
import { debounce } from 'miniprogram-licia'
// 导入让删除滑块自动弹回的 behavior
import { swipeCellBehavior } from '@/behaviors/swipeCell'

// 导入miniprogram-computed 提供的behavior
const computedBehavior = require('miniprogram-computed').behavior

ComponentWithStore({
  // 注册behavior
  behaviors: [swipeCellBehavior, computedBehavior],
  // 让页面和Store对象建立关联
  storeBindings: {
    store: userStore,
    fields: ['token']
  },
  // 定义计算属性
  // 计算属性会被挂载到data对象中
  computed: {
    // 判断是否全选
    // computed 函数中不能访问 this
    // 如果想访问data中的数据，需要使用形参

    selectAllStatus(data) {
      return (
        data.cartList.length !== 0 && data.cartList.every((item) => item.isChecked === 1)
      )
    },

    // 计算商品价格总和
    totalPrice(data) {
      //  用来对订单总金额进行累加
      let totalPrice = 0
      data.cartList.forEach((item) => {
        // 需要判断商品是否是选中的状态，isChecked是否等于1
        if (item.isChecked === 1) {
          totalPrice += item.price * item.count
        }
      })
      return totalPrice
    }
  },

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },

  // 组件的方法列表
  methods: {
    // 跳转到订单结算页面
    toOrder() {
      // 判断用户是否勾选了商品
      if (this.data.totalPrice === 0) {
        wx.toast({
          title: '请选择需要购买的商品'
        })
        return
      }
      wx.navigateTo({
        url: '/modules/orderPayModule/pages/order/detail/detail'
      })
    },

    // 更新购买的数量
    changeBuyNum: debounce(async function (event) {
      // 获取最新的购买数量，
      // 如果用户输入的值大于 200，购买数量需要重置为 200
      // 如果不大于 200，直接返回用户输入的值
      const newBuyNum = event.detail > 200 ? 200 : event.detail
      // 获取商品的 ID 和 索引
      const { id: goodsId, index, oldbuynum } = event.target.dataset
      // 验证用户输入的值，是否是 1 ~ 200 直接的正整数
      const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
      // 对用户输入的值进行验证
      const regRes = reg.test(newBuyNum)

      // 如果验证没有通过，需要重置为之前的购买数量
      if (!regRes) {
        this.setData({
          [`cartList[${index}].count`]: oldbuynum
        })

        return
      }

      // 如果通过，需要计算差值，然后将差值发送给服务器，让服务器进行逻辑处理
      const disCount = newBuyNum - oldbuynum

      // 如果购买数量没有发生改变，不发送请求
      if (disCount === 0) return

      // 发送请求：购买的数量 和 差值
      const res = await reqAddcart({ goodsId, count: disCount })

      // 服务器更新购买数量成功以后，更新本地的数据
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].count`]: newBuyNum,

          // 如果购买数量发生了变化，需要让当前商品变成选中状态
          [`cartList[${index}].isChecked`]: 1
        })
      }
    }, 500),

    // 实现全选和全不选
    async updateAllStatus(event) {
      // 获取全选按钮的选中状态
      const { detail } = event
      // 需要将选中的状态转换后接口 需要使用的数据
      const isChecked = detail ? 1 : 0
      // 调用接口实现全选和全不选
      const res = await reqCheckAllStatus(isChecked)
      if (res.code === 200) {
        // this.showTipGetList()
        // 对购物车列表数据进行深拷贝
        const newCartList = JSON.parse(JSON.stringify(this.data.cartList))
        newCartList.forEach((item) => (item.isChecked = isChecked))

        // 对cartList进行赋值，驱动视图更新
        this.setData({
          cartList: newCartList
        })
      }
    },

    // 更新商品的购买状态
    async updateChecked(event) {
      console.log(event)
      // 获取最新的购买状态
      const { detail } = event
      // 获取传递的商品ID以及索引
      const { id, index } = event.target.dataset
      //将最新的购买状态转换成后端接口需要的0 和 1
      const isChecked = detail ? 1 : 0

      const res = await reqUpdateChecked(id, isChecked)
      if (res.code === 200) {
        //服务器更新购买状态成功以后，获取最新的购物车列表数据更新状态
        // this.showTipGetList()
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },

    // 展示文案同时获取购物车列表数据
    async showTipGetList() {
      // 解构数据
      const { token } = this.data

      // 判断用户是否进行了登陆
      if (!token) {
        this.setData({
          emptyDes: '您尚未登录，点击登陆获取更多权益',
          cartList: []
        })
        return
      }
      //进行了登陆
      const { code, data: cartList } = await reqCartList()
      if (code === 200) {
        this.setData({
          cartList,
          emptyDes: cartList === 0 && '还没有添加商品'
        })
      }
    },

    // 删除购物车中的商品
    async delCartGoods(event) {
      // 获取需要删除商品的 id
      const { id } = event.currentTarget.dataset

      // 询问用户是否删除该商品
      const modalRes = await wx.modal({
        content: '您确认删除该商品吗？'
      })

      if (modalRes) {
        await reqDelCart(id)
        this.showTipGetList()
      }
    },

    //如果使用 Component 方法来构建页面
    //生命周期钩子函数数需要写到 methods 中才可以
    onShow() {
      this.showTipGetList()
    },
    onHide() {
      // 在页面隐藏的时候，需要让页面自动弹回
      this.onSwipeCellCommonClick()
    }
  }
})
