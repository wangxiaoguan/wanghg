react  FACEBOOK   框架

react 必备 (dva + umi + react-create-app)
(react + react-router + flux + redux + react-redux + redux-form + redux-thunk + redux-promise + redux-sagas + antd + andt-mobile + es6 )

虚拟DOM  组件化开发  原生JS的框架   (ES6+原生javascript)

优点
1.  极速的渲染能力  虚拟DOM virtual DOM
2.  高度组件化  组件之间高度复用
3.  经历大量的测试  有一定的稳定性


虚拟DOM virtual DOM 
虚拟DOM 就是在 真实DOM的基础上建立的一个抽象层   

我们对数据和状态所做的任何改动，都会被自动且高效的同步到虚拟DOM，最后再批量同步到DOM中

react 遵循MIT 协议   开源框架 

diff 算法  
React会在内存中维护一个虚拟DOM树，当我们对这个树进行读或写的时候，实际上是对虚拟DOM进行的。当数据变化时，然后React会自动更新虚拟DOM，然后拿新的虚拟DOM和旧的虚拟DOM进行对比，找到有变更的部分，得出一个Patch，然后将这个Patch放到一个队列里，最终批量更新这些Patch到DOM中。


react 和  vue  对比 
相同
a. react 和 vue  都有组件化思想  都有虚拟DOM
b. react 和 vue  都提供了组件化视图 (compoisible)  响应式数据概念
c. react 和 vue 都有核心渲染组件的API (Vue.component/React.createClass)  都有  路由的概念  相同的路由机制   完整对应的组件生命周期     各自成熟的生态圈


不同
a.  react 通过 javascript xml 来编写组件  vue 通过 template 模板来嵌套组件
b.  vue 比 react 有更快的渲染速度  react比较vue相对复杂的框架 react 适用用业务逻辑超级变态的项目 
c.  数据传递方式不一样  生命周期不一样 渲染模板不一样   {react}  {{vue}}



特点
1.虚拟dom (开发时候不需要在页面中写任何dom元素) victure dom

2.jsx语法(写页面时候使用javascript xml格式的语法)

3.组件化开发(react最核心的思想是将页面中任何一个区域或者元素都
看成是一个组件 Component)

4.单向数据流(组件和后端之间的数据是单向的，从后端流动到react组件中)
5.组件生命周期(任何一个组件在dom中都具有一个完整的声明周期，组件初始化的时候开始，组件被移除的时候消失，从而保证性能的优越) 

