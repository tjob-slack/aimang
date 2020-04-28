import request from '@/utils/request'
import axios from 'axios'
import { randomString } from '@/utils/index'


export function getDoctorOrderList(params) {
  console.log('doctorOrder.getDoctorOrderList.params:',params) 
  const respData = []
  const resp =  request({
    url: 'appoint',
    method: 'get',
    params
    
  }).then(res => {
    console.log('doctorOrder.getDoctorOrderList.res:',res)
    return res.data.list
  })
  return resp
  }


  export function formatString(s){
    return s.split(',')
  }



