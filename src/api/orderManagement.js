import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/supplier/get_order_list',
    method: 'post',
    data,
  })
}

export function getOrderDetail(data) {
  return request({
    url: 'suppplier/get_order_details',
    method: 'post',
    data,
  })
}

export function acceptOrder(data) {
  return request({
    url: 'supplier/accept_order',
    method: 'post',
    data,
  })
}
