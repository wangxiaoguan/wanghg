import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,Divider,Table,message,Spin} from 'antd';
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
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class RolePermissions extends Component {
	constructor(props){
    super(props);
    this.state = {
      visible: false,
      key:100000,
      dataSource:[],
      roleId:'',
      total:0,
      spin:false,
    };
  }
	showModal = (record) => {
    this.setState({
      visible: true,
      roleId:record.id,
    },()=>{
      this.roleUser(this.state.roleId,1,10);
    });
  }

  //查询角色用户分页
  changePage=(page)=>{
    let {roleId}=this.state;
    this.roleUser(roleId,page,10);
  }

  //查看角色用户接口
  roleUser=(record,page,pageSize)=>{
    this.setState({spin:true});
    getService(API_PREFIX + `services/web/role/user/get/${record}/${page}/${pageSize}`,data => {
    if (data.status == 1) {
      if(data.root.list){
        let list=data.root.list.filter(item=>{
          return item&&item.id&&item.id>0;
        });
        list.map((item, index) => {
            item.sNum = index + 1+(page-1)*10;
        });
        console.log('------list-----', list);
        this.setState({
          dataSource:list,
          total:data.root.totalNum,
          spin:false,
        });
      }else if(JSON.stringify(data.root)==='{}'){
        this.setState({spin:false});
      }else{
        this.setState({spin:false});
      }
     
    }else{     
      this.setState({spin:false});
      message.error(data.errorMsg);
    }
});
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  toView = (record) => {
  	location.hash = 'EnterpriseConfig/DetailRolePermissions?flag=false&&isEdit=false&&roleId='+ record.id;
  }
  toEdit = (record) => {
  	location.hash = 'EnterpriseConfig/EditRolePermissions?flag=false&&isEdit=true&&roleId='+ record.id;
  }
  getCheckboxProps =  record => ({
        disabled: record.level == '1' || record.isUsing > 0, 
        level: record.level,
  })
  render() {
    let powers=this.props.powers;
    let hasAddPower=powers&&powers['20004.21503.001'];//新建
    let hasDelPower=powers&&powers['20004.21503.004'];//删除
    let hasEditPower=powers&&powers['20004.21503.002'];//编辑
  	const columns=[
      {
        title:'角色名称',
        dataIndex:'name',
        key:'name',
      },
      {
        title:'角色描述',
        dataIndex:'desp',
        key:'desp',
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(data,record)=>(
            <div>
              <a className='operation' onClick={this.showModal.bind(this,record)}>
                查看角色用户
              </a>
              <Divider type="vertical" />
              <a className='operation' onClick={this.toView.bind(this,record)}>
                查看角色权限
              </a>
              {
              	record.level != 1 
              	?   <span>
                      <Divider type="vertical" />
                      <a disabled={!hasEditPower} className='operation' onClick={this.toEdit.bind(this,record)}>
                        权限设置</a>
                    </span>
                : null
              }
            </div>
        ),
      },
    ];
    const columnsRolePermissions=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title:'姓名',
        dataIndex:'name',
        key:'name',
      },
      {
        title:'用户账号',
        dataIndex:'acount',
        key:'acount',
      },
    ];
    return <div>
    	<TableAndSearch getCheckboxProps={this.getCheckboxProps} columns={columns} url={'services/web/role/roleList/get'} addBtn={hasAddPower?{order:1,url:'EnterpriseConfig/AddRolePermissions?flag=true'}:null} deleteBtn={hasDelPower?{order:2}:null} delUrl={'services/web/role/delete'} />
      <Modal
        title="角色名称—角色用户"
        maskClosable={false}//点击蒙层是否关闭
        footer={null}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        key={this.state.key}
      >
        {/*<TableAndSearch columns={columnsRolePermissions} url={'services/systemA/role/user/' + this.state.roleId}>
        </TableAndSearch>*/}
        <Spin spinning={this.state.spin}>
	      <Table bordered pagination={{onChange:this.changePage,total:this.state.total}} columns={columnsRolePermissions} dataSource={this.state.dataSource} />
        </Spin>
        <Button className="queryBtn" type="primary" style={{marginLeft:"190px"}} onClick={this.handleOk.bind(this)}>确定</Button> 
      </Modal>
    </div>;
  }
}

export default RolePermissions;
