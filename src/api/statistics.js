import request from '@/utils/request'

export function getStatistics(data) {
  return request({
    url: '/store/statistics/',
    method: 'post',
    data,
  })
}
