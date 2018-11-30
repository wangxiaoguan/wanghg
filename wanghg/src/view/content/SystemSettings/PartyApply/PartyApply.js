import React,{Component} from 'react';
import {Divider,Popconfirm,Message,Modal,Spin} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { getService,postService } from '../../myFetch.js';
import API_PREFIX from '../../apiprefix';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class PartyApply extends Component{

    constructor(props){
        super(props);
        this.state={
            partyOrganizationDatas: [],    //党组织机构数据
            isFile:false,
            FileUrl:'',
            name:'',
            loading: false,
        }
    }

    componentWillMount() {
        this.setState({ loading: true });
        //获取党组织数据
        getService(API_PREFIX + 'services/system/partyOrganization/partyOrganizationList/get', data => {
          console.log('党组织数据：', data);
          let pOrgs = data.root.list;
          if (pOrgs) {
            //调用接口数据处理函数
            this.getPartyOrganationData(pOrgs);
            this.setState({
              partyOrganizationDatas: pOrgs,
              loading: false,
            });
    
          }else{
            message.error(data.retMsg);
            this.setState({ loading: false });
          }
        }
        );
    
      }
      //递归取出接口返回的党组织的数据
      getPartyOrganationData(poData) {
        poData.map((item, index) => {
          item.value = item.id;
          item.label = item.name;
          item.children = item.partyOrganizationList;
          if (item.partyOrganizationList) {//不为空，递归
            this.getPartyOrganationData(item.partyOrganizationList);
          }
        });
      }
    componentDidMount(){}

    isPass=()=>{

    }
    handleCancel = () => this.setState({ isFile: false })
    showFile=(record)=>{///system/partyApplyAttach/get/list/{page}/{pageSize}
        this.setState({isFile:true})
        getService(API_PREFIX + `services/system/partyApplyAttach/get/list/1/10?Q=applyid_EQ=${record.id}`, data => {
          console.log('入党申请附件数据', data);
          let FileUrl = data.root.list[0].url;
          let name = data.root.list[0].name;
          this.setState({FileUrl,name})
          
        })
        
    }
    render(){
      const {FileUrl,name}=this.state
        const columns=[
            {
              title: '编号',
              key: 'userId',
              dataIndex: 'userId',
              width: 100,
              fixed: 'left'
            },
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '部门',
              dataIndex: 'orgFullName',
              key: 'orgFullName',
            },
            {
              title: '党组织',
              dataIndex: 'partyFullName',
              key: 'partyFullName',
            },
            {
              title: '政治面貌',
              dataIndex: 'stateDesp',
              key: 'stateDesp',
            },
            {
              title: '附件',
              dataIndex: 'createdate',
              key: 'createdate',
              render:(data,record)=>{
                  return  <button onClick={()=>this.showFile(record)}>显示附件</button>
              }
            },
            {
              title: '申请日期',
              dataIndex: 'applyDate',
              key: 'applyDate',
            },
            {
              title: '操作',
              dataIndex: 'operation',
              key: 'operation',
              width:100,
              fixed: 'right',
              
              render:(data,record)=>(
                  <div>
                    <Divider type="vertical" />
                    <Popconfirm title="确定通过审核吗?" onConfirm={()=>this.isPass(record)}>
                    <a className='operation'  >审核</a></Popconfirm>
                    <Divider type="vertical"/>
                  </div>
                )
            },
          ];
          const search = [
            { key: 'name', label: '姓名',qFilter:'Q=name_LK',type:'input'},
            { key: 'partyid',label: '党组织',qFilter: 'Q=partyid_S_ST',  type: 'cascader',option: this.state.partyOrganizationDatas,
              },
          ];
        return(
            <div>
                  <Spin spinning={this.state.loading}>
                    <TableAndSearch
                        rowkey={'id'}
                        columns={columns}
                        search={search}
                        url={'services/system/partyApplyer/get/list'}
                        deleteBtn={{order:2,url:'services/system/partyApplyer/delete',field:'ids'}}
                    ></TableAndSearch>
                    <Modal
                      footer={null}
                      visible={this.state.isFile}
                      onCancel={this.handleCancel}
                    >
                     
                      {
                          FileUrl?<a href={FileUrl} download={FileUrl}>{name}</a>:<h5>没有文件</h5>
                      }
                      
                    </Modal>
                  </Spin>    
            </div>
        )
    }



}