import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,Divider,Message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
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
    await this.props.getData(API_PREFIX + `${url}`);
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
    getService(API_PREFIX + `services/lookup/init/VirtualGroup`, data => {
      this.setState({
      	optionData:data
      })
    });
  }
  handleChange = (value) => {
	  console.log(`selected ${value}`);
	}
  handleSubmit = (e) => {
    e.preventDefault();
    console.log("this.props.pageData",this.state.pageData)
    this.props.form.validateFields((err, values) => {
    	if(values.groupType == '班车圈'){
      	values.groupType = '1'
      }else if(values.groupType == '工作圈'){
      	values.groupType = '2'
      }else if(values.groupType == '生活圈'){
      	values.groupType = '5'
      }else if(values.groupType == '虚拟圈'){
      	values.groupType = '3'
      }
      if (!err) {
        console.log('Received values of form: ', values);
        if(this.props.flag){
          values.id = this.props.record.id;
          postService(API_PREFIX + `services/system/virtualGroup/update`,values, data => {
            if (data.retCode == 1) {
              console.log("31132")
              Message.success("修改成功!")
              this.props.getData(`${this.props.url}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false
              },() => {
                this.props.getVisible(this.state.visible)
              })
            } else {     
              
            }
          });
        }else{
          postService(API_PREFIX + `services/system/virtualGroup/add`,values, data => {
            if (data.retCode == 1) {
              Message.success("新增成功!")
              this.props.getData(`${this.props.url}/1/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false
              },() => {
                this.props.getVisible(this.state.visible)
              })
            } else {     
              
            }
          });
        }
      }
    });
  }
    handleConfirmPassword = (rule, value, callback) => {
      console.log("values",value)
      if(this.props.flag){
        if(value == ''){
          this.setState({
            validUserno:{
              retCode:1,
            }
          });
           callback()
        }else{
          postService(API_PREFIX + `services/system/virtualGroup/check/name`,{"id":this.props.record.id,"name":value}, data => {
              if(data.retType==0){
                this.setState({
                    validUserno:{
                      retCode:0,
                    }
                });
                callback()
              }else{
                 this.setState({
                    validUserno:{
                      retCode:1,
                    }
                  });
                callback([new Error("群组名称已存在请勿重复添加!")])
              }
              //callback()
          })
        }
      }else{
         if(value == ''){
          this.setState({
            validUserno:{
              retCode:1,
            }
          });
           callback()
        }else{
          postService(API_PREFIX + `services/system/virtualGroup/check/name`,{"id":"961498126489","name":value}, data => {
              if(data.retType==0){
                this.setState({
                    validUserno:{
                      retCode:0,
                    }
                });
                callback()
              }else{
                 this.setState({
                    validUserno:{
                      retCode:1,
                    }
                  });
                callback([new Error("群组名称已存在请勿重复添加!")])
              }
              //callback()
          })
        }
      }
      
     
  }
  render() {
    console.log("record",this.props.record)
    const { getFieldDecorator } = this.props.form;
    if(this.props.flag){
      var name = this.props.record.name
      var groupIntroduction = this.props.record.groupIntroduction
      if(this.props.record.groupType == 1){
      	var groupType = '班车圈'
      }else if(this.props.record.groupType == 2){
      	var groupType = '工作圈'
      }else if(this.props.record.groupType == 5){
      	var groupType = '生活圈'
      }else if(this.props.record.groupType == 3){
      	var groupType = '虚拟圈'
      }
      var isNick = this.props.record.isNick
      var autoSign = this.props.record.autoSign
      var canDraw = this.props.record.canDraw
    }else{
      var name = ''
      var groupIntroduction = ''
      var groupType = '工作圈'
      var isNick = true
      var autoSign = true
      var canDraw = true
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="群名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入群名称,且最长为20个字符！',max:20 }, {
              validator: this.handleConfirmPassword
            }],initialValue:name
          })(
            <Input placeholder="请输入群名称" />
          )}
        </FormItem>
        <FormItem label="群简介" {...formItemLayout}>
          {getFieldDecorator('groupIntroduction', {
            rules: [{ required: true, message: '请输入群名称,且最长为20个字符！',max:20 }],initialValue:groupIntroduction
          })(
            <Input placeholder="请输入群简介" />
          )}
        </FormItem>
        <FormItem label="群类型" {...formItemLayout}>
          {getFieldDecorator('groupType', {
            rules: [{ required: true, message: '请选择群类型'}],initialValue:groupType
          })(
            <Select style={{ width: 120 }} onChange={this.handleChange}>
				      {
				      	this.state.optionData.map((item,index) => {
				      		return <Option key={index} value={item.code}>{item.desp}</Option>
				      	})
				      }
				    </Select>
          )}
        </FormItem>
        <FormItem label="是否允许匿名聊天" {...formItemLayout}>
          {getFieldDecorator('isNick', {
            rules: [{ required: true, message: '请选择是否允许匿名聊天' }],
            initialValue:isNick
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="扫码加圈是否自动签到" {...formItemLayout}>
          {getFieldDecorator('autoSign', {
            rules: [{ required: true, message: '请选择扫码加圈是否自动签到' }],
            initialValue:autoSign
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="是否可抽奖" {...formItemLayout}>
          {getFieldDecorator('canDraw', {
            rules: [{ required: true, message: '请选择是否可抽奖' }],
            initialValue:canDraw
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
