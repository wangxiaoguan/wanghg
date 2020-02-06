
import { INCREMENT, DECREMENT, CHANGECITY, CHANGEMSG, CHANGEMSGBYINP } from "../actions";

export default (state=["daydayup~"],action)=>{
    switch(action.type){

        case CHANGEMSG:
        // return {...state,...{msg:action.msg}}
        return [action.msg];
        break;

        case CHANGEMSGBYINP:
        // return {...state,...{msg:action.msg}}
        return [action.msg]
        break;

        default:
        return state;
        break;
    }
}