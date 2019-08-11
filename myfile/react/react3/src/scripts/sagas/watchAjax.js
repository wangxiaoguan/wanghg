import {put,call,take} from 'redux-saga/effects';
import {customer,AJAX_SEND,tokenUpdate,tokenReset} from '../actions';
import ajax from '../utils/sagaAjax';

/**
 * 抽象公共异步action转化成常用3总形式
 */
export default function* watchAjax() {
    while(true){
        const action = yield take(AJAX_SEND);
        const {config,success,failed,error} = action;
        console.log("==================")
        console.log(action);
        if(action.loading){
            //todo
        }
        try{
            const response =yield call(ajax,config);
            // console.log(response.data)
            // console.log("success-------------------")
            success(response.data);
        }catch (e){
            //todo
            console.log('error')
            console.log(error)
            if(typeof error === 'function'){
                error(e);
            }
        }
    }
}