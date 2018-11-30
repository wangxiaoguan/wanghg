import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select} from 'antd';
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
      groupId:''
    }
  }
  componentWillMount(){
    let param = GetQueryString(location.hash,['groupId']);
    console.log("param",param)
    this.setState({
      groupId:param.groupId
    })
  }
  addUser = (groupId,key) => {
    var values = {groupId:groupId,memberIds:key}
    postService(API_PREFIX + `services/system/virtualGroup/addMembers`,values, data => {
      if (data.retCode == 1) {

      } else {     
        
      }
    });
  }
  getData = async(url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
  render() {
  	const columns=[
      {
        title:'用户名',
        dataIndex:'acount',
        key:'acount'
      },
      {
        title:'用户姓名',
        dataIndex:'lastName',
        key:'lastName'
      },
      {
        title:'邮箱',
        dataIndex:'email',
        key:'email'
      },
      {
        title:'部门',
        dataIndex:'orgName',
        key:'orgName'
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate'
      }
    ];
    const search=[
      {key:'acount',label:'手机号',qFilter:'Q=acount_S_LK',type:'input'}
    ];
    return (
    	<div className="virtualGroup">
	    	<TableAndSearch columns={columns} search={search}
             goBackBtn={{order:1,label:'返回',url:'SystemSettings/VirtualGroupUser?groupId='+`${this.state.groupId}`}}  
	           optionalBtn={{order:1,addUser:this.addUser,label:'添加'}}  url={'services/system/virtualGroup/getUserList'}  groupId={this.state.groupId} goBack={{url:'SystemSettings/VirtualGroupUser?groupId='+`${this.state.groupId}`,}}
	          >
	      </TableAndSearch>
      </div>
    );
  }
}

export default VirtualGroupAddUser;
