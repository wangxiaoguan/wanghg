import HMessage from '@/components/Antd/HMessage';

const Moment = require("moment");

export function* NormalCallRequest(data, funs, apiFunction) {
  const res = yield funs.call(apiFunction, data.payLoad);
  if (res) {

    if (res.code === '10001' || res instanceof Blob) {
      if (data.callBack) {
        data.callBack(res);
      }
    }
    else {
      HMessage.error(res.msg);
    }
  }
  else {
    HMessage.error('请求失败，请联系管理员处理');
  }

  return res;
}

export function getPropsParams(props) {
  return props.match.params;
}

export function getExtension(path) {
  if (path && path.length > 0) {
    const indexOfDot = path.lastIndexOf('.');
    if (indexOfDot >= 0) {
      return path.substr(indexOfDot);
    }
  }
  return '';
}

/**
 * 在两个PROPS中对比指定属性，如果值不同，则执行指定方法
 * @param {*} props1 
 * @param {*} props2 
 * @param {Array|any} attribute 要比较的属性列表，如果是数组，则循环每个属性；否则初为一个属性
 * @param {*} handler 如果属性不同，要执行的函数
 */
export function compareProps(props1, props2, attribute, handler) {
  if (props1 && props2) {
    for (let att of attribute) {
      if (props1[att] !== props2[att]) {
        return;
      }
    }
  }
  handler();
}

export function translateFormValues(values) {
  if (values) {
    let result = {};
    for (let key in values) {
      let item = values[key];
      if (item instanceof Moment) {
        result[key] = item.format('YYYY-MM-DD');
      }
      else {
        result[key] = item;
      }
    }
    return result;
  }
  return {};
}

/**
 * 创建搜索字符串
 * 规则如下
 * + 无值，忽略
 * + customeRule 有设置，优先按customeRule设置的规则
 * + 字符串，模糊搜索 LK
 * + 数字或可转换成数字的字符串，精确搜索 EQ
 * + 长度为1的moment数组，精确搜索EQ
 * + 长度为2的moment数组，范围搜索1--D_GE,2--D_LE
 * @param {*} params 
 * @param {*} customeRule 自定义规则函数，格式为customeRule(params, key)=>string，返回值格式为为Q=key_EQ=value
 */
export function createSearchString(params, customeRule = null) {
  const DATE_FORMAT = 'YYYY-MM-DD';
  const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  let paramsList = [];
  for (let key in params) {
    let value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      let currentStr = null;
      if (customeRule) {
        currentStr = customeRule(params, key);
      }
      // 如果未自定义规则，则使用通用规则 
      if (!currentStr) {
        switch (true) {
          // 数字使用EQ
          case typeof (value) === 'number':
            currentStr = `Q=${key}_EQ=${value}`;
            break;
          // 字符串使用LK
          case typeof (value) === 'string':
            // //FIX:这里单独区分大写使用EQ
            // const reg = /^[A-Z]+$/;
            // if (reg.test(value)) {
            //   currentStr = `Q=${key}_EQ=${value}`;
            // } else {
            currentStr = `Q=${key}_LK=${value}`;
            // }
            break;
          // 单个日期使用EQ
          case value instanceof Moment:
            currentStr = `Q=${key}_EQ=${value.format(DATE_FORMAT)}`;
            break;
          // 多日期使用D_GE
          case value instanceof Array && value.length >= 2:
            if (value[0] instanceof Moment) {
              currentStr = `Q=${key}_D_GE=${value[0].format(TIME_FORMAT)}&&Q=${key}_D_LE=${value[1].format(TIME_FORMAT)}`;
            }
            break;
          default:
            break;
        }
      }
      if (currentStr) {
        paramsList.push(currentStr);
      }
    }
  }

  if (paramsList.length) {
    return `?${paramsList.join('&&')}`;
  }
  return '';
}

export function createExportParams(values) {
  if (!values) {
    return '';
  }
  let result = {};
  for (let key in values) {
    const value = values[key];
    // 如果是moment数组，进行转换
    if (value instanceof Array && value.length >= 2 && value[0] instanceof Moment && value[1] instanceof Moment) {
      result[`${key}Start`] = value[0];
      result[`${key}End`] = value[1];
    }
    else {
      result[key] = value;
    }
  }
  return result;
}

export function hsCodeSearchStr(codeList) {
  return `Q=hsCode_LK=${codeList.map(item => item.hsCode).join()}`;
}

export function icsCodeSearchStr(codeList) {
  return `Q=icsCode_LK=${codeList.map(item => item.icsCode).join()}`;
}

export function countryCodeSearchStr(codeList, paramName = 'countryName') {
  return `Q=${paramName}_LK=${codeList.map(item => item.countryName).join()}`;
}

export function isEmptyArray(arr) {
  return !arr || !arr.length;
}

export function getQueryUrl(params) {
  let result = '';
  if (params) {
    const keys = Object.keys(params);
    if (keys.length) {
      result += '?Q=';
      keys.forEach(key => {
        if (
          !params[key] ||
          params[key] === '' ||
          key === 'current' ||
          key === 'pageSize' ||
          key === 'total' ||
          key === 'page' ||
          key === 'currentUserId'
        ) {
          return;
        }
        result += `${key}=${encodeURIComponent(params[key])}&&Q=`;
      });
      if (result === '?Q=') {
        result = '';
      } else {
        result = result.slice(0, result.length - 4);
      }
    }
  }
  return result;
}

/**
	 * 判断两个变量是否相同。都为null/undefined/NaN视为相同
	 * @param {*} a 
	 * @param {*} b 
	 */
export function isEqual(a, b) {
  // 先判断是否指向同一个实例
  if (a === b) {
    return true;
  }
  else if ((a === null && b === null)
    || (typeof (a) === 'number' && typeof (b) === 'number' && isNaN(a) && isNaN(b))
    || (typeof (a) === 'undefined' && typeof (b) === 'undefined')) {
    return true;
  }
  else if (a instanceof Function && b instanceof Function) {
    return a === b;
  }
  // 如果是数组
  else if (a instanceof Array && b instanceof Array) {
    // 先判断长度
    if (a.length !== b.length) {
      return false;
    }
    // 长度相同，则比较每一项，任意一项不同，就返回false
    let len = a.length;
    for (let i = 0; i < len; i++) {
      let result = isEqual(a[i], b[i]);
      if (!result) {
        return false;
      }
    }
    return true;
  }

  // 如果是object，则循环比较每一个属性
  else if (a instanceof Object && b instanceof Object) {
    let propsA = Object.getOwnPropertyNames(a);
    let propsB = Object.getOwnPropertyNames(b);
    // 如果属性数量不同，返回false
    if (propsA.length !== propsB.length) {
      return false;
    }

    // 循环属性，任意一个属性值不同，返回false
    for (let key in a) {
      if (!isEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  else {
    return a === b;
  }
}

export function exportFileFromBlob(blob, fileName = null) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  if (fileName) {
    link.download = fileName;
  }
  link.click();
}

export function createFormRules(required, max = 50, reg = null, requiredMsg = '请输入数据') {
  let result = [];
  if (required) {
    result.push(
      {
        required,
        message: requiredMsg,
      },
    );
  }
  if (max) {
    result.push(
      {
        max,
        message: `不能超过${max}个字符`
      }
    );
  }
  if (reg) {
    result.push(
      {
        pattern: reg,
        message: `请输入正确的格式`
      }
    );
  }
  return result;
}