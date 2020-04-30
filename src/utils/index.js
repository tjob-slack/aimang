/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
/**
 * @param {number} 
 * @returns {string} 
 * 2020-4-5 by tjob
 */
export function randomString(randomLen, min, max){
  var str = "",
      pos = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
        'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // 随机产生
  if(randomLen){
    range = Math.round(Math.random() * (max-min)) + min;
  }
  for(var i=0; i<range; i++){
    pos = Math.round(Math.random() * (arr.length-1));
    str += arr[pos];
  }
  return str;
}




export function transUrl(s){
  //a=第一个个.之后， b=加第3个/之后
  let t = Object.assign(s)
  if (!t.imgFileid){
    return t
  }
  var s = t.imgFileid
  
  var s = s.split(".").slice(1)
  var s3 = s[0].split("/")
  s3[0]="http://"  + s3[0] + ".tcb.qcloud.la"

  var imgUrl = [s3.join("/") ,s.slice(1)].join(".")
  
  t.imgFileid = imgUrl

  return t
}

export function formatString(s){
  return s.split(',')
}

export function stringToString(s){
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
    
    let t = Object.assign(s)
    console.log('stringToString.t:',t)
    
    var flag = t.medName||'' && t.medName.indexOf(",") && 1  || t.unit||'' && t.unit.indexOf(",") && 2 ||  t.count||'' && t.count.indexOf(",")&& 3 
    console.log('stringToString.flag:',flag)

    if (!flag || flag<0) {
      t.medNameList=[t.medName,t.unit,t.count].join(",") 
      return t
    }

    let a = formatString(t.medName)
    let b = formatString(t.count)
    let c = formatString(t.unit)
    
    //需要换成动态长度 2020-4-14
    var  x0=[a[0],b[0],c[0]].join("")
    var  x1=[a[1],b[1],c[1]].join("")
    var  x2=[a[2],b[2],c[2]].join("")


    t.medNameList = [x0,x1,x2].join(",") 
    
    return t
}


export async function getDate(dd){
  const now = dd ? dd : new Date();
  console.log('api.now:',now)
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const date = [year,month,day].join("-") ;

  //const date = parseTime(now,'YYYY-MM-DD')
  console.log('api.date:',date)
  return date

}