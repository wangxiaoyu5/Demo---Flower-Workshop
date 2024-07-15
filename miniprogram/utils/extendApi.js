// const toast = (options = {}) => {}

/**
 * @description 消息提示框
 * @param {Object} options 参数和wx.shoeToast参数保持一致
 */

const toast = ({ title = '数据加载中...', icon = 'none', duration = 2000, mask = true } = {}) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}

/**
 * @description 模态对话框
 * @param {Object} options 参数和wx.shoeModal参数保持一致
 */

//无参数
const modal = (options = {}) => {
  // 使用 Promise 处理 wx.showModal 的返回结果
  return new Promise((resolve) => {
    // 默认参数
    const defaultOpt = {
      title: '提示',
      content: '您确定执行该操作吗？', // 提示的内容
      onfirmColor: '#f3514f'
    }

    // 将传入的参数和默认的参数进行合并
    const opts = Object.assign({}, defaultOpt, options)

    wx.showModal({
      // 将合并的参数赋值传递给 showModal 方法
      ...opts,
      complete({ confirm, cancel }) {
        confirm && console.log('点击了确定')
        cancel && console.log('点击了取消')
      }
    })
  })
}

wx.toast = toast
wx.modal = modal
export { toast, modal }
