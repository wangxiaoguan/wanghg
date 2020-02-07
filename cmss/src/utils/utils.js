/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import moment from 'moment';
import CryptoJS from 'crypto-js';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

// 本地缓存封装localstorage
export const storage = {
  getLocal(name) {
    let newdata = localStorage.getItem(name);
    try {
      newdata = JSON.parse(newdata);
    } catch (error) {
      // console.log( error );
    }
    return newdata;
  },
  setLocal(name, data) {
    try {
      return localStorage.setItem(name, JSON.stringify(data));
    } catch (error) {
      // console.log('error===', error);
    }
    return '';
  },
  getSession(name) {
    let newdata = sessionStorage.getItem(name);
    try {
      newdata = JSON.parse(newdata);
    } catch (error) {
      // console.log( error );
    }
    return newdata;
  },
  setSession(name, data) {
    return sessionStorage.setItem(name, JSON.stringify(data));
  },
};

export function getCurrentDate(num, hour = '') {
  let t1;
  if (hour !== '') {
    t1 = moment()
      .add(num, 'day')
      .format('YYYY-MM-DD');
    return `${t1} ${hour}`;
  } else {
    t1 = moment()
      .add(num, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
  }
  return t1;
}

//获取提醒时间
export function getMaxRemaindDate(date) {
  const m1 = moment(getCurrentDate(0));
  let d = moment.duration(date - m1, 'ms').get('days');
  if (d <= 0) {
    d = 1;
  }
  return d;
}

//防抖函数
export function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 不 同职务level获取相关权限
export function getFlagByLevel(obj, type) {
  if (obj.level !== undefined) {
    // level=1重要工作部署和党课有权限
    if (obj.level === 1) {
      if (type === '1' || type === '2' || type === '3') {
        return true;
      }
      return false;
    } else if (obj.level === 2) {
      if (Number(type) >= 1 && Number(type) <= 6) {
        return false;
      }
    } else {
      return true;
    }
  }
  return true;
}

export function judgeIeBower() {
  const ua = navigator.userAgent.toLowerCase();
  let isIe = false;
  if (ua.match(/msie ([\d.]+)/)) {
    const s = ua.match(/msie ([\d.]+)/);
    const [ie] = s;
    isIe = ie;
  }
  return Boolean(isIe);
}

// 获取时间信息
export function getNowFormatDate() {
  const date = new Date();
  const seperator1 = '-';
  const seperator2 = ':';
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`;
  }
  const currentdate = `${date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate} ${date.getHours()}${seperator2}${date.getMinutes()}${seperator2}${date.getSeconds()}`;
  return currentdate;
}

/**
 * AES 解密
 * @param encrypted base64格式的密文
 * @param key
 * @param iv
 * @returns {string}
 */
export function getDAesString(encrypted, key, iv) {
  const keyCode = CryptoJS.enc.Utf8.parse(key);
  const ivCode = CryptoJS.enc.Utf8.parse(iv);
  const decrypted = CryptoJS.AES.decrypt(encrypted, keyCode, {
    iv: ivCode,
    mode: CryptoJS.mode.CBC,
    // padding: CryptoJS.pad.Pkcs7,
    // format: JsonFormatter,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
