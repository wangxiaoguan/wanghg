1;
import React, { Component } from 'react';
import { Tabs,message, Message, Divider,Spin,Popconfirm,Progress,Form,Row, Button,Collapse,Modal ,Table} from 'antd';
import { postService, getService,GetQueryString } from '../../myFetch';
import TableAndSearch from '../../../component/table/TableAndSearch';
import API_PREFIX from '../../apiprefix';
import {getBaseChartConfig } from './myCharts';
import { connect } from 'react-redux';
const TabPane = Tabs.TabPane;
const { Panel } = Collapse;

@connect(
  state => ({
    powers: state.powers,
  }),
)
export default class StatisticalResults extends Component {
  constructor(props) {
    super(props);

    let activeKey="0";
    this.state={
      isdomal:false,
      tabKey:String(activeKey),
      updateKeyOne: 0,
      updateKeyTwo: 0,
      updateKeyThree: 0,
      updateKeyFour: 0,
      loading: false,
      activeKey:String(activeKey),
      activeId:GetQueryString(location.hash, ['id']).id || '0',
      dataArr:[],    //统计结果
      reportOrgRate:[],  //部门参与率
      reportCompanyRate:[],   //企业参与率
      tenantId:window.sessionStorage.getItem("tenantId"),
      activityId:'',
      titleId:'',
      optionId:"",
      oneKeys: [],
      dataOne:[],
      page:1,
      pageSize:10,
      total:0
    };
  }
  componentWillReceiveProps(nextProps) {
    // this.child.handleReset()
    let activeKey = GetQueryString(location.hash, ['id']).id || '0';
    activeKey = String(activeKey);
    if(this.state.activeKey !== activeKey){
      this.setState({
        activeKey,
        tabKey:activeKey,
      });
    }
  }

  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }

  componentDidMount() {
    this.getData();
}

//得到统计结果
getData=()=>{
  this.setState({
    loading:true
  })
  getService(API_PREFIX + `services/web/activity/question/reportActivityTitle/${this.state.activeId}`, data => {
    if (data.status === 1) {
      data.root.object.length>0&&data.root.object.map((item,index)=>{
           item.orgId=item.orgId?item.orgId:"-1";
           item.average=item.average?item.average:"0";
           item.joinRate=item.joinRate?item.joinRate:"0";
      })
        this.setState({dataArr:data.root.object}); 
        data.root.object.length>0&&data.root.object.map((item,index)=>{
          getBaseChartConfig(item,index,(item,params)=>{
              console.log(item,params);
              let titleId="";
              let optionId="";
              item.optionInfos.length>0&&item.optionInfos.map((list,_index)=>{
                if(_index==params.dataIndex){
                  titleId= list.titleId;
                  optionId= list.id;
                }  
              });         
              this.setState({isdomal:true,activityId:item.activityId,titleId,optionId},()=>{
                getService(API_PREFIX +`services/web/activity/exam/getUserDetailByOption/${this.state.page}/${this.state.pageSize}?Q=activityId=${this.state.activityId}&Q=titleId=${this.state.titleId}&Q=optionId=${this.state.optionId}`,data => {
                  if (data.status === 1) {
                     this.setState({dataOne:data.root.list,total: data.root.totalNum})
                  }
                });
              })     
             })
        })
    }
    this.setState({
      loading:false
    })
  })
 }
 requestData=()=>{
  getService(API_PREFIX +`services/web/activity/exam/getUserDetailByOption/${this.state.page}/${this.state.pageSize}?Q=activityId=${this.state.activityId}&Q=titleId=${this.state.titleId}&Q=optionId=${this.state.optionId}`,data => {
    if (data.status === 1) {
       this.setState({dataOne:data.root.list,total:data.root.totalNum})
    }
  });
 }
//得到部门参与率
getBumenData=()=>{
  this.setState({
    loading:true
  })
  getService(API_PREFIX + `services/web/activity/question/reportTwoOrgRate/${this.state.tenantId}/${this.state.activeId}`, data => {
    if (data.status === 1) {
        this.setState({reportOrgRate:[]},()=>{  
          data.root.object.length>0&&data.root.object.map((item,index)=>{
            item.orgId=item.orgId?item.orgId:"-1";
            item.average=item.average?item.average:"0";
            item.joinRate=item.joinRate?item.joinRate:"0";
       })       
          this.setState({reportOrgRate:data.root.object})
        }); 
    }
    this.setState({
      loading:false
    })
  })
 }

 //得到企业参与率
 getQiyeData=()=>{
  this.setState({
    loading:true
  })
  getService(API_PREFIX + `services/web/activity/question/reportCompanyRate/${this.state.activeId}`, data => {
    if (data.status === 1) {
        // this.setState({reportCompanyRate:data.root.object}); 
        this.setState({reportCompanyRate:[]},()=>{   
          data.root.object.length>0&&data.root.object.map((item,index)=>{
            item.orgId=item.orgId?item.orgId:"-1";
            item.average=item.average?item.average:"0";
            item.joinRate=item.joinRate?item.joinRate:"0";
       })
          this.setState({reportCompanyRate:data.root.object})
        }); 

    }
    this.setState({
      loading:false
    })
  })
 }

  tabChange=tabKey=>{
    localStorage.setItem("selectedRowKeys", '');
    sessionStorage.setItem("TabsKey",tabKey);
    console.log("点击进入");
    if (tabKey === '0') {
      this.setState({
        tabKey,
        activeKey:tabKey,
        updateKeyOne: this.state.updateKeyOne + 1,
      }
      );
    } else if (tabKey === '1') {
       this.getBumenData();
      this.setState({
        tabKey,
        activeKey:tabKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      }
     );
    } else if (tabKey === '2') {
        this.getQiyeData();    
        this.setState({
          tabKey,
          activeKey:tabKey,
          updateKeyThree: this.state.updateKeyThree + 1,
        },  
       );
    }
  }
  render() {
    const { updateKeyOne, dataArr} = this.state;

    const columns = [
      // {
      //   title: '序号',
      //   key: 'sNum',
      //   dataIndex: 'sNum',
      // },
      {
        title: '用户姓名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '企业名称',
        dataIndex: 'tenantName',
        key: 'tenantName',
      },
      {
        title: '部门',
        dataIndex: 'orgName',
        key: 'orgName',
      },
      {
        title: '提交时间',
        dataIndex: 'joinDate',
        key: 'joinDate',
      }
    ];
    const { oneKeys,dataOne}=this.state;
    const rowSelectionOne = {
      selectedRowKeys: oneKeys,
      onChange: (ids, data) => {
        this.setState({ oneKeys: ids });
      },
    };

    return <Spin spinning={this.state.loading}>
      <Tabs type="card" defaultActiveKey={"0"} onChange={this.tabChange} className= "tabCommon">
        <TabPane tab="统计结果" key="0">
         <p style={{marginTop:50}}>问卷结果</p>
            {dataArr.length>0&&dataArr.map((item,index)=>{
                return (<div id={`main${index}`}   style={{ width: 800,marginBottom:40,height: 300,marginLeft:200}} />)
            })}
         {/* <div id="main" style={{ width: 800, height: 300,marginLeft:200}} /> */}
         <Row style={{ textAlign: 'center' }}>
              <Button type="primary" style={{ marginLeft: '0px', marginTop: '30px' }} className="resetBtn" onClick={()=>{history.go(-1);}} >返回</Button>
            </Row>
        </TabPane>
        <TabPane tab="部门参与率" key="1">
        <p style={{marginTop:20}}>部门参与率</p>
        <ProgressList   rate={this.state.reportOrgRate}  type="1" />
        <Row style={{ textAlign: 'center' }}>
              <Button type="primary" style={{ marginLeft: '0px', marginTop: '30px' }} className="resetBtn" onClick={()=>{history.go(-1);} }>返回</Button>
            </Row>
        </TabPane>
        <TabPane tab="企业参与率" key="2">
        <p style={{marginTop:20}}>企业参与率</p>
        <ProgressList  rate={this.state.reportCompanyRate}  type="2" />
        <Row style={{ textAlign: 'center' }}>
              <Button type="primary" style={{ marginLeft: '0px', marginTop: '30px' }} className="resetBtn" onClick={()=>{history.go(-1);} }>返回</Button>
            </Row>
        </TabPane>
      </Tabs>

      <Modal
        title=""
        width={1000}
        maskClosable={true}//点击蒙层是否关闭
        footer={null}
        visible={this.state.isdomal}
        onCancel={() => this.setState({isdomal: false})}>
           <Table
            rowKey="id"
            bordered
            columns={columns}
            dataSource={dataOne}
            rowSelection={rowSelectionOne}
            // pagination={false}
            pagination={
              {
                current: this.state.page,
                total: this.state.total,
                pageSize: this.state.pageSize,
                showTotal: total => `共 ${total} 条`,
                showSizeChanger:false,
                  onChange: (page,pageSize) => {
                  this.setState({ page,pageSize },()=>{
                    this.requestData();
                  })
                },
              }
            }
          />
         {/* <TableAndSearch rowkey="userId" columns={columns} url={`web/activity/exam/getUserDetailByOption`}    urlfilter={`Q=activityId=${this.state.activityId}&Q=titleId=${this.state.titleId}&Q=optionId=${this.state.optionId}`}/> */}
      </Modal>
          
    </Spin>;
  }
}

class ProgressList extends Component {
    constructor(props) {
      super(props);
      this.state={
        activeId:GetQueryString(location.hash, ['id']).id || '0',
        bumenArr:[],
        loading:false,
        oldId:0,
        type:null
      };
    }
    callback=(key)=> {
        console.log(key);
      }

      componentWillReceiveProps(nextProps){
        if(this.state.type!==nextProps.type){
           this.setState({ oldId:0,type:nextProps.type})
        }     
      }

  getNextData=(orgId)=>{
    if(orgId==this.state.oldId){
      return false;
    }else{
    this.setState({
      loading:true,oldId:orgId
    })

    this.setState({bumenArr:[]},()=>{
      getService(API_PREFIX + `services/web/activity/question/reportThreeOrgRate/${orgId}/${this.state.activeId}`, data => {
        if (data.status === 1) {          
                data.root.object.length>0&&data.root.object.map((item,index)=>{
                  item.orgId=item.orgId?item.orgId:"-1";
                  item.average=item.average?item.average:"0";
                  item.joinRate=item.joinRate?item.joinRate:"0";
                 })
                  this.setState({bumenArr:data.root.object})       
        }
        this.setState({
          loading:false
        })
      })

    })
  }}
    render() {
     const {type,rate}=this.props;
     const {bumenArr}=this.state;
      return (
          <div>
            {rate&&rate.length>0&&type==1?<Collapse onChange={()=>this.callback(type)} destroyInactivePanel accordion>
                {rate.map((item,index)=>{
                 return  <Panel showArrow={false} header={<div  onClick={()=>this.getNextData(item.orgId)}><span>{index+1}、{item.orgName}(总人数:{item.orgUserNum},参与人数:{item.joinNum})</span><Progress  strokeColor={{
                  from: '#108ee9',
                  to: '#108ee9',
                }} strokeLinecap="square"  percent={Number((item.joinRate).replace("%",""))}  format={percent => `${item.joinRate}`} strokeWidth={15}/></div>}
                      key={index} style={{ width: 800, marginLeft: 150 }}>
                    {bumenArr.length>0? bumenArr.map((list,_index)=>{
        return (<div style={{marginLeft:"20px"}}><span>{list.orgName}(总人数:{list.orgUserNum},参与人数:{list.joinNum})</span><Progress   strokeColor={{
          from: '#108ee9',
          to: '#108ee9',
        }}  strokeLinecap="square" percent={Number((list.joinRate).replace("%",""))} format={percent => `${list.joinRate}`} strokeWidth={15} /></div>) }):<div style={{color:"#999",fontSize:"12px"}}>暂无数据</div>}</Panel> })}             
              </Collapse>: (rate&&rate.length>0&&type==2? rate.map((item,index)=>{
                return  ( <div style={{width:"800px",marginLeft:"150px"}}><span>{item.orgName}(总人数:{item.orgUserNum},参与人数:{item.joinNum})</span><Progress   strokeColor={{
                  from: '#108ee9',
                  to: '#108ee9',
                }}  strokeLinecap="square"percent={Number((item.joinRate).replace("%",""))}  format={percent => `${item.joinRate}`} strokeWidth={15}/></div>)
              }):null)}
          </div>
      );
    }
  }




