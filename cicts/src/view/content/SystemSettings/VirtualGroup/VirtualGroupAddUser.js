import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService,GetQueryString} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class VirtualGroupAddUser extends Component {
	constructor(props){
    super(props);
    this.state = {
      groupId:'',
      getUserListId:GetQueryString(location.hash,['groupId']).groupId,
    };
  }
  componentWillMount(){
    let param = GetQueryString(location.hash,['groupId']);
    this.setState({
      groupId:param.groupId,
    });
  }
  addUser = (groupId,key) => {
    // let values = {groupId:this.state.getUserListId,userIds:key};
    let valuesNumber={groupId:this.state.getUserListId,userIds:key};
    if(key.length!=0){
      postService(API_PREFIX + `services/web/company/group/batchInsertGroupUsers`,valuesNumber,data=>{//对针对已存在的用户添加接口判断
        if(data.status===1){
            message.success("添加成功");
            // location.hash = 'EnterpriseConfig/VirtualGroupUser?groupId='+`${this.state.groupId}`;
            this.getData(`services/web/company/group/getUserBeyondGroup/1/10?Q=groupId=${this.state.getUserListId}`);
        //   getService(API_PREFIX + `services/web/company/group/getUserBeyondGroup/1/10?Q=groupId=${this.state.getUserListId}`, data => {
        //     if (data.status == 1) {
        //     //   message.success("添加成功");
        //     //   location.hash = 'EnterpriseConfig/VirtualGroupUser?groupId='+`${this.state.groupId}`;
        //     } else {     
        //       message.error(data.retMsg);
        //     }
        //   });
        }else{
          message.error(data.retMsg);
        }
      });
    }else if(key.length==0){//当未勾选，直接点击添加时，给与报错提示xwx2019/3/12
      message.error("请选择要添加的用户");
    }
 
  }
  getData = async(url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
  render() {
  	const columns=[
      {
        title:'用户名',
        dataIndex:'name',
        key:'name',
      },
      {
        title:'手机号',
        dataIndex:'mobile',
        key:'mobile',
      },
      {
        title:'邮箱',
        dataIndex:'email',
        key:'email',
      },
      {
        title:'部门',
        dataIndex:'orgName',
        key:'orgName',
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
      },
    ];
    const search=[
      {key:'mobile',label:'手机号',qFilter:'Q=mobile',type:'input'},
      {key:'name',label:'姓名',qFilter:'Q=name',type:'input'},
    ];
    return (
    	<div className="virtualGroup">
	    	<TableAndSearch columns={columns} search={search}
             goBackBtn={{order:1,label:'返回',url:'EnterpriseConfig/VirtualGroupUser?groupId='+`${this.state.groupId}`}}  type='VirtualGroupNumber'
	           optionalBtn={{order:1,addUser:this.addUser,label:'添加'}}  url={`services/web/company/group/getUserBeyondGroup`}  urlfilter={`Q=groupId=${this.state.groupId}`}  groupId={this.state.groupId} goBack={{url:'EnterpriseConfig/VirtualGroupUser?groupId='+`${this.state.groupId}`}}
	           />
      </div>
    );
  }
}

export default VirtualGroupAddUser;
