<template>
    <div id="app"  class="root">
        
        <div >  
          <el-form ref="form" :model="form" label-width="100px" style="width:560px">
              <el-form-item label="标题">
                <el-input v-model="form.title" ></el-input>
              </el-form-item>
          </el-form>
      </div>
      <div>
        <VueFormMaker :options="options"/>
      </div>
    </div>

</template>

<script>


export default {
    data () {
        
      return {
        form: {
          title: "",
          text:  "",
        },
        options:{}
    };
  },
  mounted:function(){
        
  }
};

</script>
