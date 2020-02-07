import React, { Component } from 'react';
import { Tabs, Form, Cascader, Message ,message,Icon, Divider,Spin,Popconfirm } from 'antd';
import {postService,getService,GetQueryString} from '../../myFetch';
import API_PREFIX  from '../../apiprefix';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

@connect(
    state => ({
      pageData:state.table.pageData,
      powers: state.powers,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)
class List extends Component{
    constructor(props){
        super(props);
        this.state={
            currentTabsKey:GetQueryString(location.hash,['tabsVale']).tabsVale?GetQueryString(location.hash,['tabsVale']).tabsVale:'1',
            updateKeyOne:0,
            updateKeyTwo:0,
            updateKeyThree:0,
        };
    }

    paneChange=(activeKey)=>{
        sessionStorage.setItem("TabsKey",activeKey);
        this.setState({currentTabsKey:activeKey});
      if(activeKey=='1'){
        this.setState({updateKeyOne:this.state.updateKeyOne+1});
      }else if(activeKey=='2'){
        this.setState({updateKeyTwo:this.state.updateKeyTwo+1});
      }else if(activeKey=='3'){
        this.setState({updateKeyThree:this.state.updateKeyThree+1});
      }
    }

    //发布
    publish=(record)=>{
        postService(API_PREFIX+`services/web/union/studyManage/publishUnionStudy/${record.id}`,{},data=>{
            if(data.status===1){
                this.props.getData(API_PREFIX+`services/web/union/studyManage/getUnionStudyList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState=0`);
            }else{
                Message.error(data.errorMsg)
            }
        })
    }
    //笔记
    learnNote=(record)=>{
        location.hash = `/TradeManager/LearnManagation/Note?id=${record.id}&activeKey=${this.state.currentTabsKey}`;
    }
    render(){
        let powers = this.props.powers;
        let hasAddBtn = powers&&powers['20007.21712.001'];
        let hasEdit = powers&&powers['20007.21712.002'];
        let hasDeleteBtn = powers &&powers['20007.21712.004'];
        let hasPulish = powers&&powers['20007.21712.005']
        let hasOnline = powers &&powers['20007.21712.006'];
        const columns1=[//未发布
            {
                title: '序号',
                dataIndex:'sNum',
                key:'sNum', 
            },
            {
                title: '学习名称',
                dataIndex:'title',
                key:'title', 
            },
            {
                title: '发布人',
                dataIndex:'createUserName',
                key:'createUserName', 
            },
            {
                title: '是否必修',
                dataIndex:'isRequired',
                key:'isRequired', 
                render:(text,record)=>{
                    return <span>{record.isRequired==2?'是':'否'}</span>
                }
            },
            {
                title: '创建时间',
                dataIndex:'createDate',
                key:'createDate', 
            },
            {
                title: '操作',
                dataIndex:'x',
                key:'x',
                render:(text,record)=>(
                    <div>
                        {
                            hasEdit?<a className='operation' onClick={()=>{location.hash=`/TradeManager/LearnManagation/Edit?id=${record.id}`}}>编辑</a>:null
                        }
                        <Divider type="vertical" style={{display:hasEdit?'inline-block':'none'}}/>
                        <a className='operation' onClick={()=>{location.hash=`/TradeManager/LearnManagation/Detail?id=${record.id}`}} >详情</a>
                        <Divider type="vertical" style={{display:hasPulish?'inline-block':'none'}} />
                        {
                            hasPulish?<Popconfirm title={'确定发布吗？'} onConfirm={()=>this.publish(record)} ><a className='operation'>发布</a></Popconfirm>:null
                        }
                        
                    </div>
                ),
            },
        ];
        const columns2=[//已上线与已下线
            {
                title: '序号',
                dataIndex:'sNum',
                key:'sNum', 
            },
            {
                title: '学习名称',
                dataIndex:'title',
                key:'title', 
            },
            {
                title: '发布人',
                dataIndex:'createUserName',
                key:'createUserName', 
            },
            {
                title: '是否必修',
                dataIndex:'isRequired',
                key:'isRequired', 
                render:(text,record)=>{
                    return <span>{record.isRequired==2?'是':'否'}</span>
                }
            },
            {
                title: '创建时间',
                dataIndex:'createDate',
                key:'createDate', 
            },
            {
                title: '操作',
                dataIndex:'x',
                key:'x',
                render:(text,record)=>(
                    <div>
                        {
                            hasEdit?<a className='operation' onClick={()=>{location.hash=`/TradeManager/LearnManagation/Edit?id=${record.id}`}}>编辑</a>:null
                        }
                        <Divider type="vertical" style={{display:hasEdit?'inline-block':'none'}} />
                        <a className='operation' onClick={()=>{location.hash=`/TradeManager/LearnManagation/Detail?id=${record.id}`}}>详情</a>
                        <Divider type="vertical" />
                        <a className='operation' onClick={()=>this.learnNote(record) } >查看学习笔记</a>
                    </div>
                ),
            },
        ];
        return(
            <div>
                <Tabs type="card" defaultActiveKey={this.state.currentTabsKey} onChange={this.paneChange} >
                    <TabPane tab="未发布" key="1" >
                        <LearnManagation
                            url={'services/web/union/studyManage/getUnionStudyList'}
                            addBtn={hasAddBtn?'/TradeManager/LearnManagation/Add':null}
                            deleteUrl={hasDeleteBtn?'services/web/union/studyManage/deleteUnionStudy':null}
                            columns={columns1}
                            urlfilter={`Q=onlineState=0`}
                            updateKey={this.state.updateKeyOne}
                        />
                    </TabPane>
                    <TabPane tab="已上线" key="2" >
                        <LearnManagation
                            url={'services/web/union/studyManage/getUnionStudyList'}
                            deleteUrl={hasDeleteBtn?'services/web/union/studyManage/deleteUnionStudy':null}
                            columns={columns2}
                            urlfilter={`Q=onlineState=1`}
                            updateKey={this.state.updateKeyTwo}
                            offOrOnLineBtn={hasOnline ? { label: '下线', order: 1, url: 'services/web/union/studyManage/onlineState/2' } : null}
                        />
                    </TabPane>
                    <TabPane tab="已下线" key="3" >
                        <LearnManagation
                            url={'services/web/union/studyManage/getUnionStudyList'}
                            deleteUrl={hasDeleteBtn?'services/web/union/studyManage/deleteUnionStudy':null}
                            columns={columns2}
                            urlfilter={`Q=onlineState=2`}
                            updateKey={this.state.updateKeyThree}
                            offOrOnLineBtn={hasOnline ? { label: '上线', order: 1, url: 'services/web/union/studyManage/onlineState/1',typeLine:'上线' } : null}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
class LearnManagation extends  Component{
    constructor(props){
        super(props);
        this.state={
            
        };
    }


    componentDidMount(){
        console.log('页面数据十大大苏打==》',456);
    }


    render(){
        console.log('请求的地址===》',this.props.url);
        const isCompulsory=[
            { key:'',
              value:'全部',
            },
            { key:'2',
              value:'是',
            }, 
            { key:'1',
              value:'否',
            },
        ];
        const search=[
            {key:'title',label:'学习名称',qFilter:'Q=title',type:'input'},
            {key:'isRequired' ,label:'是否必修',qFilter:'Q=isRequired' ,type:'select',option:isCompulsory},
            {key:'createDate',startTime:'startDate',endTime:'endDate', label: '创建时间', type: 'rangePicker' }, 
        ];
        return(
            <div>
                <TableAndSearch
                    key={this.props.updateKey}
                    columns={this.props.columns}
                    search={search}
                    url={this.props.url}
                    urlfilter={this.props.urlfilter}
                    addBtn={this.props.addBtn?{order:1,url:this.props.addBtn}:null}
                    deleteBtn={this.props.deleteUrl?{order:2,url:this.props.deleteUrl}:null}
                    offOrOnLineBtn={this.props.offOrOnLineBtn}
                />
            </div>
        );
    }
}

export default List;