import { request } from '@/utils/request.js'

/**
 * 测试表 API JS
 */

export default {

  /**
   * 获取测试表分页列表
   * @returns
   */
  getList (params = {}) {
    return request({
      url: 'coin/test/index',
      method: 'get',
      params
    })
  },


}