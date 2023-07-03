<template>
  <div class="userManagement-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
    >
      <el-table-column
        label="id"
        prop="product_id"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="订单ID"
        prop="supplierorder_id"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="订单状态"
        prop="order_status"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="下单时间"
        prop="order_time"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <!-- <el-button type="text" @click="handleEdit(row)">编辑</el-button> -->
          <el-button plain type="danger" @click="handleDelete(row)">
            接受订单
          </el-button>
          <el-button plain @click="handleOnShelf(row)">拒绝订单</el-button>
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
  </div>
</template>

<script>
  import { getList, offshelf, onshelf } from '@/api/productsManagement'

  export default {
    name: 'OrdersManagement',
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
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
      // handleEdit(row) {
      //   if (row.id) {
      //     this.$refs['edit'].showEdit(row)
      //   } else {
      //     this.$refs['edit'].showEdit()
      //   }
      // },
      async handleDelete(row) {
        if (row.product_id) {
          this.$baseConfirm('你确定要下架当前项吗', null, async () => {
            const { message } = await offshelf({ product_id: row.product_id })
            this.$baseMessage(message, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要下架选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      async handleOnShelf(item) {
        this.$baseConfirm('你确定要上架选中项吗', null, async () => {
          const { message } = await onshelf({ product_id: item.product_id })
          this.$baseMessage(message, 'success')
          this.fetchData()
        })
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
        this.list = data.products
        this.total = totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
