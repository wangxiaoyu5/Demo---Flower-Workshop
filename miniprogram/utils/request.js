// 创建 WxRequest 类
class WxRequest {
  // 默认参数对象
  defaults = {
    baseURL: '', // 请求基准地址
    url: '', // 开发者服务器接口地址
    data: null, // 请求参数
    method: 'GET', // 默认请求方法
    // 请求头
    header: {
      'Content-type': 'application/json' // 设置数据的交互格式
    },
    timeout: 60000, // 小程序默认超时时间是 60000，一分钟
    // 其他参数...
    isLoading: true // 是否显示 loading 提示框
  }

  // 定义拦截器对象，包含请求拦截器和响应拦截器方法，方便在请求或响应之前进行处理。
  interceptors = {
    // 请求拦截器
    request: (config) => config,
    // 响应拦截器
    response: (response) => response
  }
  // 初始化 queue 数组，用于存储请求队列
  queue = []

  // 定义 constructor 构造函数，用于创建和初始化类的属性和方法
  constructor(params = {}) {
    this.defaults = Object.assign({}, this.defaults, params)
  }

  /**
   * @description 发起请求的方法
   * @param { Object} options 请求配置选项，同 wx.request 请求配置选项
   * @returns Promise
   */
  request(options) {
    //// 如果有新的请求，则清空上一次的定时器
    this.timerId && clearTimeout(this.timerId)

    // 拼接完整的请求地址
    options.url = this.defaults.baseURL + options.url
    // 合并请求参数
    options = { ...this.defaults, ...options }

    if (options.isLoading && options.method !== 'UPLOAD') {
      // 在发送请求之前,添加loading效果

      this.queue.length === 0 && wx.showLoading()

      this.queue.push('request')
    }
    // 在发送请求之前调用请求拦截器
    options = this.interceptors.request(options)

    // console.log(options)

    // 使用 Promise 封装异步请求
    return new Promise((resolve, reject) => {
      // 使用 wx.request 发起请求
      if (options.method === 'UPLOAD') {
        wx.uploadFile({
          ...options,
          success: (res) => {
            res.data = JSON.parse(res.data)

            const mergeRes = Object.assign({}, res, {
              config: options,
              isSuccess: true
            })
            resolve(this.interceptors.response(mergeRes))
          },
          fail: (err) => {
            const mergeErr = Object.assign({}, err, {
              config: options,
              isSuccess: false
            })
            reject(this.interceptors.response(mergeErr))
          }
        })
      } else {
        wx.request({
          ...options,

          // 接口调用成功的回调函数
          success: (res) => {
            // 不管接口成功还是失败，都需要调用响应拦截器
            // 第一个参数：需要合并的目标对象
            // 第二个参数：服务器响应的数据
            // 第三个参数：请求配置以及自定义的属性
            const mergetRes = Object.assign({}, res, {
              config: options,
              isSuccess: true
            })
            resolve(this.interceptors.response(mergetRes))
          },

          // 接口调用失败的回调函数
          fail: (err) => {
            const mergetErr = Object.assign({}, err, {
              config: options,
              isSuccess: false
            })
            resolve(this.interceptors.response(mergetErr))
          },
          complete: () => {
            //不管成功还是失败
            // wx.hideLoading()
            if (options.isLoading && options.method !== 'UPLOAD') {
              // 每次请求结束后，从队列中删除一个请求标识
              this.queue.pop()
              this.queue.length === 0 && this.queue.push('request')

              // 等所有的任务执行完以后，经过 100 毫秒
              // 将最后一个 request 清除，然后隐藏 loading
              this.timerId = setTimeout(() => {
                this.queue.pop()
                this.queue.length === 0 && wx.hideLoading()
                clearTimeout(this.timerId)
              }, 100)
            }
          }
        })
      }
    })
  }

  // 封装 GET 实例方法
  get(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'GET' }, config))
  }

  // 封装 POST 实例方法
  post(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'POST' }, config))
  }

  // 封装 PUT 实 例方法
  put(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'PUT' }, config))
  }

  // 封装 DELETE 实例方法
  delete(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'DELETE' }, config))
  }
  //用来处理并发请求
  all(...promise) {
    // console.log(promise)
    return Promise.all(promise)
  }

  upload(url, filePath, name, config = {}) {
    return this.request(
      Object.assign({ url, filePath, name, method: 'UPLOAD' }, config)
    )
  }
}

export default WxRequest
