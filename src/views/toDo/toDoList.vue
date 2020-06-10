<template>

<div id="app">

  		<!-- 查询条件 -->
		<div id="operatorForm" class="operator-form">
			<el-form ref="tableForm" :inline="true">
				<el-form-item label="状态" >
          <el-select v-model="status" filterable clearable  placeholder="选择状态" @change="statusChange" @focus="statusFocus">
             <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

				</el-form-item>

        <el-form-item label="项目" >
          <el-select v-model="space" filterable clearable placeholder="选择项目" @change="spaceChange" @focus="spaceFocus">
            <el-option
              v-for="item in spaceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
				</el-form-item>

<!--			</el-form>
      <el-form ref="tableForm" :inline="true">
-->
				<el-form-item label="查询日期" label-width="100">
<!----       
					<el-date-picker
							v-model="dateTime"
							format= 'yyyy-MM-dd'
							value-format="yyyy-MM-dd"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
					</el-date-picker>
          起止日期dateTime:{{dateTime}}
        </el-form-item>
        <el-form-item>
         
          
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
          默认日期范围searchTime:{{searchTime}}
        </el-form-item>
        <el-form-item>
--->          
          
          <el-date-picker
            v-model="valueDate"
            format= 'yyyy-MM-dd'
						value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
           <!--起止日期valueDate:{{valueDate}}  -->
          <!--el-button  type="text" @click="clearAllCondition">撤销全部检索条件</el-button -->
        </el-form-item>
<!--- 
        <el-form-item>
          
         
          <el-date-picker
            v-model="valueMonth"
            type="monthrange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :picker-options="pickerOptions">
          </el-date-picker>
          带快捷键的起止月份valueMonth: {{valueMonth}}
				</el-form-item>
--->  
				<el-form-item label="搜索" >
            <el-input v-model="searchStr" clearable placeholder="输入关键字搜索"></el-input>
        </el-form-item>
        <el-form-item>
					<el-button @click="searchData" size="small" class="line-item" type="success">检索</el-button>
				</el-form-item>
			</el-form>
		</div>
    		<!-- 数据表格容器 -->
		<div id="tableOperatorContainer" class="table-operator-container">
      <el-table  
        v-loading="loading"
        ref="multipleTable" :data="tableDataCurrent" style="width: 100%" @selection-change="handleSelectionChange">
        
        <el-table-column type="selection" width="55">  </el-table-column>  
        <el-table-column prop="_id" label="ID" v-if="null"></el-table-column>
        <el-table-column prop="date" label="时间" width="100"></el-table-column>
        <el-table-column prop="toDo.space" label="项目" width="100"></el-table-column>
        <el-table-column prop="toDo.title" label="标题" show-overflow-tooltip></el-table-column>
        <el-table-column prop="toDo.content" label="内容" show-overflow-tooltip ></el-table-column>
        
        <el-table-column prop="toDo.status" label="状态"  width="100"></el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <!--el-button size="mini" @click="putNews(scope.row.newsId,1)" >编辑</el-button-->
            <el-button size="mini"  @click="editNews(scope.row)">编辑</el-button>
            <el-button size="mini" @click="delNews([scope.row])" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
		</div>
  
  <!----page--->
   <div class="block">
    <span class="demonstration"></span>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="this.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="this.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.tableData.length">
    </el-pagination>

    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">反选所有</el-button>
      <el-button @click="toggleSelectionCurrent()">反选当前页</el-button>
      <el-button @click="cancelSelection()">取消所有选择</el-button>

      
      <el-button v-if="multipleSelection.length>0" 
        type="text" 
        @click="delNews(multipleSelection)"
      >
        批量删除({{multipleSelection.length}})
      </el-button>
      <!--批量移动-->
      
      <el-select v-model="statusMove" filterable placeholder="修改状态为"
      @change="batchMove(multipleSelection)"
      @focus="statusFocus"
      v-if="multipleSelection.length>0" 
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    
      <el-select v-model="spaceMove" filterable placeholder="移动到项目" 
      @change="batchMove(multipleSelection)"
      @focus="spaceFocus"
      v-if="multipleSelection.length>0" 
      >
        <el-option
          v-for="item in spaceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    
      
      <!--el-button size="mini" @click="createNew" >新增</el-button-->
      <el-button type="text" @click="createNew">发布一条新的</el-button>
    </div>
   </div>
  <!----page end--->
<!-- Form -->
  <div class="root">      
    <el-dialog title="行动起来" :visible.sync="dialogFormVisible" :before-close="handleClose" >
      <!--el-form ref="form" :model="form" label-width="60px" style="width:560px"-->
      <el-form ref="form" :model="form" >
        <el-form-item label="标题" >
            <el-input v-model="form.toDo.title" placeholder="新建事项"></el-input>
        </el-form-item>

        <el-switch  v-model="form.advance"  active-color="#13ce66"  ></el-switch>

        <el-form-item label="周期" v-if="form.advance">
            <el-select v-model="form.toDo.type" placeholder="选择时间类型">
              <el-option value="年计划">年计划</el-option>
              <el-option value="月计划">月计划</el-option>
              <el-option value="周计划">周计划</el-option>
              <el-option value="日计划">日计划</el-option>
            </el-select>
        </el-form-item>  
        <el-form-item label="时间" v-if="form.advance">
          <el-select v-model="form.timeType" placeholder="选择时间类型" width="55">
            <el-option value="计划">计划</el-option>
            <el-option value="实际">实际</el-option>
          </el-select>   
          
          <el-date-picker  @change="handleTimeType"
            v-model="form.toDoTime"
            :type="form.pickerType"
            placeholder="选择日期"
            :picker-options="timeOptions">
          </el-date-picker>
          
          <el-checkbox v-model="form.fullDay" @change="handleTimeFormat">全天</el-checkbox>
          <el-checkbox v-model="form.enableEndDate"  @change="handleTimeFormat">结束时间</el-checkbox>
          <el-checkbox v-model="form.Lunar"  @change="handleTimeFormat">农历</el-checkbox>
        </el-form-item> 
<!-- 精简
        <el-form-item label="提醒时间" v-if="!form.enableEndDate && form.fullDay" >
          <el-date-picker  @change="handleTimeType"
            v-model="form.toDoTime"
            type="date"
            placeholder="选择日期"
            :picker-options="dateOptions">
          </el-date-picker>
        </el-form-item>
         
          
        <el-form-item label="提醒时间" v-if="!form.enableEndDate && !form.fullDay" >
          <el-date-picker 
            v-model="form.toDoTime"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="timeOptions">
          </el-date-picker>
        </el-form-item>
        
        <el-form-item label="提醒时间" v-if="form.enableEndDate && form.fullDay">  
          <el-date-picker 
            v-model="form.toDoTime"
            format= 'yyyy-MM-dd'
						value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item> 

        <el-form-item label="提醒时间" v-if="form.enableEndDate && !form.fullDay">  
          <el-date-picker 
            v-model="form.toDoTime"
            
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
--->
        <!--提醒时间 2020-6-8-->
        <el-form-item label="提醒" v-if="form.advance">
          <el-switch  v-model="form.alert"  active-color="#13ce66"  @change="handleAlert"></el-switch>
          
            <el-date-picker v-if="form.alert" 
              v-model="form.toDo.alertTime"
              type="datetime"
              placeholder="选择日期时间"
              :picker-options="dateOptions">
            </el-date-picker>

            <el-input-number v-if="form.alert" v-model="form.toDo.alertNum" @change="handleAlertTime" :min="1" :max="60" label="提前"></el-input-number>  
            <el-select v-if="form.alert" v-model="form.toDo.alertType" placeholder="" @change="handleAlertTime">
              <el-option value="月">月</el-option>
              <el-option value="周">周</el-option>
              <el-option value="天">天</el-option>
              <el-option value="小时">小时</el-option>
              <el-option value="分钟">分钟</el-option>
              <el-option value="秒">秒</el-option>  
              后  
            </el-select>
            
          
        </el-form-item>
        <!--项目-->
        <el-form-item label="状态" v-if="form.advance">
          <el-select v-model="form.toDo.status" filterable clearable  placeholder="选择状态" @focus="statusFocus">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>  
        <el-form-item label="项目" v-if="form.advance">
          <el-select v-model="form.toDo.space" filterable clearable placeholder="选择项目" @focus="spaceFocus">
            <el-option
              v-for="item in spaceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
				</el-form-item>    
        <!--el-form-item label="正文">
          <el-input  type="textarea"  :rows="8"  placeholder="请输入正文"  v-model="form.content"></el-input>
        </el-form-item-->

        <!--2020-4-16 基于Vue的markdown编辑器-->
        <el-form-item label="内容" v-if="form.advance">
              <!--mavon-editor v-model="value"/-->
            <div class="mavonEditor">
              <!--no-ssr-->
                <mavon-editor 
                  :toolbars="markdownOption" 
                    v-model="form.toDo.content"
                  @save = "$save"
                  @imgAdd = "uploadPhoto($event)"
                />
              <!--/no-ssr-->
            </div>
        </el-form-item>

        <!--el-form-item label="图片">
              <el-image  v-if="imgUrl"
                fit="scale-down"
                style="width: 200px; height: 200px;"
                :src="imgUrl"
                :preview-src-list="srcList"
              ></el-image>
              <input @change="uploadPhoto($event)" type="file" class="kyc-passin">
        </el-form-item-->

        <el-form-item>
         
          <el-button @click="handleClose">取 消</el-button>
          <el-button v-if="form._id" type="primary" @click="updateNews">更新</el-button>
          <el-button v-else type="primary" @click="addNews">发布</el-button>
        
        </el-form-item>
        
      </el-form>
    </el-dialog>
  </div>   
<!--------------->
</div>

</template>

<script>

import { getList,getList1,addObj,setObj} from "@/api/api.js";
import { getListByFunc,delObjByFunc,addObjByFunc,setObjByFunc,updateObjsByFunc} from "@/api/cloudFunc.js";

//import { init,login0,login } from "@/api/api.js";
import { randomString,getDate } from '@/utils/index'
import { deleteDataHandle } from '@/common/common.js'


//2002-4-22
/** 
import Vue from "vue"
import Cloudbase from "@cloudbase/vue-provider"

Vue.use(Cloudbase, {
    env: "tianshibot-test"
})
*/

export default {
  data() {
    return {
      //search bar
      space:'',
      spaceMove:'',
      spaceOptions: [
        {},
      ],
      
      status:"",  //状态
      statusMove:'',
      statusOptions: [
        {value: '无', label: '无'},
        {value: '收集箱', label: '收集箱'},
        {value: '整理架', label: '整理架'},
        {value: '操作台', label: '操作台'},
        {value: '果子筐', label: '果子筐'},
        {value: 'CSM', label: 'CSM'},
      ]
      
      ,searchTime:[]  //起止时间
      ,dateTime:""    //起止
      ,valueDate: ''  //带快捷起止日期
      ,valueMonth: '' //带快捷起止月
      //时间快捷
      , timeOptions:{
        shortcuts: [{
            text: '现在',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '一天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 1);
              picker.$emit('pick', date);
            }
          }, {
            text: '三天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }, {
            text: '1小时后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 1 );
              picker.$emit('pick', date);
            }
          }, {
            text: '2小时后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 2 );
              picker.$emit('pick', date);
            }
          }, {
            text: '3小时后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 3 );
              picker.$emit('pick', date);
            }
          }, {
            text: '5分钟后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 60 * 1000 * 5 );
              picker.$emit('pick', date);
            }
          }, {
            text: '10分钟后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 60 * 1000 * 10 );
              picker.$emit('pick', date);
            }
          }, {
            text: '30分钟后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 60 * 1000 * 30 );
              picker.$emit('pick', date);
            }
          }]
      }
      //日期快捷
      , dateOptions:{
        shortcuts: [{
            text: '同一天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '提前一天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', date);
            }
          }, {
            text: '提前三天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', date);
            }
          }, {
            text: '提前一周',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }, {
            text: '提前一月',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          }]
      }
      , pickerOptions: {
          shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },{
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
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
          },{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
        
      
      //page bar
      ,multipleSelection: []
      ,pagesize:10
      ,currentPage:1
      ,tableData: []
      ,tableDataCurrent: []
      //add form start
      ,dialogFormVisible: false,
      form: {
          _id:''
          ,toDo:{
            title   : ''
            ,type   : ''
            ,status : ''
            ,content: ''
            ,picUrl : []
            ,space  : ''
            ,alertTime : ''
            //,fileExtendName: ""
            ,plannedTime:''
            ,actulaTime:''
          }
          ,advance : false  //复杂选项 2020-6-10
          ,alert : false
          ,fullDay : false
          ,enableEndDate : false
          ,Lunar : false
          ,alertNum:0
          ,alertType:''
          ,toDoTime:''
      },
      
      
      formLabelWidth: '120px'
      //add form end
      ,imgUrl: ""
      ,srcList: [this.imgUrl]

      //markdown 编辑器参数 2020-4-16 by tjob
      ,markdownOption: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      }
      ,loading: true //数据加载状态 2020-5-19
      ,searchStr : '' //2020-6-10
    };
  },
  async created() {
    
    /**
     //微信登陆
    const auth =this.$cloudbase.auth()
    // 1. 建议登录前先判断当前是否已经登录
    const loginState = await auth.getLoginState();
    //const loginState = await auth.signInAnonymously();
    // 匿名登录成功检测登录状态isAnonymous字段为true
    console.log('cloundBase.index.loginState:',loginState); // true
    
    if(!loginState){
      // 以匿名登录为例
      const loginState = await this.$cloudbase
        .auth({ persistence: "local" })
        .anonymousAuthProvider()
        .signIn()
      localStorage.setItem("hasLogin", true);
      console.log('cloundBase.index.loginState:',loginState); // true
      //this.$router.push(this.redirect)  
     
    }
     */
    //login0();  //index.js:144 tcb实例只存在一个auth对象  2020-4-29 移入api的tcb建立db和aurh 4-30 移入login登录页
    //init()   //2020-4-29 聊天室demo
    
  },
  mounted: function() {
    //console.log('mounted')
    
    
    this.searchData();
   },
  methods: {
    clearAllCondition(){
      this.status="";
      this.valueDate='';
      this.valueMonth="";
      this.dateTime="";
      this.searchTime="";
      
    }
    ,statusChange(){
       //切换订单状态
      console.log('statusChange',this.status)
      this.currentPage=1;
      this.form.toDo.status=this.status;
      console.log('this.form.toDo.status',this.form.toDo.status)
      
      this.searchData();
    } 
    ,statusFocus(){
      var param={COL_NAME : 'statusList' }
      getListByFunc("spaceList",param)
      .then(
        res => {

          this.statusOptions = res.map(item => {
            return { value: `${item.status.name}`, label: `${item.status.name}` };
          })
          ;
          console.log('statusOptions:',this.statusOptions)
        },
        err => {
          this.$message({
            message: err,
            type:'error'
          });
        }
      );
    } 
    ,spaceFocus(){
      var param={COL_NAME : 'spaceList' }
      getListByFunc("spaceList",param)
      .then(
        res => {

          this.spaceOptions = res.map(item => {
            return { value: `${item.space.name}`, label: `${item.space.name}` };
          })
          ;
          console.log('spaceOptions:',this.spaceOptions)
        },
        err => {
          this.$message({
            message: err,
            type:'error'
          });
        }
      );
    }
    ,spaceChange(){
      console.log('spaceChange',this.space)
      this.currentPage=1;
      this.form.toDo.space=this.space;
      console.log('this.form.toDo.status',this.form.toDo.status)
      
      this.searchData();
    }  
    
    // 网络请求统一处理
    ,searchData(){

      var that = this;
      var param = {}
      if(that.status){
        param['toDo.status']=that.status
      }
      if(that.valueDate.length>0){
        param['date']= that.valueDate
      }
      if(that.space){
        param['toDo.space']=that.space
      }
      //增加文本检索 2020-6-10
      if(that.searchStr){
        param['toDo.title']=that.searchStr
      }
      
      console.log('toDoList.searchStr:',that.searchStr)

      //getList1("toDoList",param)  //watch
      getListByFunc("toDoList",param)
      .then(
        res => {
          this.tableData = res
          //this.currentPage=1;
          this.refereshData();
          this.loading = false;
          //console.log("view.toDoList.searchData res:", res);
          
        },
        err => {
           this.$message({
            message: err,
            type:'error'
          });
          this.loading = false;
          console.log("view.toDoList.searchData err :", err);
        }
      );
      
      
      
      
    }
    //markdown 
    ,$save(e){
      console.log('mavonEditor.events.save:',e)
    }
    ,uploadPhoto(e) {
        let that = this;
        // 利用fileReader对象获取file
        var file = e.target.files[0];
        var filesize = file.size;
        var filename = file.name;
        // 2,621,440   2M
        if (filesize > 2101440) {
            // 图片大于2MB
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
    
            // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
            var imgcode = e.target.result;
            that.imgUrl = imgcode; //2020-4-12 用于预览 保留文件头
            // 去掉url的头
            let arr = imgcode.split(',');
            let mime = arr[0].match(/:(.*?);/)[1] ;
            that.form.image = arr[1];  //2020-4-7 by tjob
            that.form.fileExtendName = mime;  //2020-4-7 by tjob
            
            
        }
    }
    //清空form
    ,clearForm(){
      this.form = {
          _id:''
          ,toDo:{
            title: ''
            ,type: ''
            ,status:""
            ,content: ''
            ,picUrl: []
            //,fileExtendName: ""
            ,alertTime: ''
            
          }
          ,alert : false
          ,fullDay : false
          ,enableEndDate : false
          ,Lunar : false
      }
    }
    //关闭编辑窗口
    ,handleClose(done) { 
        //没有维护数据，可以不需要提醒，直接关闭 2020-4-22 by tjob
        let that = this;
        //console.log('handleClose.form',that.form)
        //console.log('handleClose.form_actual',that.form_actual)
          
        //if (JSON.stringify(that.form)==JSON.stringify(that.form_actual))
        //  console.log('form比较相等，没有变化')
        //  that.dialogFormVisible = false;
        //  return;

        this.$confirm('确定关闭编辑窗口？')
          .then(_ => {
            that.imgUrl="";
            that.srcList=[];
            //that.form= that.form_actual;
            this.clearForm()
            
            that.dialogFormVisible = false;
            done();
          })
          .catch(_ => {});
    }
    //新建
    ,createNew(){
      let that = this;
      //that.form_actual = Object.assign({},that.form);
      that.form.fullDay = true;
      that.dialogFormVisible = true;
      
    }
    //发布
    ,addNews(){
      ///addObj(this.form.toDo)
      
      addObjByFunc(this.form.toDo)
      .then(
        res => {
          console.log("addNews res:", res);
          this.clearForm()
          this.dialogFormVisible = false
          //this.$router.push({ path: "/news/news-list" });
          this.searchData();
        },
        err => {
          console.log("addNews err :", err);
        }
      );
      
    }
    //打开编辑
    ,editNews(scopeRow){
      //console.log('editNews.scopeRow:',scopeRow)
      let that = this;
      
      //console.log('editNews.scopeRow.toDo:',scopeRow.toDo)
      //that.form_actual = Object.assign(scopeRow);
      that.form= Object.assign(scopeRow);
      that.form.alert = scopeRow.toDo.alertTime ? true : false
      //that.form.fullDay = false
      //that.form.enableEndDate = false
      
      that.dialogFormVisible = true;
      
    }
    //更新
    ,updateNews(obj){
      //console.log('updateNews.this.form._id:',this.form._id)
      //console.log('updateNews.obj:',obj)

      const toDo = this.form.toDo
      setObjByFunc(this.form._id,toDo)
      .then(
        res => {
          console.log("updateNews res:", res);
          if(res.stats.updated){
            this.$message({message:"更新成功~",type: 'success'});  //没有更新也是成功 { stats: { updated: 0 }, errMsg: 'collection.update:ok' } 
            this.searchData();
            this.clearForm()
            this.dialogFormVisible = false
          }else{
            this.$message("数据没有变化，或者有故障。请取消退出~");  
          }
          
        },
        err => {
          console.log("updateNews err :", err);
        }
      );
    }
    ,delNews(obj){
      deleteDataHandle(this,obj)
    }
    //删除
    ,deleteData(obj) {
        console.log('deleteData.obj:',obj)
        const whereDictList = []
        obj.forEach(obj => {
          whereDictList.push({_id:obj._id});
        }); 
        
        delObjByFunc(whereDictList)
        .then(
            res => {
            console.log("deleteData.res :", res);
            this.searchData();
            this.$message("处理成功~");
            },
            err => {
            console.log("deleteData.err :", err);
            }
        );
    },
    //批量修改
    batchMove(obj) {
        console.log('batchMove.obj:',obj)
        const whereDictList = []
        obj.forEach(obj => {
          whereDictList.push({_id:obj._id});
        }); 
        const data = {}
        if (this.statusMove){
          data['toDo.status']=this.statusMove;
        }
        if (this.spaceMove){
          data['toDo.space']=this.spaceMove;
        }
        
        updateObjsByFunc(whereDictList,data)
        .then(
            res => {
            console.log("batchMove.res :", res);
            this.searchData();
            this.$message("处理成功~");
            },
            err => {
            console.log("batchMove.err :", err);
            }
        );
    },
    //page
    handleSizeChange(val) {
      this.pagesize=val
      this.refereshData()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage=val
      this.refereshData()
      console.log(`当前页: ${val}`);
    }
    //换页刷新数据
    ,refereshData(){
      this.tableDataCurrent = this.tableData.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
    }
    //反选选择的多行-所有数据
    ,toggleSelection() {
      this.tableData.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      }); 
    }
    //取消选择的多行-所有数据
    ,cancelSelection() {
        this.$refs.multipleTable.clearSelection();
    }
    //反选选择的多行--当前页
    ,toggleSelectionCurrent() {
      this.tableDataCurrent.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      }); 
    }
    
    //选择行
    ,handleSelectionChange(val) {
      //console.log('handleSelectionChange:',val)
      this.multipleSelection = val;
    }
    //计划时间或实际时间
    ,handleTimeType(){
      if (this.form.timeType){
        this.form.toDo.plannedTime = this.form.toDoTime;
      }else{
        this.form.toDo.actualTime = this.form.toDoTime;
      }
    }
    //时间格式： time，起止    农历
    ,handleTimeFormat(){
      if (!this.form.enableEndDate && this.form.fullDay){
        this.form.pickerType = 'date';
      }else{
        this.form.pickerType = 'datetime';;
      }
    }
    //是否提醒
    ,handleAlert(){
      console.log('handleAlert',this.form.alert)
      if (this.form.alert) {
        this.form.toDo.alertTime = this.form.toDoTime ? this.form.toDoTime : new Date();
      }
    }
    //提醒提前num和type
    ,handleAlertTime(){
      console.log('toDoList.handleAlertTime.alertNum:',this.form.alertNum)
      console.log('toDoList.handleAlertTime.alertType:',this.form.alertType)
      console.log('toDoList.handleAlertTime.alertTime:',this.form.toDo.alertTime)
      const date = this.form.toDoTime ? this.form.toDoTime : new Date();
      if (this.form.alertNum && this.form.alertType) {
        
        
        switch ( this.form.alertType ) {
        case "月":
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * this.form.alertNum);
          this.form.toDo.alertTime = date;
          break;
        case "周":
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 7 * this.form.alertNum);
          this.form.toDo.alertTime = date;
          break;
        case "天":
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 1 * this.form.alertNum);
          this.form.toDo.alertTime = date;
          break;
        case "小时":
          date.setTime(date.getTime() + 3600 * 1000 * this.form.alertNum);
          this.form.toDo.alertTime = date;
          break;
        case "分钟":
          date.setTime(date.getTime() + 60 * 1000 * this.form.alertNum);
          this.form.toDo.alertTime = date;
          break;
        case "秒":
          date.setTime(date.getTime() + 1 * 1000 * this.form.alertNum);
          this.form.toDo.alertTime = date;
          break;
        default:
          console.log("default");
        }
      }
    }
}
};
</script>

<style>

.choose-color{
  z-index: 9999;
  /* width: 210px; */
}
.line {
  text-align: center;
}
.img-wrap {
  width: 100%;
  height: 500px;
  margin-left: 68px;
}
.box{
  width: 220px !important;
}
</style>