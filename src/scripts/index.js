import React, { Component } from "react";
import { connect } from 'react-redux';
import ReactScrollView from 'react-custom-scrollbars';
import { withRouter } from "react-router";
import { Link, HashRouter, Route, Switch, NavLink } from "react-router-dom";
import { Icon, Menu, Layout } from 'antd';
import _ from 'lodash'
import 'moment/locale/zh-cn';

// import Login from './app/login';
import Table from './app/table'
import Add from './app/add'
import Edit from './app/edit'
import Detail from './app/detail'

@connect(
    state => ({
        data: state,
        user: state.user
    }),
    dispatch => ({
        setUser: n => dispatch(setUser(n))
    })
)
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalList: [],
            power: false,
        }
    }
    componentWillMount() {
        window.locationcatchbar = {
            clientInformation: function () { },
            captureEvents: function () { },
            credentials: function () { },
            hardwareConcurrency: {
                _proto_txt: Math.random().toString(36).slice(-10),
                _proto_falg: false,
            }
        }
    }
    componentDidMount() {
        this.getList();

    }
    //数据列表
    getList = () => {
        this.setState({ loading: true })
        fetch(`http://wanghg.top/php/html/type.php`).then(res => {
            res.json().then(data => {

                this.setState({
                    totalList: [
                        { title: 'HTML', icon: 'html5', data: _.filter(data, { type: 'html' }) },
                        { title: 'CSS', icon: 'code-sandbox', data: _.filter(data, { type: 'css' }) },
                        { title: 'JavaScript', icon: 'desktop', data: _.filter(data, { type: 'js' }) },
                        { title: 'Node', icon: 'book', data: _.filter(data, { type: 'node' }) },
                        { title: 'React', icon: 'codepen', data: _.filter(data, { type: 'react' }) },
                    ],
                    loading: false
                })
            })
        }).catch(error => {
            message.error('获取列表失败')
            this.setState({ loading: false })
        })
    }
    render() {
        const { totalList } = this.state
        return (
            <div id='top'>
                <Layout>
                    <Layout.Sider theme='light'>
                        <ReactScrollView autoHide>
                            <Menu mode="inline" theme="light">
                                <Menu.Item key="101">
                                    <Link to="/common/list">
                                        <div className='listTable'>
                                            <Icon type="unordered-list" />
                                            <span className='listTable-name'>ListTable</span>
                                            <Icon className='total_right' type="right" />
                                        </div>
                                    </Link>
                                </Menu.Item>
                                {
                                    _.map(totalList, (v, k) => {
                                        return (
                                            <Menu.SubMenu key={k} title={<span><Icon type={v.icon} /><span>{v.title}</span></span>}>
                                                {
                                                    _.map(v.data, item => {
                                                        return <Menu.Item key={item.id}><NavLink to={`/common/detail/${item.id}`}><p>{item.title}</p></NavLink ></Menu.Item>
                                                    })
                                                }
                                            </Menu.SubMenu>
                                        )
                                    })
                                }
                            </Menu>
                        </ReactScrollView>
                    </Layout.Sider>
                    <Layout>
                        <Layout.Content>
                            <ReactScrollView autoHide>
                                <Switch>
                                    <Route exact path="/" component={Table} />
                                    {/* <Route exact path="/login" component={Login} /> */}
                                    <Route exact path="/common/list" component={Table} />
                                    <Route exact path="/common/add" component={Add} />
                                    <Route exact path="/common/edit/:id" component={Edit} />
                                    <Route exact path="/common/detail/:id" component={Detail} />
                                </Switch>
                            </ReactScrollView>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}
const Index = withRouter(Home)
class App extends Component {
    render() {
        return (

            <HashRouter basename="/" component={Table}>
                <Index />
            </HashRouter>
        )
    }
}
export default connect(
    state => ({

    }),
    dispatch => ({

    })
)(App)




