<template>
  <div id="app">
    <LoginState v-slot="{ loginState }">
      <h1>{{ loginState ? '已登录' : '未登录' }}</h1>
    </LoginState>
    
    {{docs}}


    

    

  </div>
  
</template>

<script>
import Vue from "vue"
import Cloudbase from "@cloudbase/vue-provider"

Vue.use(Cloudbase, {
    env: "tianshibot-test"
})

export default {
  data() {
    return {
      docs: []
      //,form:{
      //  inputText:'测试新增数据'
      //  ,slotInfo:[]
      //}
    }
  },
  
  async created() {
    
    
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
    
    

   /**
    if(!loginState){
      // 2. 调用微信登录API
      await auth.weixinAuthProvider({
        appid: "wxf16b4dd8c071a7b5",   //微信公众平台/开放平台的 AppId
        scope: "snsapi_base"   //snsapi_base（公众平台，只获取用户的 openid），snsapi_userinfo（公众平台，获取用户的基本信息）
      }).signIn();
      localStorage.setItem("hasLogin", true);
    
    }
    //zhaodoan daima hui lai
    
    console.log('cloundBase.index.loginState:',loginState); // true


    const db = this.$cloudbase.database()
    const COL_NAME = 'toDoList'

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const date = [year,month,day].join("/") ;
    console.log('cloundBase.index.date:',date)
  

    // 数据库查询
    const queryResult = await db.collection('toDoList')
      .where({date: `${year}/${month}/${day}`})
      .field({toDo: true,createDate:true}) 
      .limit(20)
      .get()
    this.docs = queryResult

    console.log('queryResult:',this.docs); // true

/**
    // 数据库新增
      
    const dbResp = await db.collection(COL_NAME).add({
        //data: { //云函数需要data包裹
          //e_id: eId,
          //openid: cloud.getWXContext(context).OPENID
          date: date
          ,createDate:now
          ,toDo: {
            inputText: this.form.inputText
            ,slotInfo: this.form.slotInfo
          }
        //}   //云函数需要data包裹
      })
     console.log('dbResp', dbResp)
*/


  }
  
}

</script>