<template>
    <div id="app" class="root">
        <div >  
          <el-form ref="form" :model="form" label-width="100px" style="width:560px">
              <el-form-item label="标题">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
          </el-form>
      </div>
        <formCreate v-model="$fApi" :rule="rules" :option="options"  >  </formCreate>

    </div>
</template>



<script>
//import formCreate from '@form-create/element-ui';
import { maker } from '@form-create/element-ui'

export default {
    //components:{
    //    formCreate:formCreate.$form()
    //},
    data () {
        
        return {
            form: {
                title: "",
                text:  "",
            },
            $fApi:{},
            model: {},
            //表单生成规则
            rule:[
                maker.input('商品名称','goods_name'),
                maker.date('创建时间','created_at'), 
            ],
            //组件参数配置
            options:{
                //表单提交事件
                onSubmit:function (formData) {
                    //alert(JSON.stringify(formData));
                    console.log('formData:',formData)
                    //$f.setValue：修改表单组件的值
                    $data.$fApi.setValue(
                        {
                           [goods_name]:'这是一个自动赋值'
                        }
                        
                    )
                    console.log('formData:',formData)
                    
                }
            }
            ,rules:[]
        
        };
    },
    mounted:function(){
        //this.model = this.fApi.model();
        this.rules = [
                {
                type:'button',
                field:'addNew',
                title:'新增'
            },
            {
                type:'input',
                field:'goods_name',
                title:'商品名称',
                validate: [{type: 'string', required: true, message:'请输入名称'}]
            },
            {
                type:'checkbox',
                field:'label',
                title:'标签',
                options: [
                    {label:'好用',value:0},
                    {label:'快速',value:1},
                    {label:'高效',value:2},
                    {label:'全能',value:3},
                ]
            },
        ]
        //,$f.hidden：隐藏指定组件
        //$f.validate：验证表单
        //$f.setValue：修改表单组件的值
        //$f.append：追加表单组件
    }
    ,methods:{
        
    }
};

</script>