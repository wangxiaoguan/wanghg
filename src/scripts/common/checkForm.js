
export const limitStr = (rule, value, callback,name) => {
    if(!value){
        callback(`${name}为必填项且字数限制60字`)
    }else if(!value.replace(/\s+/g,"")){
        callback(`${name}不可为字符串`)
    }else if(value.length>60){
      callback(`${name}字数限制60字`)
  }else{
        callback()
    }

};

export const limitMoney = (rule, value, callback) => {
  if(!value){
    callback('金额为必填项')
  }else if(isNaN(Number(value))){
      callback('请勿输入非数字值')
  }else if(!value.replace(/\s+/g,"")){
      callback(`金额不可为字符串`)
  }else if(value.indexOf('e')>-1||value.indexOf('E')>-1){
      callback('请勿输入非数字值')
  }else if(Number(value)<0){
      callback('请勿输入负数')
  }else if(Number(value)>100000){
    callback('最大数不得超过100000')
  }else{
      callback()
  }

};

