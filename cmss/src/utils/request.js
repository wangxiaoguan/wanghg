/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
// import { extend } from 'umi-request';
import router from 'umi/router';
import { storage } from './utils';
import 'isomorphic-fetch';
import hash from 'hash.js';
import { stringify } from 'qs';
import { notification, message } from 'antd';
import Config from '../../config/commenConfig'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  if (response.status !== 0) {
    notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: errortext,
    });
  }
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(
  url,
  options = {
    expirys: false,
  }
) {
  const defaultOptions = {
    credentials: 'include',
  };
  const userInfo = JSON.parse(storage.getLocal('userInfo'));
  const token = userInfo ? userInfo.usertoken : '';
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    /* =============   ie9不支持FormData    =============== */
    // if (!(newOptions.body instanceof FormData)) {
    //   console.log('777666');
    if (
      navigator.appName === 'Microsoft Internet Explorer' &&
      parseInt(
        navigator.appVersion
          .split(';')[1]
          .replace(/[ ]/g, '')
          .replace('MSIE', '')
      ) < 9
    ) {
      message.error('您的浏览器版本过低，请下载IE9及以上版本');
    }
    if (
      navigator.appName === 'Microsoft Internet Explorer' &&
      parseInt(
        navigator.appVersion
          .split(';')[1]
          .replace(/[ ]/g, '')
          .replace('MSIE', '')
      ) === 9
    ) {
      // console.log('99877666,是ie9');
      newOptions.headers = {
        'YQ-Token': token,
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body =
        typeof newOptions.body !== 'string' ? stringify(newOptions.body) : newOptions.body;
    } else {
      if (!(newOptions.body instanceof FormData)) {
        newOptions.headers = {
          // Accept: 'application/x-www-form-urlencoded',
          'YQ-Token': token,
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          ...newOptions.headers,
        };
        newOptions.body =
          typeof newOptions.body !== 'string' ? stringify(newOptions.body) : newOptions.body;
      } else {
        // newOptions.body is FormData
        newOptions.headers = {
          'YQ-Token': token,
          Accept: 'application/json',
          ...newOptions.headers,
        };
      }
    }
  }
  return (
    fetch(getUrl(url), newOptions)
      .then(checkStatus)
      // .then(response => cachedSave(response, hashcode))
      .then(response => {
        // DELETE and 204 do not return data by default
        // using .json will report an error.
        if (newOptions.method === 'DELETE' || response.status === 204) {
          return response.text();
        }
        return response.json();
      })
      .catch(e => {
        const status = e.name;
        if (status === 401) {
          // @HACK
          /* eslint-disable no-underscore-dangle */
          // window.g_app._store.dispatch({
          //   type: 'login/logout',
          // });
          router.push('/', { forceRefresh: true });
          window.location.reload(true);
          return;
        }
        // environment should not be used
        if (status === 403) {
          router.push('/exception/403');
          return;
        }
        if (status <= 504 && status >= 500) {
          router.push('/exception/500');
          return;
        }
        if (status >= 404 && status < 422) {
          router.push('/exception/404');
        }
      })
  );
}

/*
==========================带缓存========================
*/
const cachedSave = (response, hashcode) => {
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

export function requestCached(
  url,
  options = {
    expirys: true,
  }
) {
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const userInfo = JSON.parse(storage.getLocal('userInfo'));
  const token = userInfo ? userInfo.usertoken : '';
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    newOptions.headers = {
      'YQ-Token': token,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body =
      typeof newOptions.body !== 'string' ? stringify(newOptions.body) : newOptions.body;
  }

  const expirys = options.expirys || 120;
  // options.expirys !== false, return the cache,

  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        return JSON.parse(cached);
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(getUrl(url), newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        // window.g_app._store.dispatch({
        //   type: 'login/logout',
        // });
        router.push('/', { forceRefresh: true });
        window.location.reload(true);
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}

function getUrl(url) {
  // if(Config.TYPE === 2) {
  //   return url
  // }
  if(url && url.indexOf('/app') === 0){
    return '/bjdj02' + url
  }
  return url
}
