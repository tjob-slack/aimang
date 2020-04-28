<template>
  <div id="app" v-cloak>
	<div class="app-container">
        	<!-- 查询条件 -->
		<div id="operatorForm" class="operator-form">
			<el-form :inline="true">
				<el-form-item label="预检分诊编号" label-width="100">
					<el-input v-model="previewNo" size="small" class="line-item" style="width: 100px" placeholder="请输入名称"></el-input>
				</el-form-item>
				
				<el-form-item>
					<el-button @click="searchData" size="small" class="line-item" type="success">检索</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 数据表格容器 -->
		<div id="tableOperatorContainer" class="table-operator-container">
			<!-- 数据表格操作列 -->
			<div id="operatorContainer" class="operator-container">
				<el-row :gutter="20" class="operator-content" style="padding: 5px 0;">
					<el-col :span="6">
						<div class="grid-content data-list-title">预检分诊</div>
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
      <el-table-column prop="previewNo" label="预检编号" width="80"></el-table-column>
      <el-table-column prop="name" label="用户姓名" width="80"></el-table-column>
      <el-table-column prop="date" label="预检日期" width="100"></el-table-column>
      <el-table-column prop="toWuhan" label="是否去过武汉" width="120"></el-table-column>
      <el-table-column prop="contactWuhan" label="是否和去过武汉的人接触" width="180"></el-table-column>
      <el-table-column prop="isFeature" label="是否有干咳，发热" width="160"></el-table-column>
      <el-table-column prop="withFeature" label="是否周围有2人以上有干咳，发热" width="260"></el-table-column>
     

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
      idNumber: '',
      previewNo: '',
      status: '0',
     
      
    };
  },
  mounted: function() {
    //this.searchData();
    
   },
  
  methods: {
    pageChange(page) {
      console.log("page :", page);
      this.searchData(page);
    }
    ,searchData() {
        var that = this;
        var params = {
            previewNo: this.previewNo,
        }
        
        console.log("params.previewNo:", params.previewNo);
        
        getList('preview',params)
        .then(res => {
            console.log("checkIn.searchData:", res);
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