<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card v-permissions="['admin']">
          <div slot="header">
            <span>销售统计</span>
          </div>
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(dayStatistics, index) in statistics"
              :key="index"
              :timestamp="dayStatistics.date"
            >
              <!-- 日订单量：{{ dayStatistics.ordercount }} 日销售额:
              {{ dayStatistics.total_amount }} -->
              <el-row :gutter="20">
                <el-col :span="6">
                  <div>
                    <el-statistic title="日订单量">
                      <template slot="formatter">
                        {{ dayStatistics.ordercount }}
                      </template>
                    </el-statistic>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-statistic title="日销售额">
                      <template slot="formatter">
                        {{ dayStatistics.total_amount }}
                      </template>
                    </el-statistic>
                  </div>
                </el-col>
              </el-row>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :lg="13" :md="13" :sm="24" :xl="13" :xs="24">
        <el-card v-permissions="['supplier']" class="card">
          <div slot="header">
            <span>最新订单</span>
          </div>
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(order, index) in orders"
              :key="index"
              :timestamp="order.order_time"
            >
              {{ order.supplyorder_id }}
              <el-tag :type="getResult(order.order_status).type">
                {{ getResult(order.order_status).label }}
              </el-tag>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getStatistics } from '@/api/statistics'
  import { getList } from '../../api/orderManagement'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Index',
    data() {
      return {
        timer: 0,
        orders: [],
        statistics: [],
        config1: {
          startVal: 0,
          endVal: this.$baseLodash.random(20000, 60000),
          decimals: 0,
          prefix: '111',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        config2: {
          startVal: 0,
          endVal: this.$baseLodash.random(1000, 20000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        //营业额
        fwl: {
          color: [
            '#1890FF',
            '#36CBCB',
            '#4ECB73',
            '#FBD437',
            '#F2637B',
            '#975FE5',
          ],
          backgroundColor: 'rgba(252,252,252,0)',
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: [],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '营业额',
              type: 'line',
              data: [],
              smooth: true,
              areaStyle: {},
            },
          ],
        },
        //订单量
        sqs: {
          color: [
            '#1890FF',
            '#36CBCB',
            '#4ECB73',
            '#FBD437',
            '#F2637B',
            '#975FE5',
          ],
          backgroundColor: 'rgba(252,252,252,0)',
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '订单量',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 20, 33, 39, 33, 22],
            },
          ],
        },
        reverse: true,
        activities: [],
        noticeList: [],
      }
    },
    computed: {
      ...mapGetters({
        username: 'user/username',
        permissions: 'user/permissions',
      }),
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    mounted() {
      this.fetchData()
      let base = +new Date(2023, 7, 3)
      let oneDay = 24 * 3600 * 1000
      let date = []

      let data = [Math.random() * 1500]
      let now = new Date(base)

      const addData = (shift) => {
        now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
        date.push(now)
        data.push(this.$baseLodash.random(20000, 60000))

        if (shift) {
          date.shift()
          data.shift()
        }

        now = new Date(+new Date(now) + oneDay)
      }

      for (let i = 1; i < 6; i++) {
        addData()
      }
      addData(true)
      this.fwl.xAxis[0].data = date
      this.fwl.series[0].data = data
      this.timer = setInterval(() => {
        addData(true)
        this.fwl.xAxis[0].data = date
        this.fwl.series[0].data = data
      }, 3000)
    },
    methods: {
      async fetchData() {
        const { data } = await getStatistics()
        this.statistics = data.statistics
        const response = await getList()
        this.orders = response.data.supplier_orders
        console.log(data)
      },
      getResult(item) {
        console.log(item)
        switch (item) {
          case 'Pending':
            return { label: '待处理', type: 'warning' }
          case 'shipped':
            return { label: '已发货', type: 'info' }
          case 'Finished':
            return { label: '已完成', type: 'success' }
          default:
            return { label: '订单信息获取错误', type: 'danger' }
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .el-alert {
        padding: $base-padding;

        &--info.is-light {
          min-height: 82px;
          padding: $base-padding;
          margin-bottom: 15px;
          color: #909399;
          background-color: $base-color-white;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 115px;
        }
      }
    }

    .card {
      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 117px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }
  }
</style>
