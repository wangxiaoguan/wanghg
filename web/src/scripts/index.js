import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";
import {connect,Provider} from 'react-redux'
import moment from 'moment';
import $ from 'jquery'
import { Router,Link,HashRouter,Route,Switch} from "react-router-dom";
import { Icon,Button,Menu,DatePicker,TimePicker,LocaleProvider,Calendar,ConfigProvider,Row,Col,Modal,  } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
const SubMenu = Menu.SubMenu;
const dateFormat = 'YYYY-MM-DD';
import store from './redux/store'
import {setUser} from './redux/action'

import Login from './app/Login'
import CommonList from './app/CommonList'
import CommonAdd from './app/CommonAdd'
import CommonEdit from './app/CommonEdit'
import CommonDetail from './app/CommonDetail'
let height = document.documentElement.clientHeight || document.body.clientHeight;
class Home extends Component{
    constructor(props){
        super(props);
        this.state={
            totalList:[],
            user:'',
            visible:false,
            power:false,
            islogin:true,
            openKey: [],
            keyList:['sub1','sub2','sub3','sub4','sub5',],
            setUser:n =>store.dispatch(setUser(n)),
        }
    }
    componentDidMount(){
        this.getList();
        let Store = store.getState();
        console.log('------------------------>',Store)
        // this.state.setUser({user:'123456'})
    }
    componentDidUpdate() {
        // this.state.setUser({user:'123456'})
        let Store = store.getState();
        console.log('========================>',Store)
        let user = Store.user || window.sessionStorage.getItem('user');
        let { islogin} = this.state;
        if(user&&islogin){
            if(user === '17371301830'){
                this.setState({power:true,user,islogin:false})
            }else{
                this.setState({user,islogin:false})
            }
            
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
    openKey = key => {
        this.setState({
            openKey: [key.pop()],
          });
      };
    goLogin = () => {
        const {user} = this.state;
        if(user){
            this.state.setUser('')
            this.setState({user:''})
            sessionStorage .removeItem('user')
        }else{
            this.setState({visible:true})
        }
    }
    closeModal = () => {
        this.setState({visible:false})
    }
    loginSuccess = () => {
        this.setState({islogin:true})
    }
    render(){
        const {totalList,openKey,user,power} = this.state
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
                    <div className='login'>
                        <Row>
                            <Col offset={1} span={10}>{user?user:'游客'}</Col>
                            <Col offset={1} span={10}><span className='setLogin' onClick={this.goLogin}>{user?'退出':'登录'}</span></Col>
                        </Row>
                    </div>
                    <Calendar fullscreen={false}/>
                    <Menu mode="inline" theme="light" openKeys={openKey} onOpenChange={this.openKey}>
                        <Menu.Item key="101"><Link to="/common/list/0"><p><Icon type="unordered-list" />前端数据列表<Icon　className='total_right' type="right" /></p></Link></Menu.Item>
                        <SubMenu key="sub1" title={<span><Icon type="html5" /><span>HTML</span></span>}>
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
                        <SubMenu key="sub3" title={<span><Icon type="desktop" /><span>JavaScript</span></span>}>
                            {
                                jsList.map(item=>{
                                    return <Menu.Item key={item.id}><Link to={`/common/detail/${item.id}`}><p>{item.title}</p></Link></Menu.Item>
                                })
                            }
                        </SubMenu>
                        <SubMenu key="sub4" title={<span><Icon type="book" /><span>Node</span></span>}>
                            {
                                nodeList.map(item=>{
                                    return <Menu.Item key={item.id}><Link to={`/common/detail/${item.id}`}><p>{item.title}</p></Link></Menu.Item>
                                })
                            }
                        </SubMenu>
                        <SubMenu key="sub5" title={<span><Icon type="codepen" /><span>React</span></span>}>
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
                <Modal
                    title="登录"
                    width={400}
                    visible={this.state.visible}
                    onCancel={()=>this.setState({visible:false})}
                    footer={null}
                    afterClose={()=>this.setState({visible:false})}
                    >
                    <Login closeModal={this.closeModal} loginSuccess={this.loginSuccess}/>
                    </Modal>
            </div>
        )
    }
}

render(
    <HashRouter basename="/" component={Login}>
        <ConfigProvider locale={zh_CN}>
            <Provider store={store}>
                <Home/> 
            </Provider>
        </ConfigProvider>
        
    </HashRouter>,
    document.getElementById("app")
)



