// 引入 QQMapWX核心类
import QQMapWX from '../../../../../libs/qqmap-wx-jssdk'
// 导入async-validator对参数进行验证
import Schema from 'async-validator'
// 导入接口API函数
import {
  reqAddAddress,
  reqAddressInfo,
  reqUpdateAddress
} from '../../../../../api/address'
Page({
  // 页面的初始数据
  data: {
    // 需要将请求参数放到data对象下，方便在模版中绑定数据
    name: '', //收货人
    phone: '', //手机号码
    provinceName: '', //省
    provinceCode: '', //省编码
    cityName: '', //市
    cityCode: '', //市编码
    districtName: '', //区
    districtCode: '', //市编码
    address: '', //详细地址
    fullAddress: '', //完整地址
    isDefault: false //是否设置为默认地址，0不设 1 设
  },

  // 保存收货地址
  async saveAddrssForm(event) {
    // 组织参数（完整地址、是否设置为默认地址）

    const { provinceName, cityName, districtName, address, isDefault } = this.data

    // 最终需要发送的请求参数
    const params = {
      ...this.data,
      fullAddress: provinceName + cityName + districtName + address,
      isDefault: isDefault ? 1 : 0
    }
    // 对组织以后得参数进行验证，验证通过以后，需要调用新增的接口实现新增收货地址功能
    const { valid } = await this.validatorAddress(params)

    // 如果验证没有通过，不继续执行后续的逻辑
    if (!valid) return

    // 发送请求，保存收货地址
    const res = this.addressId
      ? await reqUpdateAddress(params)
      : await reqAddAddress(params)
    console.log(res)
    if (res.code === 200) {
      wx.navigateBack({
        success: () => {
          wx.toast({ title: this.addressId ? '修改收货地址成功' : '新增收货地址成功' })
        }
      })
    }
  },
  // 对新增收货地址请求参数进行验证
  validatorAddress(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证手机号，是否符合中国大陆手机号码的格式
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

    // 创建验证规则
    const rules = {
      name: [
        { required: true, message: '请输入收货人姓名' },
        { pattern: nameRegExp, message: '收货人姓名不合法' }
      ],
      phone: [
        { required: true, message: '请输入收货人手机号' },
        { pattern: phoneReg, message: '收货人手机号不合法' }
      ],
      provinceName: { required: true, message: '请选择收货人所在地区' },
      address: { required: true, message: '请输入详细地址' }
    }
    // 传入验证规则进行实例化
    const validator = new Schema(rules)
    // 调用实例方法对请求参数进行验证
    // 注意：我们希望将验证结果通过 Promsie 的形式返回给函数的调用者
    return new Promise((resolve) => {
      validator.validate(params, (errors) => {
        if (errors) {
          // 如果验证失败，需要给用户进行提示
          wx.toast({ title: errors[0].message })
          // 如果属性值是false ，说明验证失败
          resolve({ valid: false })
        } else {
          // 如果属性值是true ，说明验证失败
          resolve({
            valid: true
          })
        }
      })
    })
  },

  // 省市区选择
  onAddressChange(event) {
    // console.log(event)

    // 解构省市区以及编码
    const [provinceName, cityName, districtName] = event.detail.value
    const [provinceCode, cityCode, districtCode] = event.detail.code

    this.setData({
      provinceName,
      cityName,
      districtName,
      provinceCode,
      cityCode,
      districtCode
    })
  }, //

  // 获取用户地理位置信息
  async onLocation() {
    // 获取当前地理位置信息（精度、维度、高度等）
    // const res = await wx.getLocation()
    // console.log(res);
    // 打开地图选择位置，获取 纬度 、精度
    const { latitude, longitude, name } = await wx.chooseLocation()
    // 使用reverseGeocoder方法进行逆地址解析
    this.qqmapwx.reverseGeocoder({
      location: {
        longitude,
        latitude
      },
      success: (res) => {
        // 获取省市区、省市区编码
        const { adcode, province, city, district } = res.result.ad_info
        // 获取街道、门牌（可能为空）
        const { street, street_number } = res.result.address_component
        // 获取标准地址
        const { standard_address } = res.result.formatted_addresses

        // 对获取的数据进行格式化、组织。然后赋值给data中的字段
        this.setData({
          // 省
          provinceName: province,
          // 如果是省，前两位有值，后四位是0
          provinceCode: adcode.replace(adcode.substring(2, 6), '0000'),
          // 市
          cityName: city,
          // 如果是市，前4位有值，后2位是0
          cityCode: adcode.replace(adcode.substring(4, 6), '00'),
          // 区
          // 东莞市、中山市、儋州市、嘉峪关市 因其下无区县级
          districtName: district,
          districtCode: district && adcode,
          // 组织详细地址
          address: street + street_number + name,
          //组织完整地址
          fullAddress: standard_address + name
        })
      }
    })

    // // 调用 getSetting 方法获取用户所有的授权信息
    // // 返回的 authSetting 包含小程序已向小程序申请过的权限已经授权结果(true、false)
    // const { authSetting } = await wx.getSetting()
    // console.log(authSetting)

    // // scope.userLocation 是否已经授权获取地理位置的信息
    // // 如果之前没有申请过返回 undefined，需要调用 getLocation
    // // 如果之前同意了授权，返回 true，需要调用 getLocation
    // // 如果之前拒绝了授权，返回 false，需要用户手动进行授权
    // // 等于 true，或者不等于 undefined，说明需要进行授权
    // // const isAuth =
    // //   authSetting['scope.userLocation'] ||
    // //   authSetting['scope.userLocation'] === undefined

    // // 为了避免冗余的条件判断，使用 !! 把代码进行优化
    // const isAuth = !!authSetting['scope.userLocation']

    // if (!isAuth) {
    //   // 弹窗询问用户是否进行授权
    //   const modalRes = await wx.modal({
    //     title: '授权提示',
    //     content: '需要需要您的地理位置信息，请确认授权'
    //   })

    //   // 如果用户点击了取消，说明用户拒绝了授权，给用户提示
    //   if (!modalRes) return wx.toast({ title: '您拒绝了授权' })

    //   // 如果用户点击了确定，调用 wx.openSetting 打开微信客户端小程序授权页面
    //   // 并返回授权以后的结果
    //   const { authSetting } = await wx.openSetting()

    //   // 如果用户没有更新授权信息，提示没有更新授权
    //   if (!authSetting['scope.userLocation'])
    //     return wx.toast({ title: '授权失败！' })

    //   try {
    //     // 如果用户更新授权信息，则调用 getLocation 获取用户地理位置信息
    //     const locationRes = await wx.getLocation()
    //     // 打印地理位置信息
    //     console.log(locationRes)
    //   } catch (err) {
    //     console.log(err)
    //   }
    // } else {
    //   try {
    //     // 如果是第一次调用 getLocation 或者之前授权过
    //     // 直接调用 getLocation 获取用户信息即可
    //     const locationRes = await wx.getLocation()
    //     console.log(locationRes)
    //   } catch (error) {
    //     wx.toast({ title: '您拒绝授权获取地址位置' })
    //   }
    // }
  },

  // 用来处理更新相关的逻辑
  async showAddressInfo(id) {
    // 判断是否存在id
    if (!id) return
    // 将id挂载到当前页面的实例（this）上，方便在多个方法中使用ID
    this.addressId = id
    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: '更新收货地址'
    })
    // 调用方法获取收货地址详细信息
    const { data } = await reqAddressInfo(id)
    // 将获取的数据进行赋值
    this.setData(data)
  },
  onLoad(options) {
    // 对核心类QQMapWX进行实例化
    this.qqmapwx = new QQMapWX({
      // key要使用自己的
      key: 'EMVBZ-473W4-LTAU4-FZ5TO-RMHYV-TIFCZ'
    })
    // 调用方法，实现更新 的业务逻辑
    this.showAddressInfo(options.id)
  }
})
