<template>
  <div id="app" v-cloak>
	<div class="app-container">
		<!-- 查询条件 -->
		<div id="operatorForm" class="operator-form">
			<el-form ref="tableForm" :inline="true">
				<el-form-item label="订单状态" label-width="100"   >
          <el-radio-group  v-model="status" @change="statusChange">
            <el-radio :label="0" >初始</el-radio>
            <!--el-radio :label="1" >审核通过</el-radio>
            <el-radio  label="2">拒绝请求</el-radio-->
            <el-radio  label="3">用户下单</el-radio>
            <el-radio  label="5">待取药</el-radio>
            <el-radio  label="6">已完成</el-radio>
          </el-radio-group>
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
						<div class="grid-content data-list-title">数据列表 ({{this.tableData.length}})</div>
					</el-col>
				</el-row>
			</div>
			<!-- 数据表格 -->
			<div id="tableContainer" class="table-container" >
				<div class="table-content">
					 <el-table     height="500"
            :data="tableData"
            style="width: 100%"
            :default-sort="{prop: 'createDate', order: 'descending'}"
          >
      <el-table-column  fixed prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="type" label="初/复诊" width="50"></el-table-column>
      <!--el-table-column prop="idNumber" label="用户证件号码"></el-table-column-->
      <el-table-column prop="allergic" label="过敏信息"></el-table-column>
      <el-table-column prop="text" label="文字说明" ></el-table-column>
      <el-table-column prop="medNameList" label="药物信息"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
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
          <el-button v-if="scope.row.status==9" @click="putMedicalOrder('tableForm',scope.row.orderNo,0)" size="mini" type="danger" >删除</el-button>
          <el-button v-if="scope.row.status==0" @click="approve(scope.row.orderNo,2)" size="mini" type="danger" >拒绝</el-button>
          <el-button v-if="scope.row.status==0" @click="approve(scope.row.orderNo,1)" size="mini" type="primary" >通过</el-button>
          <el-button v-if="scope.row.status==3" @click="approve(scope.row.orderNo,5)" size="mini" type="primary" >通知取药</el-button>
          <el-button v-if="scope.row.status==5" @click="putMedicalOrder('tableForm',scope.row.orderNo,6)" size="mini" type="primary" >取药</el-button>
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
  <!---form-->
  
  <el-dialog title="审核意见" :visible.sync="dialogFormVisible" :before-close="handleClose"  >
      <el-form ref="form" :model="form" label-width="100px" style="width:100%" :rules="rules">
        <el-form-item label="拒绝理由" v-if="form.status==2">
            <el-input v-model="form.refuseReason" ></el-input>
        </el-form-item>

       
        <el-form-item label="药物名称" v-if="form.status==1" >
            <el-input v-model="form.medName" ></el-input>
        </el-form-item>
        <el-form-item label="药物数量" v-if="form.status==1">
            <el-input v-model="form.count" v-if="form.status==1"></el-input>
        </el-form-item>
        <el-form-item label="药物单位" v-if="form.status==1">
            <el-input v-model="form.unit" v-if="form.status==1"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="newMedicalName" v-if="form.status==1">添加药物</el-button>
        </el-form-item>

        <el-form-item label="药物信息" v-if="form.status==1" prop="gridData">
          <!--表格显示录入的药物信息-->
          <el-table :data="form.gridData" >
            <el-table-column property="medName" label="药物名称" ></el-table-column>
            <el-table-column property="count" label="药物数量" ></el-table-column>
            <el-table-column property="unit" label="药物单位" ></el-table-column>
            <el-table-column label="操作">
              <div slot-scope="scope">
                <el-button  @click="deleteMaterial(scope.$index, scope.row)" size="small" type="danger" round>删除</el-button>
              </div>
            </el-table-column>
          </el-table>
        </el-form-item>
          
        <el-form-item label="金额" v-if="form.status==5" width="560">
              <el-input v-model="form.amount" ></el-input>
        </el-form-item>
        <el-form-item label="下次申购时间" v-if="form.status==5" width="560">
            <el-input v-model="form.limitDate" ></el-input>
        </el-form-item>
        <el-form-item label="审核人" width="560" prop="auditor">
            <el-input v-model="form.auditor" ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="putMedicalOrder('form')">提交</el-button>
        </el-form-item>


      </el-form>
  </el-dialog> 
  
</div>


</template>
<script>
import { getMedicalList } from "@/api/medicalOrder.js";

export default {
  data() {
    //2020-4-14 看似没有启用  在rule中加上
    var validateMedName = (rule, value, callback) => {
      //在rules中配置，针对输入内容的校验
      //console.log('validateMedName.rule',rule)
      //console.log('validateMedName.value',value)
      //console.log('validateMedName.callback',callback)
      if (this.errorMsg) {
        console.log('validateMedName.this.medName',this.errorMsg)
        callback(new Error(this.errorMsg));
      }else{
        console.log('validateMedName.else',this.errorMsg)
        callback();
      }
    };
    return {
      tableData: [], 

      pageSize: 6,
      total: 6, // task总数
      //dateTime: '',
      idNumber: '',
      name: '',
      status: '0',
      imgUrl: "",
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
      
      //form
      ,dialogFormVisible: false
      ,form:{
        status:0
        ,auditor: ""
        //审核拒绝
        ,refuseReason:""
        //审核通过
        ,medName:"" 
        ,count  :""
        ,unit   :""
        //购药通知
        ,amount: 0
        ,limitDate: ""
        ,gridData: [ ]  
      }
      
      ,rules:{
        gridData :[{required: true, message: '请输入药物信息', trigger: 'blur'}
                  ,{validator: validateMedName}
                  ],
        auditor :[{required: true, message: '请输入管理员', trigger: 'blur'}]
      }
      ,errorMsg:""
/**
————————————————
版权声明：本文为CSDN博主「TCorners」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_40619526/article/details/80395952
 */
    };
  },
  mounted: function() {
    this.searchData();
     
   },
  
  methods: {
    statusChange(){
       //切换订单状态
      console.log('statusChange',this.status)
      this.searchData();
    }  
    ,changeUrl(url){
      return this.imgUrl;
    }
    ,changeStatus(){
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
    , handleClose(done) {
        let that = this;
        this.$confirm('确定关闭审核窗口？')
          .then(_ => {
            
            let that = this;
            
            that.dialogFormVisible = false;
            
            that.form= {
              status: 0
              ,refuseReason: ''
              ,auditor: ""
              ,limitDate: ""
              ,medName: ''
              ,unit: ""
              ,count: ""
              ,gridData:[]
            } ;
            done();
          })
          .catch(_ => {});
    }
    
    
    ,searchData(formData) {
          
					var that = this;
					var param = {
						//startTime: this.dateTime[0],
						//endTime: this.dateTime[1]
            startTime: this.searchTime[0],
						endTime: this.searchTime[1]
            ,status : that.status
					}
					//if  (that.status) {
					//	param.status = that.status;
          //}
          if  (that.name) {
						param.name = that.name;
					}
					if (this.idNumber) {
						param.idNumber = this.idNumber;
					}
				
          getMedicalList(param)
          .then(res => {
            console.log("medicalOrder-list.searchData:", res);
            this.tableData = res;
            //that.count = res.count;
          },err=>{
            console.log("err :", err);
          });

		}
    
    ,approve(scopeRowOrderNo,status){
     //审核窗口弹出
      this.form.status = status;
      this.form.orderNo = scopeRowOrderNo;
      this.dialogFormVisible=true
    }
    ,newMedicalName(){
      //增加药物
      let that = this;
      let newForm = Object.assign(that.form) //.slice(1)
      that.form.gridData.push(
        {
          medName: this.form.medName,
          unit:this.form.unit,
          count:this.form.count
        }
      )
      this.form.medName = ""
      this.form.unit=""
      this.form.count=""
      //this.gridData.unshift(
      //  {
      //    medName: this.form.medName,
      //    unit:this.form.unit,
      //    count:this.form.count
      //  }
      //)
    }
    ,deleteMaterial( index, row) {
     //删除预购药物清单
      let that = this;
     
      console.log('deleteMaterial.index',index);
      console.log('deleteMaterial.row', row);
      that.form.gridData.splice(index,1)
    }
    ,putMedicalOrder(formRef,scopeRowOrderNo,stat){
      //先校验数据
      let that = this;
      
      that.$refs[formRef].validate((isPass) => {
          console.log('putMedicalOrder.validate.valid:',isPass); 
          if (!isPass){
            /**
            setTimeout(function(){ // 模拟请求
                that.errorMsg = '检验有误';
                if(that.errorMsg){ // 服务有返回错误
                  console.log('putMedicalOrder.validate.valid.(_this.errorMsg):',that.errorMsg); 
            
                  that.$refs[formRef].validateField("medName");
                  that.errorMsg = '';
                  
                }else{ 
                  console.log('putMedicalOrder.validate.valid.(_this.errorMsg).else:',that.errorMsg); 
                  //alert("submit") 
                } 
              }
              ,1000);
             */
            //that.errorMsg = '检验有误';
            console.log('putMedicalOrder.validate.(!isPass):',isPass); 
            return false; 
          } else { 
            console.log('putMedicalOrder.validate.valid.else:',isPass); 
            that.putMedicalOrderCommit(formRef,scopeRowOrderNo,stat)
            //return false; 
          }
      });
      //console.log('putMedicalOrder.(that.errorMsg):',that.errorMsg); 
      //这里的代码也会执行
     
/**
————————————————
版权声明：本文为CSDN博主「TCorners」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_40619526/article/details/80395952
 */
    }
    ,putMedicalOrderCommit(formRef,scopeRowOrderNo,stat) {
      let that = this;
      

      let status = stat ? stat : that.form.status;
      let data = {
        orderNo: scopeRowOrderNo ? scopeRowOrderNo : that.form.orderNo,
        status ,
        type:status==5 ? 2 : 1,
        auditor: that.form.auditor, //操作者 
        amount: that.form.amount
      }
      if (status==2){
        data.refuseReason = that.form.refuseReason //拒绝请求原因说明，， status =2 时需要
      }
      if (status==1){
        data.medName = that.form.gridData.map(x=>x.medName).join(",") //"药物" 
        data.unit = that.form.gridData.map(x=>x.unit).join(",")    //"药物单位":"",
        data.count= that.form.gridData.map(x=>x.count).join(",")    //"药物数量":"",
        data.limitDate= that.limitDate //最早再次申购时间
        //应该在加一个医嘱，用于用药说明
      }

      console.log("putMedicalOrder.data:",data)

      this.$confirm("确定继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .req({
              url: "medicament",
              data,
              method: "put"
            })
            .then(
              res => {
                console.log("res :", res);
                that.$message("处理成功~");
                that.clearForm();  //清空填写的缓存数据
                that.searchData();
                
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
    clearForm(){
      let that = this;
            
      that.dialogFormVisible = false;
      
      that.form= {
        status: 0
        ,refuseReason: ''
        ,auditor: ""
        ,limitDate: ""
        ,medName: ''
        ,unit: ""
        ,count: ""
        ,gridData:[]
      }
    }
  }
};
</script>

<style>
</style>