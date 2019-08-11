

// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
//  mutation 非常类似于事件
// 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)

// 接受 state 作为第一个参数

   // 对象 是  可变对象  
// 修改可变的对象 vue 视图系统无法检测  
// state.obj = { ...state.obj, newProp: 123 }
export default {




    getgoods(state,item){     state.lists = item;   },

  
    getnews(state,item){     state.news = item;   },


    getdetail(state,item){ state.detail = item[0];console.log(state.detail) },
    

    getdetail2(state,item){ state.detail2 = item[0];console.log(state.detail2) },


    getculture(state,item){    state.cultures = item;console.log(item)   },


    gettea(state,item){    state.teas = item;console.log(item);  },

    search(state,item){    state.teas = item;console.log(item);  },
}