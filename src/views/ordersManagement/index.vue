<template>
  <div class="userManagement-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
    >
      <el-table-column
        label="订单ID"
        prop="supplyorder_id"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="订单状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag
            :type="row.order_status === 'Pending' ? 'warning' : 'success'"
          >
            {{ row.order_status === 'Pending' ? '待处理' : '已发货' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="下单时间"
        prop="order_time"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <el-button plain @click="viewOrder(row)">查看详情</el-button>
          <el-button
            v-if="row.order_status === 'Pending'"
            plain
            type="primary"
            @click="handleAccept(row)"
          >
            接受订单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <el-dialog
      :close-on-click-modal="false"
      title="订单详情"
      :visible="dialogVisible"
      @close="closeDialog"
    >
      <el-table border :data="orderItems">
        <el-table-column label="商品ID" prop="product_id"></el-table-column>
        <el-table-column label="商品名称" prop="product_name"></el-table-column>
        <el-table-column
          label="商品价格"
          prop="product_price"
        ></el-table-column>
        <el-table-column label="购买数量" prop="quantity"></el-table-column>
      </el-table>
      <div v-if="orderItems.length === 0" class="no-items-message">
        <el-empty>订单中没有商品</el-empty>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getList, getOrderDetail, acceptOrder } from '@/api/orderManagement'
  export default {
    name: 'OrdersManagement',
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        dialogVisible: false,
        elementLoadingText: '正在加载...',
        orderItems: [],
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          username: '',
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      async handleAccept(item) {
        this.$baseConfirm('你确定要接受订单并发货吗', null, async () => {
          console.log(item.supplyorder_id)
          const { message } = await acceptOrder({
            supplyorder_id: item.supplyorder_id,
          })
          this.fetchData()
          this.$baseMessage(message, 'success')
        })
      },
      async viewOrder(item) {
        console.log(item.supplyorder_id)
        const data = await getOrderDetail({
          supplyorder_id: item.supplyorder_id,
        })
        this.orderItems = data.data.orderdetails
        this.dialogVisible = true
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data, totalCount } = await getList(this.queryForm)
        this.list = data.supplier_orders
        this.total = totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
      closeDialog() {
        this.dialogVisible = false
      },
    },
  }
</script>
