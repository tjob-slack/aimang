import request from '@/utils/request'
import axios from 'axios'
import { randomString } from '@/utils/index'


export function getDoctorOrderList(params) {
  console.log('doctorOrder.getDoctorOrderList.patams:',params) 
  const respData = []
  const resp =  request({
    url: 'appoint/getNumber',
    method: 'get',
    params
    
  }).then(res => {
    console.log('doctorOrder.getDoctorOrderList.res:',res)
      /**
      <el-table-column prop="medName" label="药物名称"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="count" label="数量"></el-table-column>
       */
      /**多条拼接字符串
      a1, a2, a3
      b1, b2, b3
      c1, c2, c3
      ==>
      a1,b1,c1;
      a2,b2,c2;
      a3,b3,c3
      */
    let aa = respData.push(res.data.value)  
    console.log('aa:',aa)
    return aa
  })
  return resp
  }


  export function formatString(s){
    return s.split(',')
  }



