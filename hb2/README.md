# 省标院后台管理

省标院后台管理项目基于antd pro框架，本文未列出的问题，可到antd pro官网及umi.js官网查找

1. antd pro官网  https://pro.ant.design/index-cn
1. umi.js官网 https://umijs.org/


## 换肤
换肤功能，可在运行时动态换肤，无需刷新页面。

和换肤相关的有以下文件
+ `public/theme.less`——主题样式文件及默认颜色值
+ `src/theme.js`——配置各个主题的颜色值


### 创建模块时，如何匹配换肤？

让换肤功能代码重复量最少的原理有两种：
1. 使用less的modifyVars函数，动态切换less变量
2. 切换皮肤时，修改根元素的样式名。则各子元素使用根元素样式名限定。

框架对两种原理均做了支持，下面以按钮为例，对两种原理下的换肤功能做详细的步骤分解。

+ #### modifyVars原理的步骤

**如果项目设计元素明确，各模块的样式统一，建议使用此方法**

1. 新建文件 `src/pages/ThemeTest.js`，代码如下
  ```
  import React, { Component } from 'react';

  class ThemeTest extends Component {
    render() {
      return (
        <div>
          <button type="button" className="themeTestButton">button</button>
        </div>
      );
    }
  }

  export default ThemeTest;
```
2. 在`config/router.config.js`中添加上述页面的路由
```
{
  path: '/ThemeTest',
  name: 'themeTest',
  component: './ThemeTest',
},
```

此时，点击菜单中的themeTest，会显示一个按钮，下面来给按钮添加样式

3. 打开`public/theme.less`，添加代码
```
@testButtonColor: #ff0000;
.themeTestButton {
  color: @testButtonColor;
}
```
刷新页面，会发现按钮文字变成了红色

4. 打开`src/theme.js`, 在blackTheme对应的值中，添加一项`'testButtonColor': '#00ff00'`。刷新页面，并在黑色和白色中切换主题，按钮文字颜色会对应变化。

**同理，如果有多种皮肤，则在多种皮肤中添加testButtonColor的值即可**


+ #### 方法二：在各个模块的LESS中单独设置

**如果项目设计元素不明确、各模块之间样式不一定相同、或仅在某个模块使用的样式，建议使用此方法。**

例子同上，第1，2步不变，从第3步开始如下操作
3. 新建`src/pages/ThemeTest.less'，代码如下
```
:global(.whiteTheme) {
  .themeTestButton {
    color: #ff0000;
  }
}

:global(.blackTheme) {
  .themeTestButton {
    color: #00ff00;
  }
}
```

4. 在`src/pages/ThemeTest.js`顶部引入less文件
```
import styles from './ThemeTest.less';
```
并把按钮的className修改为styles.themeTestButton
```
<button type="button" className={styles.themeTestButton}>button</button>
```

此时，切换在白色和黑色皮肤切换，会发现按钮文字颜色跟随变化。同样，如果多种皮肤，则在多皮肤中设置.themeTestButton样式即可