

1. redux 架构  数据管理  state   this.setState()

React 只是 DOM 的一个抽象层，并不是 Web 应用的完整解决方案

代码结构
组件之间的通信



# 2. redux 不适应场景 

用户的使用方式非常简单
用户之间没有协作
不需要与服务器大量交互，也没有使用 WebSocket
视图层（View）只从单一来源获取数据


# vredux  适应场景  多交互、多数据源  
用户的使用方式复杂
不同身份的用户有不同的使用方式（比如普通用户和管理员）
多个用户之间可以协作
与服务器大量交互，或者使用了WebSocket
View要从多个来源获取数据

# 从组件角度看，如果你的应用有以下场景，可以考虑使用 Redux
某个组件的状态，需要共享
某个状态需要在任何地方都可以拿到
一个组件需要改变全局状态
一个组件需要改变另一个组件的状态


3. Redux 的设计思想很简单   

（1）Web 应用是一个状态机，视图与状态是一一对应的。
（2）所有的状态，保存在一个对象里面。



4. 基本的概念 和 API

# 1. Store 
Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。
Redux 提供createStore这个函数，用来生成 Store。
const store = createStore (fn)    fn===reducers


# 2. state 状态
Store对象包含所有数据。如果想得到某个时点的数据，就要对 Store 生成快照。这种时点的数据集合，就叫做 State。
# state = store.getState()

Redux 规定， 一个 State 对应一个 View。只要 State 相同，View 就相同。你知道 State，就知道 View 是什么样，反之亦然。

3. action

State 的变化，会导致 View 的变化,用户接触不到 State，只能接触到 View,State 的变化必须是 View 导致的.

Action 就是 View 发出的通知，表示 State 应该要发生变化

# Action 是一个对象。其中的type属性是必须的，表示 Action 的名称  , 其他属性就是一个参数  默认只能传一个参数 如果多个参数 传 对象 

改变 State 的唯一办法，就是使用 Action。它会运送数据到 Store。

4. Action Creator 
View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦。可以定义一个函数来生成 Action，这个函数就叫 Action Creator


# 5. store.dispatch()  发出action 
store.dispatch()是 View 发出 Action 的唯一方法。

store.dispatch接受一个 Action 对象作为参数，将它发送出去。




6. Reducer 计算       reduce()  map() forEach() filter() some() every() 
Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer

# Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。    2个参数 action state 

reducers 设置初始化的state 


Store 需要知道 Reducer 函数，做法就是在生成 Store 的时候，将 Reducer 传入createStore方法

reateStore接受 Reducer 作为参数，生成一个新的 Store。以后每当store.dispatch发送过来一个新的 Action，就会自动调用 Reducer，得到新的 State

7. 纯函数
它是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出。

遵守以下一些约束:
不得改写参数
不能调用系统 I/O 的API
不能调用Date.now()或者Math.random()等不纯的方法，因为每次会得到不一样的结果

最好把 State 对象设成只读。你没法改变它，要得到新的 State，唯一办法就是生成一个新对象。这样的好处是，任何时候，与某个 View 对应的 State 总是一个不变的对象。

 State 是一个对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
}
 State 是一个数组
function reducer(state, action) {
  return [...state, newItem];
}


8. store.subscribe() 
Store 允许使用store.subscribe方法设置监听函数，一旦 State 发生变化，就自动执行这个函数

store.subscribe方法返回一个函数，调用这个函数就可以解除监听。
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

unsubscribe();


9. Store 的实现

store.getState()   获取state
store.dispatch()   发出action
store.subscribe()  监听组件的重新渲染


 
五  redux 的思想   单向数据流 

1. 用户访问 view 触发click事件 ，发出action dispatch
2. store 接收action 自动的去通知reducers 
3. reducers 接收 action 和 oldState ,进行相关计算 返回新的state
4. state 变化会触发 store 的监听函数，store 就会去改变 组件 重新渲染组件     store已经实现监听 store.subscribe 监听 state 变化                      



六 异步数据获取 
Action 发出以后，Reducer 立即算出 State，这叫做同步；
Action 发出以后，过一段时间再执行 Reducer，这就是异步


中间件  
中间件就是一个函数
store.dispatch方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。

applyMiddlewares
它是 Redux 的原生方法，作用是将所有中间件组成一个数组，依次执行
applyMiddlewares 可以 把 store  的方法注入到 中间件内部 