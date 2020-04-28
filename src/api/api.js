import request from '@/utils/request'
import axios from 'axios'
import { parseTime,randomString } from '@/utils/index'
//import API from 'iview/types/iview.components'

// 使用 Web 端 SDK
const tcb = require('tcb-js-sdk')  //cloudbase
const app = tcb.init({ 
  /* 初始化... */ 
  env: "tianshibot-test"

})

var tcbDb = app.database()

const COL_NAME = 'toDoList'

const now = new Date();
console.log('api.now:',now)
//const year = now.getFullYear();
//const month = now.getMonth() + 1;
//const day = now.getDate();
//const date = [year,month,day].join("-") ;

const date = parseTime(new Date(),'YYYY-MM-DD')
console.log('api.date:',date)


//数据库新增
export async function addObj(toDo) {
    // 数据库新增
    console.log('addObj.toDo',toDo)  
    const dbResp = await tcbDb.collection(COL_NAME).add({
      //data: { //云函数需要data包裹
        //e_id: eId,
        //openid: cloud.getWXContext(context).OPENID
        date: date
        ,createDate:now
        ,toDo
        
      //}   //云函数需要data包裹
    })
    .then(
      res => {
        console.log('addObj.res:', res)
      },
      err => {
        console.log("addObj.err :", err);
      }
    );
   

  return dbResp
  }

// 数据库更新
export async function setObj(id,toDo) {
    console.log("api.setObj.id:",id)
    console.log("api.setObj.toDo:",toDo)

    const dbResp = await tcbDb.collection(COL_NAME)
      .where({_id: id}  )
      .update({
      //data: { //云函数需要data包裹
        //e_id: eId,
        //openid: cloud.getWXContext(context).OPENID
        date: date
        ,updateDate:now
        ,toDo
        
      //}   //云函数需要data包裹
    })
    .then(
      res => {
        this.tableData = res
        
        console.log('setObj.res:', res)
      },
      err => {
        console.log("setObj.err:", err);
      }
    );
    
    
   

  return dbResp
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


export function getList0(url,params) {
  console.log('getList.params:',params) 
  const respData = {list:[]}
  
  const COL_NAME = 'toDoList'

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const date = [year,month,day].join("/") ;
  console.log('cloundBase.index.date:',date)


  // 数据库查询
  const queryResult =  db.collection('toDoList')
    .where(
      //{date: `${year}/${month}/${day}`}
      )
    .field({toDo: true,createDate:true}) 
    .limit(20)
    .get()
  this.docs = queryResult

  console.log('queryResult:',this.docs); // true
  
  return resp
}

//数据库查询
export async function  getList(COL_NAME='toDoList',whereStr){  
  
  const res = await tcbDb.collection(COL_NAME)
  .where(
    {
      //date: `${year}/${month}/${day}`
    }
  )
  .field({toDo: true,createDate:true}) 
  //.limit(20)
  //.get()
  
  .watch({
      onChange: snapshot => {
          console.log("收到snapshot！", snapshot)
          return snapshot.docs
      },
      onError: error => {
          console.log("收到error！", error)
      }
  })
  
  console.log('api.getList:',res)
  //return res.result
  return res
}
//云函数查询
export async function  getListByFunc(func="toDoList",whereStr){  
  console.log('api.getListByFunc.whereStr:',whereStr)
  const resp = await app.callFunction({
    // 云函数名称
    name: func,
    // 传给云函数的参数
    data: whereStr 
  })
  .then(res => {
    //console.log(res); // 输出 "3"
    console.log('api.getListByFunc:',res)
    return res
  })
  .catch(error=>{
    console.log('api.getListByFunc.error:',error)
  })
  return resp.result
  
}
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
 
return funcResp
//return dbResp
}

