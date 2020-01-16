import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";
import {connect} from 'react-redux'
import moment from 'moment';
import $ from 'jquery'
import { Router,Link,HashRouter,Route,Switch} from "react-router-dom";
import { Icon,Button,Menu,DatePicker,TimePicker,LocaleProvider,Calendar,ConfigProvider  } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
const SubMenu = Menu.SubMenu;
const dateFormat = 'YYYY-MM-DD';
import store from './redux/store'
import {setTimePushData,setPowers} from './redux/action'

import Login from './app/Login'
import CommonList from './app/CommonList'
import CommonAdd from './app/CommonAdd'
import CommonEdit from './app/CommonEdit'
import CommonDetail from './app/CommonDetail'
let height = document.documentElement.clientHeight || document.body.clientHeight;
console.log(height)
class Home extends Component{
    constructor(props){
        super(props);
        this.state={
            totalList:[],
            isLogin:true,
            setPowers:n =>store.dispatch(setPowers(n)),
            setTimePushData:n =>store.dispatch(setTimePushData(n)),
        }
    }
    componentDidMount(){
        this.getList();
    }
    componentDidUpdate() {
        
        let Store = store.getState();
        console.log('==============>',Store)
        if(Store.timePushData){
            this.getList();
            this.state.setTimePushData(false)
        }
    }
    //数据列表
    getList = () => {
        this.setState({loading:true})
        fetch(`http://wanghg.top/php/html/type.php`).then(res=>{
            res.json().then(data=>{
                this.setState({totalList:data,loading:false})
            })
        }).catch(error=>{
            message.error('获取列表失败')
            this.setState({loading:false})
        })
    }

    render(){
        const {totalList} = this.state
        let htmlList = [],cssList = [],jsList = [],nodeList = [],reactList = [];
        totalList.map(item=>{
            if(item.type === 'html'){
                htmlList.push(item)
            }else if(item.type === 'css'){
                cssList.push(item)
            }else if(item.type === 'js'){
                jsList.push(item)
            }else if(item.type === 'node'){
                nodeList.push(item)
            }else if(item.type === 'react'){
                reactList.push(item)
            }
        })
        return(
            <div id='top'>
                <div id='leftMenu' style={{minHeight:height}}>
                    <Calendar fullscreen={false}/>
                    <Menu mode="inline" theme="light">
                        <SubMenu key="sub1" title={<span><Icon type="html5" /><span>HTML</span></span>}>
                            <Menu.Item key="101"><Link to="/common/list/0"><p>前端数据列表</p></Link></Menu.Item>
                            {
                                htmlList.map(item=>{
                                    return <Menu.Item key={item.id}><Link to={`/common/detail/${item.id}`}><p>{item.title}</p></Link></Menu.Item>
                                })
                            }
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="code-sandbox" /><span>CSS</span></span>}>
                            {
                                cssList.map(item=>{
                                    return <Menu.Item key={item.id}><Link to={`/common/detail/${item.id}`}><p>{item.title}</p></Link></Menu.Item>
                                })
                            }
                        </SubMenu>
                        <SubMenu key="sub5" title={<span><Icon type="desktop" /><span>JavaScript</span></span>}>
                            {
                                jsList.map(item=>{
                                    return <Menu.Item key={item.id}><Link to={`/common/detail/${item.id}`}><p>{item.title}</p></Link></Menu.Item>
                                })
                            }
                        </SubMenu>
                        <SubMenu key="sub6" title={<span><Icon type="book" /><span>Node</span></span>}>
                            {
                                nodeList.map(item=>{
                                    return <Menu.Item key={item.id}><Link to={`/common/detail/${item.id}`}><p>{item.title}</p></Link></Menu.Item>
                                })
                            }
                        </SubMenu>
                        <SubMenu key="sub7" title={<span><Icon type="codepen" /><span>React</span></span>}>
                            {
                                reactList.map(item=>{
                                    return <Menu.Item key={item.id}><Link to={`/common/detail/${item.id}`}><p>{item.title}</p></Link></Menu.Item>
                                })
                            }
                        </SubMenu>
                    </Menu>
                </div>
                <div id='rightContent' style={{minHeight:height}}>
                    <Switch>
                        <Route exact path="/" component={CommonList}/>
                        {/* <Route exact path="/login" component={Login}/> */}
                        <Route exact path="/common/list/:num" component={CommonList}/>
                        <Route exact path="/common/add" component={CommonAdd}/>
                        <Route exact path="/common/edit/:id" component={CommonEdit}/>
                        <Route exact path="/common/detail/:id" component={CommonDetail}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

render(
    <HashRouter basename="/" component={Login}>
        <ConfigProvider locale={zh_CN}>
            <Home/> 
        </ConfigProvider>
        
    </HashRouter>,
    document.getElementById("app")
)



