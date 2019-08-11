import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,Divider,Message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
import './virtualgrounp.less';
import {ImportPart} from '../PartyMembers/PartyMembers';
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
class VirtualGroup extends Component {
	constructor(props){
    super(props);
    this.state = {
      visible: false,
      value: true,
      record:{},
      flag:true,
      key:1000
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
      flag:false,
      key:this.state.key + 1,
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
      key:this.state.key + 1
    });
  }
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  editHotWordName =(record) => {
    console.log(record)
    this.setState({
      visible: true,
      record:record,
      flag:true,
      key:this.state.key + 1
    });
  }
  getData = async(url) => {
    await this.props.getData(ServiceApi + `${url}`);
  }
  getVisible = (visible) => {
    this.setState({
      visible:visible
    })
  }
  redirectHash = (record) => {
  	location.hash = '/SystemSettings/VirtualGroupUser?groupId='+ `${record.id}`
  }
  render() {
    let powers=this.props.powers;
    console.log('权限码', powers);
    let hasAddPower=powers&&powers['20001.21006.001'];
    let hasDelPower=powers&&powers['20001.21006.004'];
    let hasEditPower=powers&&powers['20001.21006.002'];
  	const columns=[
      {
        title:'群名称',
        dataIndex:'name',
        key:'name'
      },
      {
        title:'群简介',
        dataIndex:'groupIntroduction',
        key:'groupIntroduction'
      },
      {
        title:'群类型',
        dataIndex:'groupType',
        key:'groupType',
        render:(data,record) => {
          if(record.groupType == 1){
            return '班车圈'
          }else if(record.groupType == 2){
            return '工作圈'
          }else if(record.groupType == 5){
            return '生活圈'
          }else if(record.groupType == 3){
            return '虚拟圈'
          }
        }
      },
      {
        title:'创建人',
        dataIndex:'createUserName',
        key:'createUserName'
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate'
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(data,record)=>(
            <div>
              <a disabled={!hasEditPower} className='operation' onClick={this.editHotWordName.bind(this,record)}>编辑</a>
              <Divider type="vertical" />
              <a className='operation' onClick={this.redirectHash.bind(this,record)}>群成员管理</a>
            </div>
        ),
      }

    ];
    const search=[
      {key:'name',label:'群名称',qFilter:'Q=name_S_LK',type:'input'}
    ];
    return (
    	<div className="virtualGroup">
	    	<TableAndSearch columns={columns} search={search}
	           addBtn={hasAddPower?{order:1,OnEvent:this.showModal}:null}  deleteBtn={hasDelPower?{order:2}:null} url={'services/system/virtualGroup/getList'} 
	           delUrl={'services/system/virtualGroup/delete'}
	          >
	      </TableAndSearch>
	      <Modal
            title={this.state.flag ? "编辑群组" :"添加群组" }
            maskClosable={false}//点击蒙层是否关闭
            footer={null}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            key={this.state.key}
            className="virtualGroup modal"
          >
            <WrappedNormalLoginForm getData={this.getData} handleCancel={this.handleCancel} record={this.state.record} flag={this.state.flag} url={'services/system/virtualGroup/getList'} visible={this.state.visible} getVisible={this.getVisible}
            pageData={this.props.pageData}/>
          </Modal>
      </div>
    );
  }
}

class NormalLoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: this.props.visible,
      pageData:this.props.pageData,
      optionData:[]
    }
  }
  componentWillMount(){
  }
  handleChange = (value) => {
	}
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {});
  }
  handleConfirmPassword = (rule, value, callback) => {}
  render() {

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {labelCol: {xs: { span: 24 },sm: { span: 10 }},wrapperCol: {xs: { span: 24 },sm: { span: 14 }}};
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="群名称" {...formItemLayout}>
          {
            getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入群名称,且最长为20个字符！',max:20 }, {
              validator: this.handleConfirmPassword
            }],initialValue:''
          })(
            <Input placeholder="请输入群名称" />
          )}
        </FormItem>
        <FormItem label="群简介" {...formItemLayout}>
          {getFieldDecorator('groupIntroduction', {
            rules: [{ required: true, message: '请输入群名称,且最长为20个字符！',max:20 }],initialValue:''
          })(
            <Input placeholder="请输入群简介" />
          )}
        </FormItem>
        <FormItem label="群类型" {...formItemLayout}>
          {getFieldDecorator('groupType', {
            rules: [{ required: true, message: '请选择群类型'}],initialValue:''
          })(
            <Select style={{ width: 120 }} onChange={this.handleChange}>
				      {
				      	this.state.optionData.map((item,index) => {return <Option key={index} value={item.code}>{item.desp}</Option>})
				      }
				    </Select>
          )}
        </FormItem>
        <FormItem label="是否允许匿名聊天" {...formItemLayout}>
          {getFieldDecorator('isNick', {
            rules: [{ required: true, message: '请选择是否允许匿名聊天' }],
            initialValue:false
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem>
          <Button style={{marginLeft:'150px'}} className='resetBtn' type="primary" onClick={this.props.handleCancel}>
            返回
          </Button>
          <Button className='queryBtn' type="primary" htmlType="submit">
            保存
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default VirtualGroup;
