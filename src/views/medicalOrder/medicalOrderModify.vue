<template>
  <div class="root">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="100px" style="width:600px">
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-col :span="8">
              <el-select v-model="form.type" placeholder="选择类型">
                <el-option value="医疗新闻">医疗新闻</el-option>
                <el-option value="社区信息">社区信息</el-option>
				<el-option value="健康知识">健康知识</el-option>
              </el-select>
            </el-col>
            
          </el-form-item>
          <el-form-item label="图片">
           
            <el-col :span="11">
              

		        <input @change="uploadPhoto($event)" type="file" class="kyc-passin">
          
            </el-col>
          </el-form-item>
          
          <el-form-item label="正文">

			<el-input  type="textarea"  :rows="5"  placeholder="请输入正文"  v-model="form.text"></el-input>
		  </el-form-item>
          

          <el-form-item>
            <el-button type="info" @click="preview">预览</el-button>
            <el-button type="primary" @click="addMaterial">立即生成</el-button>
            <!-- <el-button>取消</el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div class="img-wrap">
          <el-image
            fit="scale-down"
            style="width: 400px; height: 400px;"
            :src="imgUrl"
            :preview-src-list="srcList"
          ></el-image>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addNews } from "@/api/test.js";
import request from '@/utils/request'
import { randomString } from '@/utils/index'

export default {
  data() {
    return {
      type_1: true,
      mType: "1",
      
      form: {
        title: "",
        text:  "",
        
        
      },
      image: "",
      fileExtendName: "",
      imgUrl: "",
      srcList: [this.imgUrl]
    };
  },
  created: function() {
    
  },
  methods: {
    preview() {
      this.form.color = this.form.color.substring(1,7);
      console.log("this.form :", this.form);
      // return 0;
      let that = this;
      this.req({
        url: "previewMaterial",
        data: that.form,
        method: "POST"
      }).then(
        res => {
          console.log("res :", res);
          that.imgUrl = res.data;
          that.srcList = [that.imgUrl];
        },
        err => {
          console.log("err :", err);
        }
      );
    },
    uploadSuccess(response, file, fileList) {
      console.log("response :", response);
      //this.form.logoUrl = response.data;
    },
    selectChange(value) {
      console.log("value :", value);
      this.imgUrl = value;
      this.srcList = [value];
    },
    addMaterial() {
      let that = this;
      let data = {
          title: that.form.title,
          type: that.form.type,
          text: that.form.text,
          image: that.image,
          fileExtendName: that.fileExtendName
          ,status:1
      };
      console.log('data:',data)
      
      this.req({
        url: "news",
        method: "POST",
        data
      })
      .then(
        res => {
          console.log("addNews res:", res);
          this.$router.push({ path: "/medicalOrder/medicalOrder-list" });
        },
        err => {
          console.log("addNews err :", err);
        }
      );
       
    },
    
    
    typeChange(value) {
      console.log("value :", value);
      if (value == "1") {
        this.type_1 = true;	
        this.form.text3 = null;
        this.form.text4 = null;
      } else {
        this.type_1 = false;
      }
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

            // 去掉url的头
            let arr = imgcode.split(',');
            let mime = arr[0].match(/:(.*?);/)[1] ;
            that.image = arr[1];  //2020-4-7 by tjob
			      that.fileExtendName = mime;  //2020-4-7 by tjob
            
            
        }
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