import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/supplier/get_order_list',
    method: 'post',
    data,
  })
}
