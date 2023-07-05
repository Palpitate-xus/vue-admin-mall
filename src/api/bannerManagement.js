import request from '@/utils/request'

export function getBannerList(data) {
  return request({
    url: '/store/banner/',
    method: 'post',
    data,
  })
}
