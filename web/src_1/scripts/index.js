
import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";
import {connect} from 'react-redux'
import moment from 'moment';
import $ from 'jquery'
import { Router,Link,HashRouter,Route,Switch} from "react-router-dom";
import { Icon,Button,Menu,DatePicker,TimePicker,LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
const SubMenu = Menu.SubMenu;
const dateFormat = 'YYYY-MM-DD';
import store from './redux/store'

// import Root from './root'

import App1 from './app/App1'
import App2 from './app/App2'
import App3 from './app/App3'
import App4 from './app/App4'
import App5 from './app/App5'
import App6 from './app/App6'
import App7 from './app/App7'
import App8 from './app/App8'
import App9 from './app/App9'
import App10 from './app/App10'
import App11 from './app/App11'
import App12 from './app/App12'
import App13 from './app/App13'
import App14 from './app/App14'
import App15 from './app/App15'
import App16 from './app/App16'
import App17 from './app/App17'
import App18 from './app/App18'
import App19 from './app/App19'
import App20 from './app/App20'

import Css0 from './css/Css0'
import Css1 from './css/Css1'
import Css2 from './css/Css2'
import Css3 from './css/Css3'
import Css4 from './css/Css4'
// import Css5 from './css/Css5'
import Css6 from './css/Css6'
import Css7 from './css/Css7'
// import Css8 from './css/Css8'
// import Css9 from './css/Css9'
// import Css10 from './css/Css10'
// import Css11 from './css/Css11'
import Css12 from './css/Css12'
// import Css13 from './css/Css13'
// import Css14 from './css/Css14'
// import Css15 from './css/Css15'
// import Css16 from './css/Css16'
// import Css17 from './css/Css17'
import Css18 from './css/Css18'
import Css19 from './css/Css19'
// import Css20 from './css/Css20'
// import Css21 from './css/Css21'
// import Css22 from './css/Css22'
import Css23 from './css/Css23'
// import Css24 from './css/Css24'
// import Css25 from './css/Css25'
import Css26 from './css/Css26'
import Css27 from './css/Css27'
// import Css28 from './css/Css28'
import Css29 from './css/Css29'
// import Css30 from './css/Css30'

// import Antd from './antd/index'
// import Data1 from './data/data1'
// import Data2 from './data/data2'
// import Data3 from './data/data3'
// import Data4 from './data/data4'
// import Data5 from './data/data5'
// import Data6 from './data/data6'
// import Data7 from './data/data7'
// import Data8 from './data/data8'
// import Data9 from './data/data9'
// import Data10 from './data/data10'
// import Data11 from './data/data11'
// import Data12 from './data/data12'
// import Data13 from './data/data13'
// import Data14 from './data/data14'
// import Data15 from './data/data15'
// import Data16 from './data/data16'


import Array1 from './array/array1'
import Array2 from './array/array2'
import Array3 from './array/array3'
import Array4 from './array/array4'
import Array5 from './array/array5'
import Array6 from './array/array6'
import Array7 from './array/array7'
import Array8 from './array/array8'
import Array9 from './array/array9'
import Array10 from './array/array10'
import Array11 from './array/array11'
import Array12 from './array/array12'
import Array13 from './array/array13'
import Array14 from './array/array14'
import Array15 from './array/array15'
import Array16 from './array/array16'
import Array17 from './array/array17'
import Array18 from './array/array18'
import Array19 from './array/array19'
import Array21 from './array/array21'
import Array20 from './array/array20'
import Array22 from './array/array22'
import Array23 from './array/array23'


import Home1 from './home/home1'
// import Home2 from './home/home2'
import Home3 from './home/home3'
import Home4 from './home/home4'
import Home5 from './home/home5'
import Home6 from './home/home6'
import Home7 from './home/home7'
import Home8 from './home/home8'
import Home9 from './home/home9'
import Home10 from './home/home10'
import Home11 from './home/home11'
import Home12 from './home/home12'
import Home13 from './home/home13'
import Home14 from './home/home14'
// import Home15 from './home/home15'
// import Home16 from './home/home16'
// import Home17 from './home/home17'
// import Home18 from './home/home18'

import React1 from './react/react1'
import React2 from './react/react2'
import React3 from './react/react3'
import React4 from './react/react4'
import React5 from './react/react5'
import React6 from './react/react6'
import React7 from './react/react7'
import React8 from './react/react8'
import React9 from './react/react9'
import React10 from './react/react10'
import React11 from './react/react11'
import React12 from './react/react12'

class Home extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='top'>
                <div id='leftMenu'>
                    <div style={{ width: '200px' }}>
                        <Menu mode="inline" theme="dark">
                            <SubMenu key="sub1" title={<span><Icon type="html5" /><span>HTML</span></span>}>
                                <Menu.Item key="101"><Link to="/app1"><p>HTML基础</p></Link></Menu.Item>
                                <Menu.Item key="102"><Link to="/app2"><p>CSS基础</p></Link></Menu.Item>
                                <Menu.Item key="103"><Link to="/app3"><p>CSS属性</p></Link></Menu.Item>
                                <Menu.Item key="104"><Link to="/app4"><p>CSS概念</p></Link></Menu.Item>
                                <Menu.Item key="105"><Link to="/app5"><p>锚点</p></Link></Menu.Item>
                                <Menu.Item key="106"><Link to="/app6"><p>盒模型</p></Link></Menu.Item>
                                <Menu.Item key="107"><Link to="/app7"><p>HTML语法</p></Link></Menu.Item>
                                <Menu.Item key="108"><Link to="/app8"><p>execCommand</p></Link></Menu.Item>
                                <Menu.Item key="109"><Link to="/app9"><p>Flex</p></Link></Menu.Item>
                                <Menu.Item key="110"><Link to="/app10"><p>Http</p></Link></Menu.Item>
                                <Menu.Item key="111"><Link to="/app11"><p>Form</p></Link></Menu.Item>
                                {/* <Menu.Item key="112"><Link to="/app12"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="113"><Link to="/app13"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="114"><Link to="/app14"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="115"><Link to="/app15"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="116"><Link to="/app16"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="117"><Link to="/app17"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="118"><Link to="/app18"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="119"><Link to="/app19"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="120"><Link to="/app20"><p>待定</p></Link></Menu.Item> */}
                            </SubMenu>
                            <SubMenu key="sub2" title={<span><Icon type="code-sandbox" /><span>CSS</span></span>}>
                                <Menu.Item key="200"><Link to="/css0"><p>CSS</p></Link></Menu.Item>
                                <Menu.Item key="201"><Link to="/css1"><p>2D</p></Link></Menu.Item>
                                <Menu.Item key="202"><Link to="/css2"><p>3D</p></Link></Menu.Item>
                                <Menu.Item key="203"><Link to="/css3"><p>Map</p></Link></Menu.Item>
                                <Menu.Item key="204"><Link to="/css4"><p>cursor</p></Link></Menu.Item>
                                {/* <Menu.Item key="205"><Link to="/css5"><p>rotate</p></Link></Menu.Item> */}
                                <Menu.Item key="206"><Link to="/css6"><p>div</p></Link></Menu.Item>
                                <Menu.Item key="207"><Link to="/css7"><p>keyframes</p></Link></Menu.Item>  
                                {/* <Menu.Item key="208"><Link to="/css8"><p>Carousel</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="209"><Link to="/css9"><p></p></Link></Menu.Item> */}
                                {/* <Menu.Item key="210"><Link to="/css10"><p>Screenshot</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="211"><Link to="/css11"><p>Barrage</p></Link></Menu.Item> */}
                                <Menu.Item key="212"><Link to="/css12"><p>JSONP</p></Link></Menu.Item>
                                {/* <Menu.Item key="213"><Link to="/css13"><p>3D动画</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="214"><Link to="/css14"><p>ES6</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="215"><Link to="/css15"><p></p></Link></Menu.Item> */}
                                {/* <Menu.Item key="216"><Link to="/css16"><p>Move</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="217"><Link to="/css17"><p>size</p></Link></Menu.Item> */}
                                <Menu.Item key="218"><Link to="/css18"><p>Center</p></Link></Menu.Item>
                                <Menu.Item key="219"><Link to="/css19"><p>Flex</p></Link></Menu.Item>
                                {/* <Menu.Item key="220"><Link to="/css20"><p>Attachment</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="221"><Link to="/css21"><p>Origin</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="222"><Link to="/css22"><p>Form</p></Link></Menu.Item> */}
                                <Menu.Item key="223"><Link to="/css23"><p>Table</p></Link></Menu.Item>
                                {/* <Menu.Item key="224"><Link to="/css24"><p>QRCode</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="225"><Link to="/css25"><p>scroll</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="226"><Link to="/css26"><p>wait...</p></Link></Menu.Item> */}
                                <Menu.Item key="227"><Link to="/css27"><p>gradient</p></Link></Menu.Item>
                                {/* <Menu.Item key="228"><Link to="/css28"><p></p></Link></Menu.Item> */}
                                <Menu.Item key="229"><Link to="/css29"><p>Shadow</p></Link></Menu.Item>
                                {/* <Menu.Item key="230"><Link to="/css30"><p>wait...</p></Link></Menu.Item> */}
                            </SubMenu>
                            <SubMenu key="sub5" title={<span><Icon type="desktop" /><span>JavaScript</span></span>}>
                                <Menu.Item key="501"><Link to="/array1"><p>String</p></Link></Menu.Item>
                                <Menu.Item key="502"><Link to="/array2"><p>Number</p></Link></Menu.Item>
                                <Menu.Item key="503"><Link to="/array3"><p>Array</p></Link></Menu.Item>
                                <Menu.Item key="504"><Link to="/array4"><p>RegExp</p></Link></Menu.Item>
                                <Menu.Item key="505"><Link to="/array5"><p>Object</p></Link></Menu.Item>
                                <Menu.Item key="506"><Link to="/array6"><p>Client</p></Link></Menu.Item>
                                <Menu.Item key="507"><Link to="/array7"><p>Dom</p></Link></Menu.Item>
                                <Menu.Item key="508"><Link to="/array8"><p>Cookie</p></Link></Menu.Item>
                                <Menu.Item key="509"><Link to="/array9"><p>Mouse</p></Link></Menu.Item>
                                <Menu.Item key="510"><Link to="/array10"><p>Date</p></Link></Menu.Item>
                                <Menu.Item key="511"><Link to="/array11"><p>Mysql</p></Link></Menu.Item>
                                <Menu.Item key="512"><Link to="/array12"><p>Input</p></Link></Menu.Item>
                                <Menu.Item key="513"><Link to="/array13"><p>XML</p></Link></Menu.Item>
                                <Menu.Item key="514"><Link to="/array14"><p>Es6</p></Link></Menu.Item>
                                <Menu.Item key="515"><Link to="/array15"><p>Js</p></Link></Menu.Item>
                                <Menu.Item key="516"><Link to="/array16"><p>Promise</p></Link></Menu.Item>
                                <Menu.Item key="517"><Link to="/array17"><p>Async</p></Link></Menu.Item>
                                <Menu.Item key="518"><Link to="/array18"><p>Generator</p></Link></Menu.Item>
                                <Menu.Item key="519"><Link to="/array19"><p>this</p></Link></Menu.Item>
                                <Menu.Item key="520"><Link to="/array20"><p>获取光标的坐标</p></Link></Menu.Item>
                                <Menu.Item key="521"><Link to="/array21"><p>颜色渐变</p></Link></Menu.Item>
                                <Menu.Item key="522"><Link to="/array22"><p>获取剪切板内容</p></Link></Menu.Item>
                                <Menu.Item key="523"><Link to="/array23"><p>请求</p></Link></Menu.Item>
                                {/* <Menu.Item key="524"><Link to="/array24"><p>XML</p></Link></Menu.Item> */}
                            </SubMenu>
                            {/* <SubMenu key="sub3" title={<span><Icon type="inbox" /><span>Antd</span></span>}> */}
                                {/* <Menu.Item key="300"><Link to="/antd1"><p>Antd</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="301"><Link to="/data1"><p>瀑布流</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="302"><Link to="/data2"><p>time1</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="303"><Link to="/data3"><p>time2</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="304"><Link to="/data4"><p>position</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="305"><Link to="/data5"><p>copy</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="306"><Link to="/data6"><p>animation</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="307"><Link to="/data7"><p>discolour</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="308"><Link to="/data8"><p>闭包</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="309"><Link to="/data9"><p>ClipBoard</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="310"><Link to="/data10"><p>radix</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="311"><Link to="/data11"><p>Table</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="312"><Link to="/data12"><p>Editor</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="313"><Link to="/data13"><p>Focus</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="314"><Link to="/data14"><p>MouseCss</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="315"><Link to="/data15"><p>SendCode</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="316"><Link to="/data16"><p>Antd</p></Link></Menu.Item> */}
                            {/* </SubMenu> */}
                            {/* <SubMenu key="sub4" title={<span><Icon type="radar-chart" /><span>JS基础</span></span>}>
                                <Menu.Item key="401"><Link to="/gif1"><p>函数</p></Link></Menu.Item>
                                <Menu.Item key="402"><Link to="/gif2"><p>变量</p></Link></Menu.Item>
                                <Menu.Item key="403"><Link to="/gif3"><p>字符串</p></Link></Menu.Item>
                                <Menu.Item key="404"><Link to="/gif4"><p>对象操作</p></Link></Menu.Item>
                                <Menu.Item key="405"><Link to="/gif5"><p>对象类型</p></Link></Menu.Item>
                                <Menu.Item key="406"><Link to="/gif6"><p>循环</p></Link></Menu.Item>
                                <Menu.Item key="407"><Link to="/gif7"><p>数据类型</p></Link></Menu.Item>
                                <Menu.Item key="408"><Link to="/gif8"><p>数组</p></Link></Menu.Item>
                                <Menu.Item key="409"><Link to="/gif9"><p>正则表达式</p></Link></Menu.Item>
                                <Menu.Item key="410"><Link to="/gif10"><p>运算符</p></Link></Menu.Item>
                            </SubMenu> */}
                            <SubMenu key="sub6" title={<span><Icon type="book" /><span>Node</span></span>}>
                                <Menu.Item key="601"><Link to="/home1"><p>fs</p></Link></Menu.Item>
                                {/* <Menu.Item key="602"><Link to="/home2"><p>古诗词</p></Link></Menu.Item> */}
                                <Menu.Item key="603"><Link to="/home3"><p>path</p></Link></Menu.Item>
                                <Menu.Item key="604"><Link to="/home4"><p>MongoDB</p></Link></Menu.Item>
                                <Menu.Item key="605"><Link to="/home5"><p>php读写txt文件</p></Link></Menu.Item>
                                <Menu.Item key="606"><Link to="/home6"><p>php上传文件</p></Link></Menu.Item>
                                <Menu.Item key="607"><Link to="/home7"><p>前端工具</p></Link></Menu.Item>
                                <Menu.Item key="608"><Link to="/home8"><p>前端小知识</p></Link></Menu.Item>
                                <Menu.Item key="609"><Link to="/home9"><p>mainWindow</p></Link></Menu.Item>
                                <Menu.Item key="610"><Link to="/home10"><p>Notification</p></Link></Menu.Item>
                                <Menu.Item key="611"><Link to="/home11"><p>jQuery</p></Link></Menu.Item>
                                <Menu.Item key="612"><Link to="/home12"><p>deepClone</p></Link></Menu.Item>
                                <Menu.Item key="613"><Link to="/home13"><p>export</p></Link></Menu.Item>
                                <Menu.Item key="614"><Link to="/home14"><p>webpack</p></Link></Menu.Item>
                                {/* <Menu.Item key="615"><Link to="/home15"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="616"><Link to="/home16"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="617"><Link to="/home17"><p>待定</p></Link></Menu.Item> */}
                                {/* <Menu.Item key="618"><Link to="/home18"><p>待定</p></Link></Menu.Item> */}
                            </SubMenu>
                            <SubMenu key="sub7" title={<span><Icon type="codepen" /><span>React</span></span>}>
                                <Menu.Item key="701"><Link to="/react1"><p>react</p></Link></Menu.Item>
                                <Menu.Item key="702"><Link to="/react2"><p>Redux</p></Link></Menu.Item>
                                <Menu.Item key="703"><Link to="/react3"><p>Props</p></Link></Menu.Item>
                                <Menu.Item key="704"><Link to="/react4"><p>Redux2</p></Link></Menu.Item>
                                <Menu.Item key="705"><Link to="/react5"><p>other</p></Link></Menu.Item>
                                <Menu.Item key="706"><Link to="/react6"><p>QRCode</p></Link></Menu.Item>
                                <Menu.Item key="707"><Link to="/react7"><p>Image</p></Link></Menu.Item>
                                <Menu.Item key="708"><Link to="/react8"><p>Color</p></Link></Menu.Item>
                                <Menu.Item key="709"><Link to="/react9"><p>Echarts</p></Link></Menu.Item>
                                <Menu.Item key="710"><Link to="/react10"><p>server</p></Link></Menu.Item>
                                <Menu.Item key="711"><Link to="/react11"><p>BraftEditor</p></Link></Menu.Item>
                                <Menu.Item key="712"><Link to="/react12"><p>wangeditor</p></Link></Menu.Item>
                                
                            </SubMenu>
                        </Menu>
                    </div>
                </div>
                <div id='rightContent'>
                    <Switch>
                        <Route exact path="/" component={App1}/>
                        <Route exact path="/app1" component={App1}/>
                        <Route exact path="/app2" component={App2}/>
                        <Route exact path="/app3" component={App3}/>
                        <Route exact path="/app4" component={App4}/>
                        <Route exact path="/app5" component={App5}/>
                        <Route exact path="/app6" component={App6}/>
                        <Route exact path="/app7" component={App7}/>
                        <Route exact path="/app8" component={App8}/>
                        <Route exact path="/app9" component={App9}/>
                        <Route exact path="/app10" component={App10}/>
                        <Route exact path="/app11" component={App11}/>
                        {/* <Route exact path="/app12" component={App12}/> */}
                        {/* <Route exact path="/app13" component={App13}/> */}
                        {/* <Route exact path="/app14" component={App14}/> */}
                        {/* <Route exact path="/app15" component={App15}/> */}
                        {/* <Route exact path="/app16" component={App16}/> */}
                        {/* <Route exact path="/app17" component={App17}/> */}
                        {/* <Route exact path="/app18" component={App18}/> */}
                        {/* <Route exact path="/app19" component={App19}/> */}
                        {/* <Route exact path="/app20" component={App20}/> */}

                        <Route exact path="/css0" component={Css0}/>
                        <Route exact path="/css1" component={Css1}/>
                        <Route exact path="/css2" component={Css2}/>
                        <Route exact path="/css3" component={Css3}/>
                        <Route exact path="/css4" component={Css4}/>
                        {/* <Route exact path="/css5" component={Css5}/> */}
                        <Route exact path="/css6" component={Css6}/>
                        <Route exact path="/css7" component={Css7}/>
                        {/* <Route exact path="/css8" component={Css8}/> */}
                        {/* <Route exact path="/css9" component={Css9}/> */}
                        {/* <Route exact path="/css10" component={Css10}/> */}
                        {/* <Route exact path="/css11" component={Css11}/> */}
                        <Route exact path="/css12" component={Css12}/>
                        {/* <Route exact path="/css13" component={Css13}/> */}
                        {/* <Route exact path="/css14" component={Css14}/> */}
                        {/* <Route exact path="/css15" component={Css15}/> */}
                        {/* <Route exact path="/css16" component={Css16}/> */}
                        {/* <Route exact path="/css17" component={Css17}/> */}
                        <Route exact path="/css18" component={Css18}/>
                        <Route exact path="/css19" component={Css19}/>
                        {/* <Route exact path="/css20" component={Css20}/> */}
                        {/* <Route exact path="/css21" component={Css21}/> */}
                        {/* <Route exact path="/css22" component={Css22}/> */}
                        <Route exact path="/css23" component={Css23}/>
                        {/* <Route exact path="/css24" component={Css24}/> */}
                        {/* <Route exact path="/css25" component={Css25}/> */}
                        {/* <Route exact path="/css26" component={Css26}/> */}
                        <Route exact path="/css27" component={Css27}/>
                        {/* <Route exact path="/css28" component={Css28}/> */}
                        <Route exact path="/css29" component={Css29}/>
                        {/* <Route exact path="/css30" component={Css30}/> */}


                        {/* <Route exact path="/antd1" component={Antd}/> */}
                        {/* <Route exact path="/data1" component={Data1}/> */}
                        {/* <Route exact path="/data2" component={Data2}/> */}
                        {/* <Route exact path="/data3" component={Data3}/> */}
                        {/* <Route exact path="/data4" component={Data4}/> */}
                        {/* <Route exact path="/data5" component={Data5}/> */}
                        {/* <Route exact path="/data6" component={Data6}/> */}
                        {/* <Route exact path="/data7" component={Data7}/> */}
                        {/* <Route exact path="/data8" component={Data8}/> */}
                        {/* <Route exact path="/data9" component={Data9}/> */}
                        {/* <Route exact path="/data10" component={Data10}/> */}
                        {/* <Route exact path="/data11" component={Data11}/> */}
                        {/* <Route exact path="/data12" component={Data12}/> */}
                        {/* <Route exact path="/data13" component={Data13}/> */}
                        {/* <Route exact path="/data14" component={Data14}/> */}
                        {/* <Route exact path="/data15" component={Data15}/> */}
                        {/* <Route exact path="/data16" component={Data16}/> */}


                        <Route exact path="/array1" component={Array1}/>
                        <Route exact path="/array2" component={Array2}/>
                        <Route exact path="/array3" component={Array3}/>
                        <Route exact path="/array4" component={Array4}/>
                        <Route exact path="/array5" component={Array5}/>
                        <Route exact path="/array6" component={Array6}/>
                        <Route exact path="/array7" component={Array7}/>
                        <Route exact path="/array8" component={Array8}/>
                        <Route exact path="/array9" component={Array9}/>
                        <Route exact path="/array10" component={Array10}/>
                        <Route exact path="/array11" component={Array11}/>
                        <Route exact path="/array12" component={Array12}/>
                        <Route exact path="/array13" component={Array13}/>
                        <Route exact path="/array14" component={Array14}/>
                        <Route exact path="/array15" component={Array15}/>
                        <Route exact path="/array16" component={Array16}/>
                        <Route exact path="/array17" component={Array17}/>
                        <Route exact path="/array18" component={Array18}/>
                        <Route exact path="/array19" component={Array19}/>
                        <Route exact path="/array20" component={Array20}/>
                        <Route exact path="/array21" component={Array21}/>
                        <Route exact path="/array22" component={Array22}/>
                        <Route exact path="/array23" component={Array23}/>
                        {/* <Route exact path="/array24" component={Array24}/> */}

                        <Route exact path="/home1" component={Home1}/>
                        {/* <Route exact path="/home2" component={Home2}/> */}
                        <Route exact path="/home3" component={Home3}/>
                        <Route exact path="/home4" component={Home4}/>
                        <Route exact path="/home5" component={Home5}/>
                        <Route exact path="/home6" component={Home6}/>
                        <Route exact path="/home7" component={Home7}/>
                        <Route exact path="/home8" component={Home8}/>
                        <Route exact path="/home9" component={Home9}/>
                        <Route exact path="/home10" component={Home10}/>
                        <Route exact path="/home11" component={Home11}/>
                        <Route exact path="/home12" component={Home12}/>
                        <Route exact path="/home13" component={Home13}/>
                        <Route exact path="/home14" component={Home14}/>
                        {/* <Route exact path="/home15" component={Home15}/> */}
                        {/* <Route exact path="/home16" component={Home16}/> */}
                        {/* <Route exact path="/home17" component={Home17}/> */}
                        {/* <Route exact path="/home18" component={Home18}/> */}

                        <Route exact path="/react1" component={React1}/>
                        <Route exact path="/react2" component={React2}/>
                        <Route exact path="/react3" component={React3}/>
                        <Route exact path="/react4" component={React4}/>
                        <Route exact path="/react5" component={React5}/>
                        <Route exact path="/react6" component={React6}/>
                        <Route exact path="/react7" component={React7}/>
                        <Route exact path="/react8" component={React8}/>
                        <Route exact path="/react9" component={React9}/>
                        <Route exact path="/react10" component={React10}/>
                        <Route exact path="/react11" component={React11}/>
                        <Route exact path="/react12" component={React12}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

render(
    <HashRouter basename="/">
        <Home/> 
    </HashRouter>,
    document.getElementById("app")
)



