import request from '@/utils/request'
import axios from 'axios'
import { randomString } from '@/utils/index'


export function getList(url,params) {
  console.log('getList.params:',params) 
  const respData = {list:[]}
  const resp =  request({
    url: url,
    method: 'get',
    params
    
  }).then(res => {
    console.log('getList.res:',res )
    
    if (res.data.list){
        respData.list = res.data.list
    }else{
        respData.list.push(res.data)
    }
    console.log('getList.respData:',respData )
    
    return respData.list
  })
  return resp
  }


 



