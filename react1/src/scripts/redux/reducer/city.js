


import {ADD} from '../action'

export default (state="湖北武汉",action)=>{


        switch(action.type){

            case ADD:
            return action.city;
            break;

            default :
            return state;
            break;
        }
}