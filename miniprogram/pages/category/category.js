import { reqCategoryData } from '../../api/category'

Page({
  data: {
    categoryList: [],
    activeIndex: 0
  },
  // 一级分类的切换效果
  updataActive(event) {
    // console.log(event.currentTarget.dataset)

    const { index } = event.currentTarget.dataset
    // console.log(index)
    this.setData({
      activeIndex:index
    })
  },

  async getCategoryData() {
    const res = await reqCategoryData()
    // console.log(res)
    if (res.code === 200) {
      this.setData({
        categoryList: res.data
      })
    }
  },
  onLoad() {
    this.getCategoryData()
  }
})
