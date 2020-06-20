const isMobilephone = /^1(3|4|5|7|8)\d{9}$/; //手机号码
const isPhone = /^0\d{2,3}-\d{7,8}$|^0\d{10,11}$/; //电话
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


export const limitMoney2 = (rule, value, callback) => {
    if(isNaN(Number(value))){
        callback('请勿输入非数字值')
    }else if(value!==""&&!value.replace(/\s+/g,"")){
        callback(`不可为空字符串`)
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

export const limitNumber = (rule, value, callback) => {
    if(isNaN(Number(value))){
        callback('请勿输入非数字值')
    }else if(value!==""&&!value.replace(/\s+/g,"")){
        callback(`不可为空字符串`)
    }else if(value.indexOf('e')>-1||value.indexOf('E')>-1){
        callback('请勿输入非数字值')
    }else if(Number(value)<0){
        callback('请勿输入负数')
    }else if(Number(value)>10000){
        callback('最大数不得超过10000')
    }else if(value.indexOf('.')>-1){
        callback('请勿输入小数')
    }else{
        callback()
    }
};


export const limitWordNumber = (rule, value, callback,number) => {
    if(value.length>number){
        callback(`字数长度不得超过${number}字`)
    }else{
        callback()
    }
};

export const checkMobilePhone = (rule, value, callback) => {
    if (!!value && !(isMobilephone.test(value) )) {
      callback('手机号不规范!');
    } else {
      callback();
    }
};

export const checkPhone = (rule, value, callback) => {
    if (!!value && !(isPhone.test(value) )) {
      callback('电话不规范!');
    } else {
      callback();
    }
};

