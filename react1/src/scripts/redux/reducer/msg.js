


import {CHANGEMSG} from '../action'

export default (state='武汉科技大学',action)=>{


        switch(action.type){

            case CHANGEMSG:
            return action.msg;
            break;

            default:
            return state;
            break;
        }
}