<template>

<div id="app">
<!--el-button size="mini" @click="dialogFormVisible = true" >新增</el-button-->
<!--el-button type="text" @click="dialogFormVisible = true">发布一条新的</el-button-->

  <el-table :data="tableData" style="width: 100%">
    <!--el-table-column prop="newsId" label="新闻数据ID编号"></el-table-column-->
    <el-table-column prop="date" label="时间" width="100"></el-table-column>
    <el-table-column prop="type" label="新闻类型" width="100"></el-table-column>
    <el-table-column prop="title" label="新闻标题" width="180" show-overflow-tooltip></el-table-column>
    <el-table-column prop="text" label="正文" show-overflow-tooltip ></el-table-column>
    
    <el-table-column prop="imgFileid" label="云存储id"  width="180"></el-table-column>
    <el-table-column label="操作" fixed="right" width="200">
      <template slot-scope="scope">
        <!--el-button size="mini" @click="putNews(scope.row.newsId,1)" >编辑</el-button-->
        <el-button size="mini"  @click="editNews(scope.row)">编辑</el-button>
        <el-button size="mini" @click="putNews(scope.row.newsId,0)" type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
<!-- Form -->
  <div class="root">      
    <el-dialog title="发布新闻消息" :visible.sync="dialogFormVisible" :before-close="handleClose" >
      <el-form ref="form" :model="form" label-width="60px" style="width:560px">

        <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="类型" >
            <el-select v-model="form.type" placeholder="选择类型">
              <el-option value="医疗新闻">医疗新闻</el-option>
              <el-option value="社区信息">社区信息</el-option>
              <el-option value="健康知识">健康知识</el-option>
            </el-select>
        </el-form-item>  
        
        <!--el-form-item label="正文">
          <el-input  type="textarea"  :rows="8"  placeholder="请输入正文"  v-model="form.text"></el-input>
        </el-form-item-->

        <!--2020-4-16 基于Vue的markdown编辑器-->
        <el-form-item label="正文">
              <!--mavon-editor v-model="value"/-->
            <div class="mavonEditor">
              <!--no-ssr-->
                <mavon-editor 
                  :toolbars="markdownOption" 
                    v-model="form.text"
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
          <el-button type="primary" @click="addNews">发布</el-button>
        
        </el-form-item>
        
      </el-form>
    </el-dialog>
  </div>   
<!--------------->
  </div>
</template>

<script>
import { getNews,getNews1 } from "@/api/test.js";
import { randomString } from '@/utils/index'
import { deleteDataHandle } from '@/common/common.js'

export default {
  data() {
    return {
      tableData: []
      //add form start
      ,dialogFormVisible: false,
      form: {
          title: ''
          ,type: ''
          ,text: ''
          ,image: ""
          ,fileExtendName: ""
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
      },
    };
  },
  mounted: function() {
    this.searchData();
   },
  methods: {
    // 网络请求统一处理
    searchData() {
      getNews()
      .then(res => {
        console.log("news-list mounted:", res);
        this.tableData = res;
      },err=>{
        console.log("err :", err);
      });
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
    
    , handleClose(done) {
        this.$confirm('确定关闭新闻编辑窗口？')
          .then(_ => {
            
            let that = this;
            that.file="";
            that.dialogFormVisible = false;
            that.imgUrl="";
            that.srcList=[];
            that.form= {
              title: ''
              ,type: ''
              ,text: ''
              ,image: ""
              ,fileExtendName: ""
            } ;
            done();
          })
          .catch(_ => {});
    }
    
    ,editNews(obj){
      let that = this;
      
      that.dialogFormVisible = true;
      that.form= {
        newsId: obj.newsId
        ,title: obj.title
        ,type: obj.type
        ,text: obj.text
        ,image: obj.imgFileid
        ,fileExtendName: obj.fileExtendName
        ,status:1
      };
    }
    ,addNews() { //上传新闻 包括base64图片
      let that = this;
      let data = {
          title: that.form.title,
          type: that.form.type,
          text: that.form.text,
          status:1
          
      };
      if (that.form.image){
        data.image = that.form.image
        data.fileExtendName= that.form.fileExtendName
          
      }
      if (that.form.fileExtendName){
        data.fileExtendName= that.form.fileExtendName
          
      }
      
      if (that.form.newsId){
        data.newsId= that.form.newsId
          
      }
      
      console.log('data:',data)
      
      this.req({
        url: that.form.newsId ? "news/update" : "news", //API方法：put修改  post新增
        method: "POST", 
        data 
      })
      .then(
        res => {
          console.log("addNews res:", res);
          that.dialogFormVisible = false
          //this.$router.push({ path: "/news/news-list" });
          this.searchData();
        },
        err => {
          console.log("addNews err :", err);
        }
      );
       
    }
    ,putNews(id,status) {
      let that = this;
      this.$confirm("确定继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .req({
              url: "news/update",
              data: {
                status:status,
                newsId:id,
              },
              method: "POST"
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