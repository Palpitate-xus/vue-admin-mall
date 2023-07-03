<template>
  <el-card shadow="hover">
    <template #header>
      <vab-icon icon="send-plane-2-line" />
    </template>
    <el-table :data="tableData" height="283px" row-key="title">
      <el-table-column align="center" label="拖拽" width="50px">
        <template #default="{}">
          <vab-icon
            :icon="['fas', 'arrows-alt']"
            style="cursor: pointer"
          ></vab-icon>
        </template>
      </el-table-column>
      <el-table-column width="20px" />
      <el-table-column label="目标" prop="title" width="230px" />
      <el-table-column label="进度" width="220px">
        <template #default="{ row }">
          <el-progress :color="row.color" :percentage="row.percentage" />
        </template>
      </el-table-column>
      <el-table-column width="50px" />
      <el-table-column label="完成时间" prop="endTIme" />
    </el-table>
  </el-card>
</template>
<script>
  import Sortable from 'sortablejs'

  export default {
    data() {
      return {
        tableData: [],
      }
    },
    mounted() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
        },
      })
    },
  }
</script>
