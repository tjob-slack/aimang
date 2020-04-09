<template>
  <el-table :data="tableData" style="width: 100%">
    <!--el-table-column prop="newsId" label="新闻数据ID编号"></el-table-column-->
    <el-table-column prop="date" label="时间" width="100"></el-table-column>
    <el-table-column prop="type" label="新闻类型" width="100"></el-table-column>
    <el-table-column prop="title" label="新闻标题" width="180"></el-table-column>
    <el-table-column prop="text" label="正文"  ></el-table-column>
    
    <el-table-column prop="imgFileid" label="云存储id"  width="180"></el-table-column>
    <el-table-column label="操作" fixed="right" width="200">
      <template slot-scope="scope">
        <el-button size="mini" @click="putNews(scope.row.newsId,1)" >编辑</el-button>
        <el-button size="mini" @click="putNews(scope.row.newsId,0)" type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getNews,getNews1 } from "@/api/test.js";
import { randomString } from '@/utils/index'
import { deleteDataHandle } from '@/common/common.js'

export default {
  data() {
    return {
      tableData: []
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
      /** 
      // 网络请求直接写在文件中
      this.req({
        url: "http://www.aimang.info:8088/api/web/news",
        data: {
          token: localStorage.getItem('AMtoken') //? localStorage.getItem('AMtoken') : login_init(account)
          ,requestId:randomString(false, 30)
          ,timestamp: Date.parse(new Date())
        },
        method: "GET"
      }).then(
        res => {
          console.log("tableData :", res);
          this.tableData = res.data;
        },
        err => {
          console.log("err :", err);
        }
      );
      */
    
      //reg end
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
</style>