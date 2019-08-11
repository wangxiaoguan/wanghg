

// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
//  mutation 非常类似于事件
// 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)

// 接受 state 作为第一个参数

   // 对象 是  可变对象  
// 修改可变的对象 vue 视图系统无法检测  
// state.obj = { ...state.obj, newProp: 123 }
export default {
    add(){

    },
    increment(state){
        console.log(state);
        console.log("mutation-type");
        state.number++;
    },
    decrement(state){
        state.number--;
    },
    countadd(state,preload){
        state.number+=preload;
    },
    changeCity(state,city){
        state.city = city;
    },
    changeMsg(state,{msg}){
     
        state.msg = msg;  
        // staet.msg = {...state.msg,msg:msg}
    },
    changeUsername(state,{username}){
        state.obj = {...state.obj,username:username};// 对象  
    },
    changeData(state,data){
        state.data = data;
    },
    getmv(state,mv){
        state.mv = mv;
    },
    getUsername(state,username){
      
        state.username = username;
        console.log("xxxusernamee")
        console.log(state);
    },
    updatePhone(state,phone){
        state.phone = phone;
        console.log(state);
    }
}