<template>
  <div class="root">
    <!--el-row :gutter="20"-->
      <!--el-col :span="12"-->
        
        <el-form ref="form" :model="form" label-width="100px" style="width:100%">

          <el-form-item label="类型">
            <!--el-col :span="8"-->
              <el-select v-model="form.type" placeholder="选择类型">
                <el-option value="医疗新闻">医疗新闻</el-option>
                <el-option value="社区信息">社区信息</el-option>
                <el-option value="健康知识">健康知识</el-option>
              </el-select>
            <!--/el-col-->
          </el-form-item>

        
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

         

          <!--el-form-item label="图片">
            <el-col :span="11">
              <input @change="uploadPhoto($event)" type="file" class="kyc-passin">
            </el-col>
          </el-form-item-->
          
          <!--el-form-item label="正文">
            <el-input  type="textarea"  :rows="9"  placeholder="请输入正文"  v-model="form.text"></el-input>
          </el-form-item-->

          <!--2020-4-16 基于Vue的markdown编辑器-->
          <el-form-item label="正文">
               <!--mavon-editor v-model="value"/-->
              <div class="mavonEditor">
                <!--no-ssr-->
                  <mavon-editor 
                    ref=md
                    :toolbars="markdownOption" 
                     v-model="form.text"
                    @save = "$save"
                  />
                <!--/no-ssr-->
              </div>
          </el-form-item>

          <el-form-item>
            <el-button type="info" @click="preview">预览</el-button>
            <el-button type="info" @click="$save">暂存</el-button>
            <el-button type="primary" @click="addMaterial">立即上传</el-button>
            <!-- <el-button>取消</el-button> -->
          </el-form-item>
        </el-form>
      <!--/el-col-->
      
      <!--el-col :span="12">
        <div class="img-wrap">
          <el-image
            fit="scale-down"
            style="width: 400px; height: 400px;"
            :src="imgUrl"
            :preview-src-list="srcList"
          ></el-image>
        </div>
      </el-col-->

    <!--/el-row-->
    <VueFormMaker :options="options"/>
  </div>
</template>

<script>

//2020-4-16 
//const towxml = new Towxml();
//import {towxml} from '../../plugins/towxml/towxml'
import towxml from '../../plugins/towxml/index'  //正确的地址import即可
//import {towxml} from 'towxml'
//const Towxml = require('towxml');

//const towxml = new Towxml();
//console.log('add-news.towxml:',towxml)
/**
 * 默认大小样式为 min-height: 300px , min-width: 300px 可自行覆盖
基础z-index: 1500
仅用作展示可以设置props: toolbarsFlag: false , subfield: false, defaultOpen: "preview"
 */

//2020-4-18 
//import markdownItMermaid from 'markdown-it-mermaid'
//import markdownItMermaid from '../../../node_modules/markdown-it-mermaid/dist/index.js'
import markdownItMermaid from '../../plugins/markdown-it-mermaid-master/src/index.js'

export default {
  data() {
    return {
      type_1: true,
      mType: "1",
      
      form: {
        title: "",
        text:  "#### how to use mavonEditor in nuxt.js",  //handbook: "#### how to use mavonEditor in nuxt.js"
        
        
      },
      image: "",
      fileExtendName: "",
      imgUrl: "",
      srcList: [this.imgUrl]

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
      
      //form-maker
      ,options:{}
      
    };
  },
  created: function() {
    
  }
  ,components: {
			//towxml
   }
  ,mounted: function() {
    //const mdi = markdownIt() 
    //const mdi = this.$refs.md.markdownIt
    //console.log("mounted:",mdi)
    //mdi.use(markdownItMermaid)
    this.formMaker()
  } 
  ,methods: {
    
    uploadSuccess(response, file, fileList) {
      console.log("response :", response);
      //this.form.logoUrl = response.data;
    },
    selectChange(value) {
      console.log("value :", value);
      this.imgUrl = value;
      this.srcList = [value];
    },
    //markdown 
    $save(e){
      console.log('mavonEditor.events.save:',e)
    }
    ,preview(){
      let that = this;
      console.log('that.form.text:',that.form.text);    
      let towxmlData = towxml(that.form.text||'','markdown');
      console.log('towxmlData:',towxmlData);    

    }

    ,addMaterial() {
      let that = this;

      let data = {
          title: that.form.title,
          type: that.form.type,

          //text: that.form.text,
          text:towxmlData, //Markdown转towxml数据 2020-4-16 by tjob

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
          this.$router.push({ path: "/news-list" });
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
            that.imgUrl = imgcode; //2020-4-12 用于预览 保留文件头
            // 去掉url的头
            let arr = imgcode.split(',');
            let mime = arr[0].match(/:(.*?);/)[1] ;
            that.image = arr[1];  //2020-4-7 by tjob
            that.fileExtendName = mime;  //2020-4-7 by tjob
            
            
        }
    }

    //form-maker 2020-4-18 3:36
    ,formMaker(){
       this.options = {
          formProps:{
            'label-width': 60
          },
          // 表单数据 必需
          formData: {
            accout: '',
            pwd: '',
            mail: '',
            gender: '',
            msg: '',
            phone: '',
            color: 'red',
            city:'',
          },
          // 表单项组件数据 必需
          formItem: [
            {
              type: 'select',
              key: 'city',
              label: '地区',
              props: {
                placeholder: '请选择地区',
                  icon: 'ios-clock-outline'
              },
              children: [
                {
                  label: '天津',
                  value: 'tianjin'
                },
                {
                  value: 'shenzhen',
                  disabled: true,
                  label: '深圳'
                },
                {
                  label: '韶关',
                  value: 'shaoguan'
                },
              ],
              events: {
                'on-change':function(e) {
                  console.log('city.events:on-change:',e)
                  alert(this.options.formData.city)
                }
              }
            }
            ,{
              type: 'input',
              key: 'accout',
              label: '账号',
              props: {
                placeholder: '有icon和事件的input',
                  icon: 'ios-clock-outline'
                }
              ,events: {
                'on-click': function() {
                  alert('你点击了图标')
                },
                'on-change': function(e) {
                  //alert('修改了账号的值')
                  console.log('accout.events:on-change:e.data',e.data)
                  console.log('accout.events:on-change:e.target.value',e.target.value)
                  this.$parent.form.title='account.on-change：这是一个赋值的操作'
                  this.options.formData.title='account.on-change：这是一个账号的赋值操作';
                  
                }
              }
              ,rules: {
                required: true,
                message: '请输入账号',
                trigger: 'blur'
              },
             
            },
            {
              type: 'input',
              key: 'phone',
              label: '手机',
              props: {
                placeholder: '请输入手机号...',
              },
              rules: {
                required: true,
                trigger: 'blur',
                validator(rule, value, callback) {
                    if (value === '') {
                        callback(new Error('请输入手机号'))
                    } else if (value.length != 11) {
                        callback(new Error('请输入正确的手机号'))
                    } else {
                        callback()
                    }
                }
              }
            },
            {
              type: 'input',
              label: '留言',
              key: 'title',
              props: {
                placeholder: '留言...',
                type: 'textarea'
              },
              rules:[
                  { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
                  { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
              ]
            },
            {
              type: 'button',
              text: '圆形按钮',
              props: {
                type: 'primary',
                shape: 'circle'
              }
              ,events: {
                'click': function() {
                  alert('你点击了图标')
                },
              }
              ,success(formData) {
                //alert(JSON.stringify(formData))
                 console.log('success.formData',formData)
              },
              fail(formData) {
                //alert('验证失败')
                console.log('fail.formData',formData)
              }
            },
            {
              type: 'buttonGroup',
              // 子项可以省略type: 'button'
              // 并且提供了简写方式 可以直接写props的属性 而不用像下面这样使用
              // props: {
              //		icon: 'logo-facebook'
              // }
              children: [
                {
                  icon: 'logo-facebook'
                },
                {
                  icon: 'logo-twitter'
                },
                {
                  icon: 'logo-googleplus'
                },
                {
                  icon: 'logo-tumblr'
                }
              ]
            }
          ],
          
          // 提交按钮 必需
          submit:{
            className: 'btn-container',
            labelWidth: 0,
            text: '提交',
            props: {
              type: 'primary',
              shape: 'circle'
            },
            success(formData) {
              //alert(JSON.stringify(formData))
              this.options.formData.accout='success：这是一个账号的赋值操作';
              this.form.title='success：这是一个赋值的操作'
            },
            fail(formData) {
              //alert('验证失败')
              this.options.formData.accout='fail：这是一个账号的赋值操作';
              this.$parent.form.title='fail：这是一个赋值的操作'
            }
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

.mavonEditor {
  width: 100%;
  height: 100%;
}

</style>