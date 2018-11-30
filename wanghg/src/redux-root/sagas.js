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
    console.log("response",response)
    if(response.status == 200 && response.data.retCode == -999){
    	location.hash = 'login';
      Message.error("登录超时")
    }else if(response.status == 401){
      location.hash = 'login'
      Message.error("登录超时")
    }else if(response.status == 403){
      Message.error("无权操作")
    }
    console.log("response",response)
  } catch (e) {
    yield put(getDataError(e));
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