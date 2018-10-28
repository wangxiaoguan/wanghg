



import {NUMBER} from '../action'

export default (state=2018,action)=>{

        switch(action.type){

            case NUMBER:
            state+=action.num
            return state;
            break;

            default:
            return state;
            break;
        }
}