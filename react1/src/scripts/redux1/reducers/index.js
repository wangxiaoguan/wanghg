import { INCREMENT, DECREMENT, CHANGECITY, CHANGEMSG, CHANGEMSGBYINP } from "../actions";


import {combineReducers}  from "redux"
import count from "./count"
import number from "./number";
import city from "./city";
import msg from "./msg";

const reducers = combineReducers({
    count:count,
    newCount:count,
    number,
    city,
    msg,
    
})


export default reducers;


// // 定义初始化state 
// const defaultState = {
//     count:1803,
//     number:60,
//     city:"大武汉",
//     msg:"1803 daydayup"
// }

// export default (state=defaultState,action)=>{
   
//     console.log(action);
//     switch(action.type){

//         case "ADD":
       
//         state.count +=action.payload;
//         console.log(state.count);
//         return Object.assign({},state,{count:state.count}); // 全新的对象  
//         break;

//         case INCREMENT:
//         return {...state,...{count:++state.count}}
//         break;

//         case DECREMENT:
//         return {...state,...{count:state.count-action.count}}
//         break;

//         case CHANGECITY:
//         return {...state,...{city:action.city}}
//         break;


//         case CHANGEMSG:
//         return {...state,...{msg:action.msg}}
//         break;

//         case CHANGEMSGBYINP:
//         return {...state,...{msg:action.msg}}
//         break;

//         default:
//         return state;
//         break;

//     }
// }