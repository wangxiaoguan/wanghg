import { CHANGECITY } from "../actions";



export default (state="Big wuHan",action)=>{
    switch(action.type){

        case CHANGECITY:
        return action.city;
        break;

        default:
        return state;
        break;
    }
}