
import { INCREMENT, DECREMENT, CHANGECITY, CHANGEMSG, CHANGEMSGBYINP } from "../actions";

export default (state=180303,action)=>{

    switch(action.type){
        case "ADD":
        state+=action.payload;
        
        // return Object.assign({},state,{count:state.count}); // 全新的对象  
        return state;
        break;

        case INCREMENT:
        // return {...state,...{count:++state.count}}
        state+=1;
        return state;
        break;

        case DECREMENT:
        state-=action.count;
        // return {...state,...{count:state.count-action.count}}
        return state;
        break;

        default:
        return state;
        break;
    }
}