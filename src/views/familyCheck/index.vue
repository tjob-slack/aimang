<template>
  <div id="app" v-cloak>
	<div class="app-container">

  <!-- 查询条件 -->
    <div id="operatorForm" class="operator-form">
      <el-form :inline="true">
         <el-form-item label="姓名" label-width="50">
          <el-input v-model="form.name" size="small" class="line-item" style="width: 100px" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="用户证件号码" label-width="50">
          <el-input v-model="form.idNumber" size="small" class="line-item" style="width: 100px" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="分值" label-width="50">
          <el-input v-model="form.startScores" size="small" type="number" class="line-item" style="width: 80px" placeholder=""></el-input>
          <span>-</span>
          <el-input v-model="form.endScores" size="small" type="number" class="line-item" style="width: 80px" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchData" size="small" class="line-item" type="success">查询</el-button>
        </el-form-item>
      </el-form>
    </div>


		<!-- 数据表格容器 -->
		<div id="tableOperatorContainer" class="table-operator-container">
			<!-- 数据表格操作列 -->
			<div id="operatorContainer" class="operator-container">
				<el-row :gutter="20" class="operator-content" style="padding: 5px 0;">
					<el-col :span="6">
						<div class="grid-content data-list-title">居家自测</div>
					</el-col>
				</el-row>
			</div>
			<!-- 数据表格 -->
			<div id="tableContainer" class="table-container">
				<div class="table-content">
					 <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column prop="name" label="用户姓名" width="80"></el-table-column>
      <el-table-column prop="scores" label="自测分值" width="80"></el-table-column>
      <el-table-column prop="detail" label="自测详情" ></el-table-column>
      

    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="pageChange"
      @prev-click="pageChange"
      @next-click="pageChange"
    ></el-pagination>
				</div>
				<!--<div id="tablePagination" class="table-pagination" style="display: flex;justify-content: flex-end;">-->
				<!--<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="pageSizeArr"-->
				<!--:page-size="pageSizeArr[2]" :total="count" layout="total, sizes, prev, pager, next, jumper">-->
				<!--</el-pagination>-->
				<!--</div>-->
			</div>
		</div>
	</div>
</div>


</template>
<script>
import { getList } from "@/api/getList.js";

export default {
  data() {
    return {
      tableData: [],
      pageSize: 6,
      total: 6, // task总数
      //dateTime: '',
      form: {
        name:'',
        idNumber: '',
        startScores: '',
        endScores: ''    
      }
      
    };
  },
  mounted: function() {
    this.searchData();
    
   },
  
  methods: {
    pageChange(page) {
      console.log("page :", page);
      this.searchData(page);
    }
    ,searchData() {
        var that = this;
        let params = that.form
        if (that.form.name) {params.name=that.form.name} ;
        if (that.form.idNumber) {params.idNumber=that.form.idNumber} ;
        if (that.form.startScores) {params.startScores=that.form.startScores} ;
        if (that.form.endScores) {params.endScores=that.form.endScores} ;
        
        getList('selftest',params)
        .then(res => {
            console.log("selftest.searchData:", res);
            this.tableData = res;
            //that.count = res.count;
        },err=>{
            console.log("err :", err);
        });

    },
      
},
  
};
</script>

<style>
</style>