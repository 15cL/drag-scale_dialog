<template>
  <div class="">
    <el-button @click="showDialog = true">点击</el-button>
    <el-dialog title="表格" :visible.sync="showDialog" v-dialog>
      <el-table :data="tableData">
        <el-table-column property="id" label="ID" width="50"></el-table-column>
        <el-table-column property="name" label="姓名"></el-table-column>
        <el-table-column property="age" label="年龄"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "小芳",
          age: 18,
        },
        {
          id: 2,
          name: "张三",
          age: 99,
        },
        {
          id: 3,
          name: "李华",
          age: 1100,
        },
      ],
      showDialog: false,
    };
  },
};
</script>
<style scoped>
</style>
