// 使用 Web 端 SDK
const tcb = require('tcb-js-sdk')  //cloudbase
console.log('api.api.tcb:',tcb)
const app = tcb.init({ 
  /* 初始化... */ 
  env: "tianshibot-test"
  ,_openid: 'ozVib5W5yhvFrhOaMQpScujkaR2U' //cloud.getWXContext(context).OPENIDI
})

//云函数新增  2020-4-26 by tjob
export async function addObjByFunc(toDo) {
    // 数据库新增
    console.log('addObjByFunc.toDo',toDo)  
    //const dbResp = await tcbDb.collection(COL_NAME).add({
    const funcResp = await app.callFunction({
      name: 'toDoAdd',
      data:{
        //data: { //云函数需要data包裹
        //e_id: eId,
        COL_NAME: 'toDoList'
        ,_openid: 'ozVib5W5yhvFrhOaMQpScujkaR2U' //cloud.getWXContext(context).OPENID
        ,date: date
        ,createDate:now
        ,toDo
        
      }   //云函数需要data包裹
    })
    .then(
      res => {
        console.log('addObjByFunc.res:', res)
      },
      err => {
        console.log("addObjByFunc.err :", err);
      }
    );
   
  return funcRespr.esult
  //return dbResp
  }
  
//云函数删除
export async function  delObjByFunc(whereDictList){
  
    const resp = await app.callFunction({
      // 云函数名称
      name: "toDoDel",
      // 传给云函数的参数
      data: {
        whereDictList  //[{_id:"" },]
      }
    })
    .then(res => {
      //console.log(res); // 输出 "3"
      console.log('api.delObjByFunc.res:',res)
      return res
    })
    .catch(error=>{
      console.log('api.delObjByFunc.error:',error)
    })
    return resp.result
    
  }
// 云函数更新数据
export async function setObjByFunc(id,toDo) {
    console.log("api.setObj.id:",id)
    console.log("api.setObj.toDo:",toDo)
    
    const dbResp = await app.callFunction({
        // 云函数名称
        name: 'toDoUpdate',
        // 传给云函数的参数
        data: {
            _openid:'ozVib5W5yhvFrhOaMQpScujkaR2U'
            ,whereDictList:[{_id: id} ]
            ,toDo
        }
      })
    .then(
      res => {
        console.log('setObjByFunc.res:', res)
        return res
      },
      err => {
        console.log("setObjByFunc.err:", err);
      }
    );
  return dbResp.result
}

  

//云函数查询
export async function  getListByFunc(func="toDoList",whereParams){  
    console.log('api.getListByFunc.whereStr:',whereParams)
    const resp = await app.callFunction({
      // 云函数名称
      name: func,
      // 传给云函数的参数
      data: {whereParams: whereParams}
    })
    .then(res => {
      //console.log(res); // 输出 "3"
      console.log('api.getListByFunc.res:',res)
      return res
    })
    .catch(error=>{
      console.log('api.getListByFunc.error:',error)
    })
    return resp.result
    
  }
  