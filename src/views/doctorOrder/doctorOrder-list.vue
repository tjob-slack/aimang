<template>
  <div id="app" v-cloak>
	<div class="app-container">
	
		<!-- 数据表格容器 -->
		<div id="tableOperatorContainer" class="table-operator-container">
			<!-- 数据表格操作列 -->
			<div id="operatorContainer" class="operator-container">
				<el-row :gutter="20" class="operator-content" style="padding: 5px 0;">
					<el-col :span="6">
						<div class="grid-content data-list-title">预约人数</div>
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
      <el-table-column prop="time.startTime" label="时段起" width="180"></el-table-column>
      <el-table-column prop="time.endTime" label="时段止" width="180"></el-table-column>
      <el-table-column prop="count" label="预约人数" width="180"></el-table-column>
     
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
import { getDoctorOrderList } from "@/api/doctorOrder.js";

export default {
  data() {
    return {
      tableData: [],
      pageSize: 6,
      total: 6, // task总数
      //dateTime: '',
      idNumber: '',
      name: '',
      status: '0',
     
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
						status: this.status,
						//startTime: this.dateTime[0],
						//endTime: this.dateTime[1]
            startTime: this.searchTime[0],
						endTime: this.searchTime[1]

					}
					if  (this.name) {
						data.name = this.name;
					}
					if (this.idNumber) {
						data.idNumber = this.idNumber;
					}
				
          getDoctorOrderList(data)
          .then(res => {
            console.log("doctorOrderList-list.searchData:", res);
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
                status:status,  //type=1时，status1通过，2拒绝
                orderNo:id,
                type:status==5 ? 2 : 1,  //status=5时，type=2取药；否则1审核操作
                auditor:"管理员", //操作者 
                medName:"",
                unit:"",
                count:"",

                limitDate:"",
                refuseReason:""  //拒绝请求原因说明，， status =2 时需要
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