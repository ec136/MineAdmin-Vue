import { request } from '@/utils/request.js'

/**
 * 宝箱兑换统计 API JS
 */

export default {

  /**
   * 获取宝箱兑换统计分页列表
   * @returns
   */
  getList (params = {}) {
    return request({
      url: 'coin/boxExchangeStat/index',
      method: 'get',
      params
    })
  },

  /**
   * 读取宝箱兑换统计
   * @returns
   */
  read (data = {}) {
    return request({
      url: 'coin/boxExchangeStat/read',
      method: 'get',
      data
    })
  },

  /**
   * 宝箱兑换统计导出
   * @returns
   */
  exportExcel (params = {}) {
    return request({
      url: 'coin/boxExchangeStat/export',
      method: 'post',
      responseType: 'blob',
      params
    })
  },


}