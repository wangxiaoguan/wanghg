import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { getDataSource, getDataError} from './action/table/table';
import { BEGINS } from './action/action-type';
import {Message } from 'antd';
// worker saga
function* showPostsAsync(action) {
  try {
    let response  =  
    yield call(axios.get,action.url);
    yield put(getDataSource(response.data));
    if(response.status == 200 && response.data.errorCode === 'A02B10001'){
    	location.hash = '#/login';
      // Message.error("登录超时");
      Message.error(response.data.errorMsg)
    }else if(response.status == 401){
      location.hash = '#/login';
      // Message.error("登录超时");
    }else if(response.status == 403){
      Message.error("无权操作");
    }else if(response.status == 200){
      localStorage.setItem('selectedRowKeys','');
      if(response.data.status!=1){
        Message.error(response.data.errorMsg);
      }
    }
  } catch (e) {
    yield put(getDataError(e));
    Message.error('请求数据失败')
  }
}

// wacther saga
function* watchGetPosts() {
  yield takeLatest(BEGINS, showPostsAsync);
}

// root saga
export default function* rootSaga() {
  yield watchGetPosts();
} 