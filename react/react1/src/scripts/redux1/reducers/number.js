import { CHANGENUMBER } from "../actions";


export default (state=600,action)=>{

    switch(action.type){
        case CHANGENUMBER:
        state-=1;
        return state;
        break;
        

        default:
        return state;
        break;
    }
}