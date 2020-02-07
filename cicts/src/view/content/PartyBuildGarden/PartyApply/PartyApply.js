import React,{Component} from 'react';
import {Divider,Popconfirm,Message,Modal,Spin} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { getService,postService } from '../../myFetch.js';
import API_PREFIX,{API_FILE_VIEW,API_FILE_VIEW_INNER,API_CHOOSE_SERVICE} from '../../apiprefix';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class PartyApply extends Component{

    constructor(props){
        super(props);
        this.departList = []
        this.state={
            partyOrganizationDatas: [],    //党组织机构数据
            isFile:false,
            fileList:'',
            loading: false,
        };
    }

    componentWillMount() {
        // this.setState({ loading: true });
        getService(API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false', data => {
          console.log('部门数据：', data);
          let pOrgs = data.root.object;
          if (pOrgs) {
            //直接调用处理部门数据的方法===》处理数据
            let selectIds = this.getDpData(pOrgs)
            this.getDepartmentData(pOrgs, selectIds);
            this.setState({
              partyOrganizationDatas: pOrgs,
              // loading: false,
            });
    
          }else{
            message.error(data.errorMsg);
            // this.setState({ loading: false });
          }
        }
        );
    
      }
      // 把可以操作的部门的父节点全部找出来
      getDpData(data) {
        let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false
        data.map((item, index) => {
          if(orgIds&&orgIds.indexOf(item.id)>-1){
            this.departList.push(item.treePath.split(','))
          }
          if (item.subCompanyOrgList) {
            this.getDpData(item.subCompanyOrgList);
          }
        });
        let List = this.departList.join(',').split(',');
        return [...new Set(List)]
      }
      //递归取出接口返回的部门的数据
      getDepartmentData(dpData, selectIds) {
        let orgIds = this.state.orgIds
        dpData.map((item, index) => {
          item.value = item.id;
          item.label = item.name;
          item.children = item.subCompanyOrgList;
          item.disabled = !orgIds ? false : selectIds.toString().indexOf(item.id) > -1 ? false : true;
          if (item.subCompanyOrgList) {//不为空，递归
            this.getDepartmentData(item.subCompanyOrgList, selectIds);
          }
        });
      }
    componentDidMount(){}

    isPass=()=>{

    }
    handleCancel = () => this.setState({ isFile: false })
    showFile=(record)=>{///system/partyApplyAttach/get/list/{page}/{pageSize}
        this.setState({isFile:true});
        let url='';
        if(API_CHOOSE_SERVICE===1){
          url= sessionStorage.getItem('ossViewPath') || API_FILE_VIEW; 
        }else{
          url=API_FILE_VIEW_INNER;
        }
        getService(API_PREFIX + `services/web/party/apply/getApplyAttachsByApplyId/${record.id}`, data => {
          console.log('入党申请附件数据', data);
          if(data.status === 1) {
            let fileList=this.state.fileList;
            if(data.root.object.length>0){
              fileList=data.root.object.map(item=>{
                return  <div><a
                target="_blank" 
                href={item.url&&item.url.indexOf('http')>-1?item.url:url+item.url} 
                download={item.url&&item.url.indexOf('http')>-1?item.url:url+item.url}>{item.attachName}</a></div>;
              });
            }else{
              fileList='没有申请附件';
            }
            console.log(fileList);
          this.setState({fileList});
          }else {
            message.error(data.errorMsg)
          }
        });
        
    }
    render(){
      const {fileList}=this.state;
      let powers = this.props.powers
      let delPowers = powers && powers['20005.23003.004']
        const columns=[
            {
              title: '编号',
              key: 'userId',
              dataIndex: 'userId',
              width: 100,
              fixed: 'left',
            },
            {
              title: '姓名',
              dataIndex: 'userName',
              key: 'userName',
            },
            {
              title: '部门',
              dataIndex: 'orgName',
              key: 'orgName',
            },
            {
              title: '党组织',
              dataIndex: 'partyName',
              key: 'partyName',
            },
            {
              title: '政治面貌',
              dataIndex: 'stateDesp',
              key: 'stateDesp',
              render: (text, record) => {
                if(record.state == 3 || !record.state) {
                  return '普通群众'
                }
              }
            },
            {
              title: '附件',
              dataIndex: 'createdate',
              key: 'createdate',
              render:(data,record)=>{
                  return  <button onClick={()=>this.showFile(record)}>显示附件</button>;
              },
            },
            {
              title: '申请日期',
              dataIndex: 'applyDate',
              key: 'applyDate',
            },
            // {
            //   title: '操作',
            //   dataIndex: 'operation',
            //   key: 'operation',
            //   width:100,
            //   fixed: 'right',
              
            //   render:(data,record)=>(
            //       <div>
            //         <Divider type="vertical" />
            //         <Popconfirm title="确定通过审核吗?" onConfirm={()=>this.isPass(record)}>
            //         <a className='operation'  >审核</a></Popconfirm>
            //         <Divider type="vertical"/>
            //       </div>
            //     )
            // },
          ];
          const search = [
            { key: 'userName', label: '姓名',qFilter:'Q=userName',type:'input'},
            { key: 'orgId',label: '部门',qFilter: 'Q=orgId',  type: 'cascader',option: this.state.partyOrganizationDatas,
              },
          ];
        return(
            <div>
                  <Spin spinning={this.state.loading}>
                    <TableAndSearch
                        rowkey={'id'}
                        columns={columns}
                        search={search}
                        url={'services/web/party/apply/getList'}
                        deleteBtn={delPowers ?{order:2,url:'services/web/party/apply/delete',field:''} : null}
                     />
                    <Modal
                      footer={null}
                      visible={this.state.isFile}
                      onCancel={this.handleCancel}
                    >
                     
                      {
                          // FileUrl?<a href={FileUrl} download={FileUrl}>{name}</a>:<h5>没有文件</h5>
                          <div>{fileList}</div>
                      }
                      
                    </Modal>
                  </Spin>    
            </div>
        );
    }



}