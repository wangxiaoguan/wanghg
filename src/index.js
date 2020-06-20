// import "./scripts"; 
// import "./styles/index.scss";

import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import store from './scripts/redux/store';
import {LocaleProvider} from 'antd';
import moment from 'moment';
import Home from './scripts/index';
import './styles/index.scss';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


render(
    <LocaleProvider local={zhCN}>
        <Provider store={store}>
            <Home/>
        </Provider>
    </LocaleProvider>,
    document.getElementById('app')

)












