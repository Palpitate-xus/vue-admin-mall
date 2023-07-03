const data = [
  {
    content: '凌晨两点，我累了，移除无用组件，精简package',
    timestamp: '2020-10-02',
  },
]

module.exports = [
  {
    url: '/changeLog/getList',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
        totalCount: 999,
        data: data,
      }
    },
  },
]
