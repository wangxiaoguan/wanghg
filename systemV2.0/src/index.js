
import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";
import {connect,Provider} from 'react-redux';
import { Router,Link,HashRouter,Route,Switch} from "react-router-dom";
import { LocaleProvider,ConfigProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import "./styles/index.scss";
import Home from './scripts/routes/index';
// import TabList from './scripts/content/TabList';
import ConnectPage from './scripts/content/ConnectPage/index';
import store from './scripts/redux/store';

render(
    <HashRouter basename="/" component={ConnectPage}>
        <ConfigProvider locale={zh_CN}>
            <Provider store={store}>
                <Home/> 
            </Provider>
        </ConfigProvider>
        
    </HashRouter>,
    document.getElementById("app")
)

               













