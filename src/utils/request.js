import axios from 'axios'
import {
  Message
} from 'element-ui'
// 2020-4-5  by tjob from url 'https://juejin.im/post/591aa14f570c35006961acac'
//import store from '@/store'
//import { getToken } from '@/utils/auth'
import { randomString } from '@/utils/index'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url  
  // withCredentials: true, // send cookies when cross-domain requests
  //withCredentials: false,  //2020-4-5  解决 Access-Control-Allow-Origin
  timeout: 50000 // request timeout
  
  // `headers` 是即将被发送的自定义请求头
  //,headers: {
  //  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  //}
  
  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  ,params: { 
       token:localStorage.getItem("AMtoken")
      ,requestId: randomString(false, 30)
      ,timestamp: Date.parse(new Date())
  } 
  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  ,data: {
     token:localStorage.getItem("AMtoken")
    ,requestId: randomString(false, 30)
    ,timestamp: Date.parse(new Date())
  } 
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    //config.headers.token = localStorage.getItem('token')
    //config.headers['X-Token'] = getToken()   from url 'https://juejin.im/post/591aa14f570c35006961acac'
    
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */
  
  
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
      //response.setHeader("Access-Control-Allow-Origin", "*")  // 2020-4-7 by tjob
      console.log('request.response:',response)
      if (response.data.code=="10005"){
        localStorage.removeItem('hasLogin')
      }
      // 2020-4-7 by tjob end
    return response
    const res = response.data
    
    // if the custom code is not 100, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error check your token or method',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service.request
