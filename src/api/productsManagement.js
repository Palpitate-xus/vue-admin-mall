import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/store/productlist/',
    method: 'post',
    data,
  })
}

export function offshelf(data) {
  return request({
    url: '/store/offshelf/',
    method: 'post',
    data,
  })
}

export function onshelf(data) {
  return request({
    url: '/store/onshelf/',
    method: 'post',
    data,
  })
}

export function remove(data) {
  return request({
    url: '/store/delete_product/',
    method: 'post',
    data,
  })
}

export function addProduct(data) {
  return request({
    url: '/store/insert_product/',
    method: 'post',
    data,
  })
}
