import React, { Component } from 'react';
import TableAndSearch from '../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,Table,Divider,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {  BEGIN,getDataSource,getPageData } from '../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService,GetQueryString} from '../myFetch';
import API_PREFIX from '../apiprefix';
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
class versionManagement extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      key:100000,
      dataSource:[],
    };
  }
  showModal = (record) => {
    this.setState({
      visible: true,
      roleId:record.id,
    });
    getService(API_PREFIX + `services/web/system/edition/getEdition/` + record.id,data => {
        if (data.status == 1) {
          this.setState({
            dataSource:data.root.list,
          });
        }else{     
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
    location.hash = 'SystemSettings/DetailVersionManagement?flag=false&&isEdit=false&&roleId='+ record.id;
  }
  toEdit = (record) => {
    location.hash = 'SystemSettings/EditVersionManagement?flag=false&&isEdit=true&&roleId='+ record.id;
  }
  getCheckboxProps =  record => ({
        disabled: record.level == '1', 
        level: record.level,
  })
  render() {
    let powers = this.props.powers;
    let hasAddPower = powers && powers['20006.21408.001'];//新建
    let hasDelPower = powers && powers['20006.21408.004'];//删除
    const columns=[
      {
        title:'版本名称',
        dataIndex:'name',
        key:'name',
      },
      {
        title:'版本描述',
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
              <a className='operation' onClick={this.toView.bind(this,record)}>
                查看详情
              </a>
              {
                record.level != 1 
                ? <span>
                      <Divider type="vertical" />
                      <a className='operation' onClick={this.toEdit.bind(this,record)}>
                      权限设置
                      </a>
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
        dataIndex:'lastname',
        key:'lastname',
      },
      {
        title:'用户账号',
        dataIndex:'acount',
        key:'acount',
      },
    ];
    return <div>
      <TableAndSearch getCheckboxProps={this.getCheckboxProps} columns={columns} url={'services/web/system/edition/editionList/get'} addBtn={hasAddPower?{order:1,url:'SystemSettings/AddVersionManagement?flag=true'}:null} deleteBtn={hasDelPower?{order:2}:null} delUrl={'services/web/system/edition/delete'} />
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
        <Table columns={columnsRolePermissions} dataSource={this.state.dataSource} />
        <Button className="queryBtn" type="primary" style={{marginLeft:"190px"}} onClick={this.handleOk.bind(this)}>确定</Button> 
      </Modal>
    </div>;
  }
}

export default versionManagement;
