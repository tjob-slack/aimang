<template>
  <div id="app" v-cloak>
	<div class="app-container">
		<!-- 查询条件 -->
		<div id="operatorForm" class="operator-form">
			<el-form :inline="true">
				<el-form-item label="订单状态" label-width="100"   >
					<el-radio v-model="status" label="0" >初始</el-radio>
          <el-radio v-model="status" label="1">审核通过</el-radio>
          <el-radio v-model="status" label="2">拒绝请求</el-radio>
          <el-radio v-model="status" label="3">用户下单</el-radio>
					<el-radio v-model="status" label="5">待取药</el-radio>
					<el-radio v-model="status" label="6">已完成</el-radio>
				</el-form-item>
				<el-form-item label="查询日期" label-width="100">
					<!--el-date-picker
							v-model="dateTime"
							format= 'yyyy-MM-dd'
							value-format="yyyy-MM-dd HH:mm:ss"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
					</el-date-picker-->

          <el-date-picker
            
            v-model="searchTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
          
				</el-form-item>
				<el-form-item label="用户姓名" label-width="100">
					<el-input v-model="name" size="small" class="line-item" style="width: 100px" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="证件号码" label-width="100">
					<el-input v-model="idNumber" size="small" class="line-item" style="width: 100px" placeholder="请输入名称"></el-input>
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
						<div class="grid-content data-list-title">数据列表</div>
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
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <!--el-table-column prop="idNumber" label="用户证件号码"></el-table-column-->
      <el-table-column prop="text" label="文字说明" width="180"></el-table-column>
      <el-table-column prop="allergic" label="过敏信息"></el-table-column>
      <el-table-column prop="medName" label="药物信息"></el-table-column>

      
      
      <el-table-column prop="imgFileid" label="图片查看">
        <div slot-scope="scope" class="my-pic">
          <el-image
            @click="imgClick(scope.row.imgFileid)"
            fit="scale-down"
            style="width: 120px; height: 120px"
            :src="scope.row.imgFileid"
            :preview-src-list="srcList"
          ></el-image>
        </div>
      </el-table-column>
      
      <el-table-column prop="orderNo" label="购药订单号码" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="80"></el-table-column>
      <el-table-column label="操作" width="300" align="middle">
        <div slot-scope="scope">
          <el-button @click="putMedicalOrder(scope.row.orderNo,0)" size="mini" type="danger" >删除</el-button>
          <el-button @click="putMedicalOrder(scope.row.orderNo,2)" size="mini" type="primary" >拒绝</el-button>
          <el-button @click="putMedicalOrder(scope.row.orderNo,1)" size="mini" type="primary" >通过</el-button>
          <el-button @click="putMedicalOrder(scope.row.orderNo,5)" size="mini" type="primary" >通知</el-button>
          <el-button @click="putMedicalOrder(scope.row.orderNo,6)" size="mini" type="primary" >取药</el-button>
          <!--el-button
            @click="downloadFile(scope.row.name,scope.row.imgUrl)"
            size="small"
            type="primary"
            round
          >下载</el-button-->
        </div>
      </el-table-column>
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
import { getMedicalList } from "@/api/medicalOrder.js";

export default {
  data() {
    return {
      tableData: [],
      pageSize: 6,
      total: 6, // task总数
      //dateTime: '',
      idNumber: '',
      name: '',
      status: '',
      imgUrl: "https://7469-tianshibot-test-1301773134.tcb.qcloud.la/my-image.jpg?sign=f7d072f67ea8f27e579378c474687755&t=1586010565",
      srcList: [this.imgUrl],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近五天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 5);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      searchTime: ""

};
  },
  mounted: function() {
    this.searchData();
    
   },
  
  methods: {
    changeStatus(){
      // 网络请求统一处理
       this.searchData();
    }
    ,imgClick(imgUrl) {
      this.srcList = [imgUrl];
    }
    , pageChange(page) {
      console.log("page :", page);
      this.searchData(page);
    }
    ,searchData() {
					var that = this;
					var data = {
						//startTime: this.dateTime[0],
						//endTime: this.dateTime[1]
            startTime: this.searchTime[0],
						endTime: this.searchTime[1]

					}
					if  (this.status) {
						data.status = this.status;
					}if  (this.name) {
						data.name = this.name;
					}
					if (this.idNumber) {
						data.idNumber = this.idNumber;
					}
				
          getMedicalList(data)
          .then(res => {
            console.log("medicalOrder-list.searchData:", res);
            this.tableData = res;
            //that.count = res.count;
          },err=>{
            console.log("err :", err);
          });

		},
    handleEdit(id,status) {
      let that = this;
      // if (type == 'edit') {
      // 	localStorage.setItem("tempNews",JSON.stringify(data));
      // }
      this.addEditLayer("审核购药申请", ['600px', '520px'], `/medicalOrder/medicalOrderModify`, false, function () {
        that.searchData();
      });
    },
    addEditLayer(title, area, url, isFull, func) {
      var that = this;
      var index = layui.layer.open({
        title: title,
        type: 2,
        area: area,  
        content: url,
        success: function(layero, index) {},
        end: function() {  
          func();
        }
      })
      if (isFull) {
        layui.layer.full(index);
      }
    }
    ,putMedicalOrder(id,status) {
      let that = this;


      this.$confirm("确定继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .req({
              url: "medicament",
              data: {
                status:status,
                orderNo:id,
                type:status==5 ? 2 : 1,
                auditor:"管理员", //操作者 
                medName:"",
                unit:"",
                count:"",

                limitDate:"",
                refuseReason: status==2 ? "这是一个拒绝原因测试" :""  //拒绝请求原因说明，， status =2 时需要
              },
              method: "put"
            })
            .then(
              res => {
                console.log("res :", res);
                that.searchData();
                that.$message("处理成功~");
              },
              err => {
                console.log("err :", err);
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
  }
};
</script>

<style>
</style>