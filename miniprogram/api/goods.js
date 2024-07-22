import http from '../utils/http'
/**
 * @description 获取商品列表
 * @param {Object} param {page,limit,category1Id,category2Id}
 * @return Promise
 */
export const reqGoodsList = ({page, limit, ...data}) => {
  return http.get(`/goods/list/${page}/${limit}`, data)
}
/**
 * @description 获取商品详情
 * @param {*} goodsId 商品Id
 * @returns Promise
 */
export const reqGoodsInfo = (goodsId) => {
  return http.get(`/goods/${goodsId}`)
}
