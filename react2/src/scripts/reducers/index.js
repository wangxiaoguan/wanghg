

const defaultState = {
    mv:[],
    title:"武汉1803",
    data:"你们已经精通react了吗"
}

export default (state=defaultState,action)=>{
    switch(action.type){

        case "changeTitle":
        return {...state,...{title:action.title}};
        break;

        case "changeData_succ":
        return {...state,...{data:action.data}};
        break;

        case "getmovie":
        return {...state,...{mv:action.data}}
        break;

        default:
        return state;
        break;
    }
}