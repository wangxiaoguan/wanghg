import React from 'react';
import { NavLink, withRouter } from "react-router-dom";
import {Icon,Menu,Row,Col,Modal,Layout} from 'antd';

class Nav extends React.Component{
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
            id:'101',

        }
    }
    componentDidMount(){
        this.getList();

    }
    componentDidUpdate(){
        console.log('00000000000')
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
    onKey = (e) => {
        this.props.getId(e.key)
        console.log(this.props);
    }
    render() {
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
        return (
            <Menu mode="inline" theme="light" onClick={e=>this.onKey(e)}>
                            <Menu.Item key="101">
                                <NavLink to="/common/list">
                                    <div className='listTable'>
                                        <Icon type="unordered-list" />
                                        <span className='listTable-name'>ListTable</span>
                                        <Icon　className='total_right' type="right" />
                                    </div>
                                </NavLink>
                            </Menu.Item>
                            <Menu.SubMenu key="sub1" title={<span><Icon type="html5" /><span>HTML</span></span>}>
                                {
                                    htmlList.map(item=>{
                                        return <Menu.Item key={item.id}><NavLink  to={`/common/detail/${item.id}`}><p>{item.title}</p></NavLink ></Menu.Item>
                                    })
                                }
                            </Menu.SubMenu>
                            <Menu.SubMenu key="sub2" title={<span><Icon type="code-sandbox" /><span>CSS</span></span>}>
                                {
                                    cssList.map(item=>{
                                        return <Menu.Item key={item.id}><NavLink to={`/common/detail/${item.id}`}><p>{item.title}</p></NavLink></Menu.Item>
                                    })
                                }
                            </Menu.SubMenu>
                            <Menu.SubMenu key="sub3" title={<span><Icon type="desktop" /><span>JavaScript</span></span>}>
                                {
                                    jsList.map(item=>{
                                        return <Menu.Item key={item.id}><NavLink to={`/common/detail/${item.id}`}><p>{item.title}</p></NavLink></Menu.Item>
                                    })
                                }
                            </Menu.SubMenu>
                            <Menu.SubMenu key="sub4" title={<span><Icon type="book" /><span>Node</span></span>}>
                                {
                                    nodeList.map(item=>{
                                        return <Menu.Item key={item.id}><NavLink to={`/common/detail/${item.id}`}><p>{item.title}</p></NavLink></Menu.Item>
                                    })
                                }
                            </Menu.SubMenu>
                            <Menu.SubMenu key="sub5" title={<span><Icon type="codepen" /><span>React</span></span>}>
                                {
                                    reactList.map(item=>{
                                        return <Menu.Item key={item.id}><NavLink to={`/common/detail/${item.id}`}><p>{item.title}</p></NavLink></Menu.Item>
                                    })
                                }
                            </Menu.SubMenu>
                        </Menu>
        );
    }
}


export default withRouter(Nav)