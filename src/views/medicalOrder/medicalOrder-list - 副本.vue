<template>
  <div class="root">
    <div class="search">
      
    </div>
    <div class="my-flex">
      <el-input v-model="name" placeholder="请输入姓名"></el-input>
      <el-date-picker
        class="search-by-time"
        v-model="searchTime"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>

      <el-button @click="searchByTime" class="my-btn" type="primary">开始搜索</el-button>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="idNumber" label="用户证件号码"></el-table-column>
      <el-table-column prop="orderNo" label="购药订单号码" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="180"></el-table-column>
      <el-table-column prop="text" label="文字说明" width="180"></el-table-column>
      <el-table-column prop="allergic" label="过敏信息"></el-table-column>
      <el-table-column prop="medicalInfo" label="药物信息"></el-table-column>

      <el-table-column prop="medName" label="药物名称"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="count" label="数量"></el-table-column>

      <el-table-column prop="name" label="素材名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="birthday" label="上传日期"  sortable></el-table-column>
      <el-table-column prop="imgFileid" label="图片查看">
        <div slot-scope="scope" class="my-pic">
          <el-image
            @click="imgClick(scope.row.imgUrl)"
            fit="scale-down"
            style="width: 120px; height: 120px"
            :src="scope.row.imgUrl"
            :preview-src-list="srcList"
          ></el-image>
        </div>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="scope">
          <el-button @click="deleteMaterial(scope.row.id)" size="small" type="danger" round>删除</el-button>
          <el-button
            @click="downloadFile(scope.row.name,scope.row.imgUrl)"
            size="small"
            type="primary"
            round
          >下载</el-button>
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



</template>
<script>
import { getMedicalList } from "@/api/medicalOrder.js";

export default {
  data() {
    return {
      tableData: [],
      pageSize: 6,
      total: 6, // task总数
      dateTime: '',
      idNumber: '',
      name: '',
      status: '3',
      statusOptions: [{
        value: 0,
        label: '初始'
      }, {
        value: 3,
        label: '用户下单'
      }, {
        value: 5,
        label: '通知取药'
      }, {
        value: 6,
        label: '完成状态'
      }],
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
    // 网络请求统一处理
    
    getMedicalList()
    .then(res => {
      console.log("news-list mounted:", res);
      this.tableData = res;
    },err=>{
      console.log("err :", err);
    });
    
   },
  
  methods: {
    searchData() {
					var that = this;
					var data = {
						status: this.status,
						startTime: this.dateTime[0],
						endTime: this.dateTime[1]

					}
					if  (this.name) {
						data.name = this.name;
					}
					if (this.idNumber) {
						data.idNumber = this.idNumber;
					}
					this.requestGet("http://www.aimang.info:8088/api/web/medicament", data, function(res) {
						that.tableData = res.list;
						that.count = res.count;
					});
				},

  }
};
</script>

<style>
</style>