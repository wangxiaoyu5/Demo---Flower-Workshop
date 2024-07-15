// 1️⃣ 引入 async-validator，async-validator 提供了一个构造函数
import Schema from 'async-validator'

Page({
  // 2️⃣定义需要验证的数据
  data: {
    name: '你好'
  },

  // 验证数据
  onValidate() {
    // 3️⃣创建表单验证规则
    const rules = {
      // key 建议和 需要验证的数据字段名字保持一致
      name: [
        // required 是否是必填项
        { required: true, message: 'name 不能为空' },

        // type 数据的类型
        // message 如果验证失败，提示的错误内容
        { type: 'string', message: 'name 不是字符串' },

        // min 最少位数，max 最大位数
        { min: 2, max: 5, message: '名字最少 2 个字，最多 5 个字' }

        // 正则表达式
        // { pattern: '', message: '' }

        // 自定义验证规则
        // { validator: () => {} }
      ]
    }

    // 4️⃣创建表单验证实例
    // 在创建实例时需要传入验证规则
    const validator = new Schema(rules)

    // 5️⃣ 调用 validate 实例方法对数据进行验证
    // validate 方法接收一个对象作为参数，对象是需要验证的数据
    // 注意：validate 方法只会验证和验证规则同名的属性
    validator.validate(this.data, (errors, fields) => {
      // 如果验证失败，errors 是所有错误的数组
      // 如果验证成功，errors 是 null
      console.log(errors)

      // fields 是需要验证的属性，属性值是数组，数组中包含错误信息
      console.log(fields)

      if (errors) {
        console.log('验证没有通过')
        console.log(errors)
        return
      }

      console.log('验证通过')
    })
  }
})
