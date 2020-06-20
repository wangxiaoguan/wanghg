
const pattern = new RegExp('[`~!%#$^&*()=|{}\':;\',\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“\'。，、？]'); 

export const checkUserName = (rule, value, callback) => {
  if (!!value && !/^[a-zA-Z][a-zA-Z0-9_]{4,14}$/.test(value)) {
    callback('用户名由5-15位数字、字母、下划线组成 , 必须以字母开头');
  } else {
    callback();
  }
};

export const checkPwd = (rule, value, callback) => {
  if (!!value && !/[a-zA-Z0-9_]{6,16}$/.test(value)) {
    callback('密码由6-16位数字、字母、下划线组成 , 区分大小写');
  } else {
    callback();
  }
};

export const checkRealName = (rule, value, callback) => {
  if (!!value && !value.replace(/(^\s+)|(\s+$)/g, '').match(/^[\u4e00-\u9fa5]{2,4}$/)) { 
    callback('姓名必须是2-4中文!');
  } else {
    callback();
  }
};

export const checkCheckbox = (rule, value, callback) => {
  if (!!value && !value) {
    callback('您还未接受用户服务协议!');
  } else {
    callback();
  }
};








//最多为十八个汉字
export const limitChars = (rule, value, callback) => {
  if (!!value && value.length > 18 ) {
    callback('*请输入正确字符且最多18位');
  } else if (pattern.test(value)) {
    callback('非法字符');
  } else {
    callback();
  }
};
export const limitChars1 = (rule, value, callback) => {
  if (!!value && value.length > 30) {
    callback('*请输入正确字符且最多30位');
  } else {
    callback();
  }
};
export const limitChars2 = (rule, value, callback) => {
  if (!!value && value.length > 128) {
    callback('*请输入正确字符且最多128位');
  } else {
    callback();
  }
};



export const checkCard = (rule, value, callback) => {
  let arg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
  if (value) {
    if (arg.test(value)) {
      callback();
    } else {
      callback('*身份证号不正确');
    }
  } else {
    callback();
  }
};


export const socialSecurity = (rule, value, callback) => {
  let arg = /^[0-9]{10}$/;
  if (value) {
    if (arg.test(value)) {
      callback();
    } else {
      callback('*请输入正确的社会保险号!');
    }
  } else {
    callback();
  }
};
export const limitChars3 = (rule, value, callback) => {
  if (!!value && value.length > 25) {
    callback('*请输入正确字符且最多25位');
  } else if (pattern.test(value)) {
    callback('非法字符');
  } else {
    callback();
  }
};

export const limitChars9 = (rule, value, callback) => {
  if (!!value && value.length > 20) {
    callback('*请输入正确字符且最多20位');
  } else {
    callback();
  }
};
export const limitChars5 = (rule, value, callback) => {
  if (!!value && value.length > 10) {
    callback('*最大为10个字符或5个汉字');
  } else {
    callback();
  }
};
export const limitChars2010 = (rule, value, callback) => {
  if (!!value && value.length > 20) {
    callback('*最大为20个字符或10个汉字');
  } else {
    callback();
  }
};

export const checkInput = (rule, value, callback) => {
  if (pattern.test(value)) {
    callback('请勿输入非法字符');
  }else if(value.length>20){
    callback('长度不得超过20');
  }else if(!value){
    callback('名称为必填项');
  }else{
    callback()
  }
};
