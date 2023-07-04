<template>
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-upload
          accept=".xlsx"
          action="http://localhost:8000/api/suppliers/excel_product"
          :before-remove="beforeRemove"
          :file-list="fileList"
          :headers="myHeaders"
          :limit="1"
          multiple
          :on-exceed="handleExceed"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <el-button
            v-permissions="'[supplier]'"
            icon="el-icon-plus"
            type="primary"
          >
            从xlsx文件添加
          </el-button>
        </el-upload>
        <el-button
          v-permissions="'[supplier]'"
          icon="el-icon-plus"
          type="primary"
          @click="dialogVisible = true"
        >
          添加商品
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.username"
              clearable
              placeholder="请输入商品名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

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
        label="商品名称"
        prop="product_name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="商品描述"
        prop="product_description"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="商品价格"
        prop="product_price"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="商品库存"
        prop="stock_quantity"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="商品图片"
        prop="product_image"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="商品状态" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag
            :type="row.product_status === 'active' ? 'success' : 'warning'"
          >
            {{ row.product_status === 'active' ? '上架中' : '已下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <!-- <el-button type="text" @click="handleEdit(row)">编辑</el-button> -->
          <el-button
            v-if="row.product_status === 'active'"
            plain
            type="warning"
            @click="handleDelete(row)"
          >
            下架
          </el-button>
          <el-button v-else plain @click="handleOnShelf(row)">上架</el-button>
          <el-button type="danger" @click="handleRemoveProduct(row)">
            删除商品
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
    <el-dialog title="添加商品" :visible.sync="dialogVisible" width="50%">
      <el-form :model="formData">
        <el-form-item label="商品名称">
          <el-input v-model="formData.product_name"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="formData.product_description"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-input v-model="formData.category"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="formData.product_price"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="formData.product_image"></el-input>
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input v-model="formData.stock_quantity"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getList,
    offshelf,
    onshelf,
    remove,
    addProduct,
  } from '@/api/productsManagement'
  import { getAccessToken } from '@/utils/accessToken'
  export default {
    name: 'ProductsManagement',
    data() {
      return {
        fileList: [],
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        dialogVisible: false,
        elementLoadingText: '正在加载...',
        token: '',
        myHeaders: {},
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          username: '',
        },
        formData: {
          product_name: '',
          product_price: '',
          product_image: '',
          product_description: '',
          stock_quantity: '',
          category: '',
        },
      }
    },
    created() {
      this.fetchData()
      this.token = getAccessToken()
      this.myHeaders.Authorization = this.token
      console.log(this.myHeaders.Authorization)
    },
    methods: {
      async handleRemoveProduct(item) {
        const { message } = await remove({
          product_id: item.product_id,
        })
        this.$baseMessage(message, 'success')
        this.fetchData()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
            files.length + fileList.length
          } 个文件`
        )
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
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
      async onSubmit() {
        console.log(this.formData)
        const { message } = await addProduct(this.formData)
        this.$baseMessage(message, 'success')
        this.fetchData()
        this.dialogVisible = false
        this.formData = {
          product_name: '',
          product_price: '',
          product_image: '',
          product_description: '',
          stock_quantity: '',
          category: '',
        }
      },
      handleSuccess(response, file, fileList) {
        this.$baseMessage(response.message, 'success')
        this.fetchData()
      },
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
