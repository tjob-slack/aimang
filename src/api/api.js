import request from '@/utils/request'
import axios from 'axios'
import { parseTime,randomString } from '@/utils/index'
//import API from 'iview/types/iview.components'

// 使用 Web 端 SDK
const tcb = require('tcb-js-sdk')  //cloudbase
console.log('api.api.tcb:',tcb)
const app = tcb.init({ 
  /* 初始化... */ 
  env: "tianshibot-test"
  ,_openid: 'ozVib5W5yhvFrhOaMQpScujkaR2U' //cloud.getWXContext(context).OPENIDI
})
console.log('api.api.app:',app)
  


const COL_NAME = 'toDoList'

  
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
    var tcbDb = app.database()

    console.log('api.api.tcbDb:',tcbDb)
    const _ = tcbDb.command
    const dbResp = await tcbDb.collection(COL_NAME)
      .where({_id: id}  )
      .update({
      //data: { //云函数需要data包裹
        //e_id: eId,
        //openid: cloud.getWXContext(context).OPENID
        //date: date
        updateDate:new Date()
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


//数据库查询
export async function getList(url,params) {
  console.log('getList.params:',params) 
  const respData = {list:[]}
  var tcbDb = app.database()

console.log('api.api.tcbDb:',tcbDb)
const _ = tcbDb.command
  const COL_NAME = 'toDoList'

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const date = [year,month,day].join("/") ;
  console.log('cloundBase.index.date:',date)

  // 数据库查询
  const queryResult = await tcbDb.collection('toDoList')
    .where({
      //{date: `${year}/${month}/${day}`}
      'toDo.status': status
      //.'toDo.status':status
      ,date:  new Date()
    })
    .field({toDo: true,createDate:true}) 
    .limit(20)
    .get()
  

  console.log('api.getList.queryResult:',queryResult); // true
  
  return queryResult.data
}

//数据库watch
export  function  getList1(COL_NAME='toDoList',whereParams){  
  const {status,date} = whereParams
  console.log('api.login.status:',status)
  console.log('api.login.date:',date)

  var tcbDb = app.database()

  console.log('api.api.tcbDb:',tcbDb)
  const _ = tcbDb.command

  
  const watcher  =  tcbDb.collection(COL_NAME)
  .where({
    
    'toDo.status': status
    //.'toDo.status':status
    ,date:  new Date()
  })
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
  
  console.log('api.getList:',watcher)
  //return res.result
  return watcher
}


