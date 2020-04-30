import { parseTime,randomString } from '@/utils/index'

/**
 * //local：在显式退出登录之前的 30 天内保留身份验证状态。
 *  session：在窗口关闭时清除身份验证状态。
 *  none：在页面重新加载时清除身份验证状态。
 */
// 使用 Web 端 SDK
const tcb = require('tcb-js-sdk')  //cloudbase
console.log('api.api.tcb:',tcb)
const app = tcb.init({ 
  /* 初始化... */ 
  env: "tianshibot-test"
  ,_openid: 'ozVib5W5yhvFrhOaMQpScujkaR2U' //cloud.getWXContext(context).OPENIDI
})




const COL_NAME = 'toDoList'

const now = new Date();
console.log('api.now:',now)
//const year = now.getFullYear();
//const month = now.getMonth() + 1;
//const day = now.getDate();
//const date = [year,month,day].join("-") ;

const date = parseTime(new Date(),'YYYY-MM-DD')
console.log('api.date:',date)

export function login5(params) {
  console.log('login params:',params) 
  const resp =  request({
    url: 'https://tianshibot-test.service.tcloudbase.com/createTicket',
    method: 'post',
    data:{
      user: params.user
      ,password: params.password
    }
    
  }).then(
    res => {
      console.log('login.res:',res)
      if (res.data.token) {
        localStorage.setItem("hasLogin", true);
        localStorage.setItem("AMtoken", res.data.token);
        //localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
        return res.data
      }
      
    },
    err=>{
      console.log('api.login.err:',err)
    }
  )
  return resp
}
export async function login4(){
  //http://docs.cloudbase.net/authentication/anonymous.html#kai-tong-liu-cheng
  // 1. 建议登录前先判断当前是否已经登录
  //const loginState = await auth.hasLoginState();   //getLoginState被下一主版本废弃
  const loginState = await  app.auth({
    persistence: "session"   
  }).getLoginState();   //getLoginState 被下一主版本废弃
  console.log('api.login:loginState',loginState); // true
  if(loginState){
    return loginState
  }
  // 2. 请求开发者自有服务接口获取ticket

  const ticket =  axios.get('https://tianshibot-test.service.tcloudbase.com/createTicket', {
    params: {
      userid: '1234254574'
    }
  
    })
    .then(res => {
      console.log('getNews by axios.get:',res.data.list)
      return res.data.list
      },err => {
        console.log("err :", err);
      }
    )
  console.log('api.login.ticket:',ticket)
  if (!tichet){
    return 
  }
  // 3. 登录 Cloudbase
  //await auth.signInWithTicket(ticket);    
  return await  app.auth({
      persistence: "session"   
    })
    .customAuthProvider()
    .signIn(ticket)
    .then((res) => {
      console.log('api.login.customAuth.res:',res)
      // 登录成功
    })
    .catch(err => {
      // 登录失败
      console.log('api.login.customAuth.err:',err)
  });
}  
//客户端SDK使用微信登录
export async function login3(){
  //http://docs.cloudbase.net/authentication/anonymous.html#kai-tong-liu-cheng
  // 1. 建议登录前先判断当前是否已经登录
  //const loginState = await auth.hasLoginState();   //getLoginState被下一主版本废弃
  const loginState = await app.auth.getLoginState();   //getLoginState 被下一主版本废弃
  console.log('api.login:loginState',loginState); // true
  if(loginState){
    return loginState
  }
  // 2. 请求开发者自有服务接口获取ticket
  const ticket =  await fetch('https://tianshibot-test.service.tcloudbase.com/createTicket'
      , {  
        method: 'POST',
        //credentials: 'include',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({userid: '1234254574'})
        
      }
    )
    .then((response) => {
      // 这里拿到的 response 并不是一个 {name: 'test', age: 1} 对象
        //return response.json();  // 将 response.body 通过 JSON.parse 转换为 JS 对象
        if (response.ok) {
          console.log('fetch response ok',response);
          return response.json();
        } else {
          console.log('fetch response error',response.json());
          
        }
      })
      
      .catch((err) => {
        console.log('api.login.catch.error:',err);
      });
    
  console.log('api.login.ticket:',ticket)
  if (!tichet){
    return 
  }
  // 3. 登录 Cloudbase
  //await auth.signInWithTicket(ticket);    
  return await app.auth().customAuthProvider()
    .signIn(ticket)
    .then((res) => {
      console.log('api.login.customAuth.res:',res)
      // 登录成功
    })
    .catch(err => {
      // 登录失败
      console.log('api.login.customAuth.err:',err)
  });

}


//客户端SDK使用微信登录
export async function login2(){
  //http://docs.cloudbase.net/authentication/anonymous.html#kai-tong-liu-cheng
  // 1. 建议登录前先判断当前是否已经登录
  //const loginState = await auth.hasLoginState();   //getLoginState被下一主版本废弃
  const loginState = await app.auth().getLoginState();   //getLoginState 被下一主版本废弃
  console.log('api.login:loginState',loginState); // true
  if(loginState){
    return loginState
  }
  // 2. 调用微信登录API
  
  const provider = await app.auth().weixinAuthProvider({
    appid: "wxf16b4dd8c071a7b5",
    scope: "snsapi_base"  //"snsapi_userinfo"   网页授权类型，可选值包括snsapi_base（公众平台，只获取用户的 openid），snsapi_userinfo（公众平台，获取用户的基本信息）
    })
  console.log('provider:',provider)

    //.signIn()
  const singIn = await provider.signInWithRedirect()  //https://cloud.tencent.com/document/product/876/34660#weixinauthprovider
    
  console.log('login.signInWithRedirect()',singIn)
  // 如果页面含有微信的登录态，那么回调中会存在 LoginState
  const redire = await provider.getRedirectResult()

  console.log('login.getRedirectResult()',redire)
    

}


//云开发 登录鉴权 匿名
export async function login0(){
  //http://docs.cloudbase.net/authentication/anonymous.html#kai-tong-liu-cheng
  await app.auth().signInAnonymously();
  // 匿名登录成功检测登录状态isAnonymous字段为true
  const loginState = await app.auth().getLoginState();
  console.log('api.login:loginState.isAnonymous',loginState.isAnonymous); // true
  if(!loginState){
    // 以匿名登录为例
    const loginState =  app.auth().anonymousAuthProvider(
      { persistence: "local" }
      )      
      .signIn()
    // 使用 refreshToken 的前 6 位作为 uid
    //setUid(auth.hasLoginState().credential.refreshToken.slice(0, 6));
    const uid = app.auth().hasLoginState().credential.refreshToken.slice(0, 6);
    localStorage.setItem("uid", uid);
  
    localStorage.setItem("hasLogin", true);
    console.log('cloundBase.index.loginState:',loginState); // true
    return loginState
  }
}


//自定义登录 云函数"createTicket" 
export async function  login(params){  
  console.log('api.login.params:',params)
  
  const ticket = await app.callFunction({
    // 云函数名称
    name: "createTicket",
    // 传给云函数的参数
    data:{
      user: params.user
      ,password: params.password
    } 
  })
  .then(res => {
    //console.log(res); // 输出 "3"
    console.log('api.login:',res)
    return res
  })
  .catch(error=>{
    console.log('api.login.error:',error)
  })
  
  console.log('api.login.ticket:',ticket)
  if (!tichet){
    return 
  }
  // 3. 登录 Cloudbase
  //await auth.signInWithTicket(ticket);    
  return await  app.auth({
      persistence: "session"   
    })
    .customAuthProvider()
    .signIn(ticket)
    .then((res) => {
      console.log('api.login.customAuth.res:',res)
      // 登录成功
    })
    .catch(err => {
      // 登录失败
      console.log('api.login.customAuth.err:',err)
  });
}


export async function init() {
  // 使用匿名登录
  auth = await app.auth().anonymousAuthProvider().signIn();

  // 使用 refreshToken 的前 6 位作为 uid
  //setUid(auth.hasLoginState().credential.refreshToken.slice(0, 6));
  const uid = app.auth().hasLoginState().credential.refreshToken.slice(0, 6);
  localStorage.setItem("uid", uid);
  /**
  // 建立实时数据推送连接
  await db
    .collection("messages")
    .where({})
    .watch({
      onChange(snapshot) {
        setList(snapshot.docs);
        setLoading(false);
      },
      onError(err) {
        console.log(err);
      },
    });
   */
}