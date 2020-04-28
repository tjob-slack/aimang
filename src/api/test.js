import request from '@/utils/request'
import axios from 'axios'
import { randomString,transUrl } from '@/utils/index'

const account = {
  user: 'zhangyi'
  ,password: 'J1234001'
}


export function login(params) {
  console.log('login params:',params) 
  const resp =  request({
    url: 'login',
    method: 'post',
    data:{
      requestId:randomString(false, 30)
      ,timestamp: Date.parse(new Date())
      ,user: params.user
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
      
    }
  )
  return resp
}

export function getNews(params) {
   
  const resp =  request({
    url: 'news',
    method: 'get',
    params:{
      
    }
    
  }).then(res => {
    console.log('getNews.get:',res.data.list)
    
    var respData = res.data.list.map(transUrl)  //云存储ID转Http链接 2020-4-11
    

    return respData

  })
  return resp
  }

export function addNews(params) {
   
  return request({
    url: 'news',
    method: 'post',
    params
  })
}


export function addNews1(params) {
  console.log('addNews params:',params)
  const resp =  axios.get('http://www.aimang.info:8088/api/web/news', {
    params: {
      token:localStorage.getItem('AMtoken')
      , requestId:randomString(false, 30)
      ,timestamp: Date.parse(new Date())
      ,title: params.title
      ,text: params.text
      ,image: params.image
      ,fileExtendName: params.fileExtendName
      ,type  : params.type
    }
  
  }).then(res => {
    console.log('getNews by axios.get:',res.data.list)
    return res.data.list
  })
  return resp
}

export function getNews1(params) {
  console.log('getNews params:',params)
  const resp =  axios.get('http://www.aimang.info:8088/api/web/news', {
    params: {
      token: localStorage.getItem('AMtoken') //? localStorage.getItem('AMtoken') : login_init(account)
      ,requestId:randomString(false, 30)
      ,timestamp: Date.parse(new Date())
    }
  
  }).then(res => {
    console.log('getNews by axios.get:',res.data.list)
    return res.data.list
  },err => {
    console.log("err :", err);
  })
  return resp
}



export function login_init(params) {
  console.log('login_init params:',params)
  
  const resp =  axios.get('http://www.aimang.info:8088/api/web/login', {
    params: {
      requestId:randomString(false, 30)
      ,timestamp: Date.parse(new Date())
      ,user: account.user
      ,password: account.password
    }
  
  }).then(res => {
    console.log('login_init by axios.get:',res.data)
    if (res.data.token) {
      localStorage.setItem("AMtoken", res.data.token);
    };
   
    return res.data.token
  
  })
  return resp
}   

export function login1(params) {
  console.log('login params:',params)

  const resp =  axios.get('http://www.aimang.info:8088/api/web/login', {
    params: {
      requestId:randomString(false, 30)
      ,timestamp: Date.parse(new Date())
      ,user: params.user
      ,password: params.password
    }
  
  }).then(res => {
    console.log('login by axios.get:',res.data)
    return res.data
  })
  return resp
}



