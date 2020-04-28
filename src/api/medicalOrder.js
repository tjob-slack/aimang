import request from '@/utils/request'
import axios from 'axios'
import { randomString,transUrl,stringToString } from '@/utils/index'

    
export function getMedicalList(params) {
    console.log('medicalOrder.getMedicalList.patams:',params) 
    const resp =  request({
      url: 'medicament',
      method: 'get',
      params
      
    }).then(res => {
      console.log('medicalOrder.getMedicalList:',res.data.list)
        
      var respData = res.data.list.map(stringToString)  //云存储ID转Http链接 2020-4-11
      
      var respData = respData.map(transUrl)  //云存储ID转Http链接 2020-4-11
      

      return respData
    })
    return resp
  }





