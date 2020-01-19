# angular4.0 app 

# 下载angular4.0 的 脚手架  @angular/cli
npm i @angular/cli -g
cnpm i @angular/cli@1.5.2 -g
cnpm i @angular/cli@1.2.6 -g

# 检验是否安装成功
ng -v

# 创建angular 项目
ng new my-app
ng new my-route --routing

# 启动项目
ng serve
ng serve --open
ng serve --open --port 3000;    默认4200
npm start


# 创建组件
ng g component home
ng g service   login


## angular4.0 授课内容

# 1.  搭建angular4.0 环境
    编写2个angular 项目
    打包上线

    分析项目目录文件 

# 2. 路由 SPA 路由导航 
   路由基础
   路由导航钩子
   路由传递参数

# 3. 服务 difficult  依赖注入   封装 

# 4. angular 组件化   组件之间的通信
输入输出的通信 
中间人模式的通信 
组件的生命周期

# 5. 表单处理 
模板表单
响应式表单 
表单检验

# 6. 服务器通讯 
封装HTTP 服务  
基于typeScript创建 web服务器

# 7. 部署上线
ng build --prod 


##angular 入门 

angular 
angular 4.0 


angularJS    ======== angular1.0       2012年开源  

angular1.5/1.6   =====>  angular2.0      typescript编写 组件化概念 

angular3.0   =====>  angular4.0      angular5.0   angular6.0 

node  express bootstrap 
vue   elemnt-ui mint-ui
react antd antd-mobile
angular ionic2
angularJs ionic1

## angularJs  angular1.0 的特点  
1. 模块功能丰富强大  template/templateUrl 配置路由ngRoute uiRoute 实现单页面应用 指令化  ng-app ng-src ng-click ng-repeat 插值表达式  {{}}  大大减少代码量   
2. 比较完整的mvc框架  model-view-controller  包含模板 路由 服务 依赖注入 过滤器  事件 包含基本的框架要素 
3. 依赖注入  Java概念  可测试 进行单元测试  

4. 作用域概念  $scope  angular1.0 控制器 controller 属于当前控制器内所有的数据属性方法的对象的集合 $scope.msg = "hello"  $scope.go = function(){}   ng-click= "go()"

angular4.0 继承大部分angular1.0 特点  
插值表达式  依赖注入  组件   修改部分指令   *ngFor 


## angularJs angular1.0 缺点

1. 数据双向绑定  ng-model 脏检查 dirty checking    效率低下  
2. 路由问题   ngRoute  自带路由模块  功能少 嵌套路由无法实现  uiRoute  强大
3. 无法使用高级的ES6语法  gulp  class  装饰器  @connect 
4. 学习程度高  模板 控制器 路由 过滤器  服务  测试 指令  ng-show/ng-if   UI框架 ionic 


## angular4.0 特点
1. 全新的命令行工具  @angular/cli  ng 功能强大  创建项目骨架  创建组件  创建项目所需的相关文件 测试打包上线

2. 服务器端渲染  vue nuxt  SEO优化 搜索引擎优化  大大减少的渲染时间  

3. 移动和桌面应用的兼容   不仅可以实现web应用  开发移动App 还可以开发桌面应用  客户端


## anguar4.0 vue react   微信小程序

核心 
angular4.0  指令化  组件化  ng g component product 
react  虚拟DOM
vue    丰富全面的简单API  
微信小程序   无需安装,使用成本低 



## angular4.0 和 react 对比
1. 性能  渲染速度  虚拟DOM    props 和 state  setState  强大的diff 算法  比较更新异同  更新的记录依次存入队列  批量更新所有的虚拟DOM

2. FLUX 架构  + redux 

3. react 实现服务器端渲染  

4. react MVC 框架  react ===> V  view  配套其他第三方库学习   react+react-router-dom+react-redux+react-saga/react-thunk+ antd-mobile     


## angular4.0 和 Vue 对比  
1. 指令化  组件化  

1. 简单  繁琐细致的中文API 健全  易于上手    中文生态社区   angular/服务  依赖注入  

2. 灵活  vue-cli  脚手架   允许自己按照需求来构建项目 不限制你如何开发     

3. 个人主导  vue   angular google 主导  团队主导  社区文化和生态环境不同

4. 只关注 WEB  angular 实现更高层次的抽象  不仅仅可以开发Web应用  开发原生APP 桌面应用 客户端  weex 
react  react-native
vue    weex


# angular 项目 文件目录说明 
e2e 端到端的测试 
src 项目开发工作区
.angular-cli.json  angular 项目的配置文件 

karma.conf.js  自动化单元测试文件
protractor.conf.js  production  简单的端到端测试的配置文件


tsconfig.json typescript 编译器的配置文件  IDE 配置
tslint.json  代码美化 保存统一风格的代码

src
main.ts 主入口文件  
polyfills.ts  低版本浏览器的兼容   不同的浏览器对 Web 标准的支持程度也不同
test.ts  测试文件 
spec 单元测试

environment  环境配置  打包 需要 
assets  项目静态文件  js  css png 
app.module.ts  主模块文件 
