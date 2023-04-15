import { request } from '@/utils/request.js'

/**
 * 远程资源 API JS
 */

export default {

  /**
   * 获取远程资源分页列表
   * @returns
   */
  getList (params = {}) {
    return request({
      url: 'user/source/index',
      method: 'get',
      params
    })
  },

  /**
   * 添加远程资源
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'user/source/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新远程资源数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: 'user/source/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 读取远程资源
   * @returns
   */
  read (data = {}) {
    return request({
      url: 'user/source/read',
      method: 'get',
      data
    })
  },

  /**
   * 将远程资源删除，有软删除则移动到回收站
   * @returns
   */
  deletes (data) {
    return request({
      url: 'user/source/delete',
      method: 'delete',
      data
    })
  },


}