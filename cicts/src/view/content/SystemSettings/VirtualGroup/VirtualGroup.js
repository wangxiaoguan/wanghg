import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,Divider,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService,GetQueryString} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import './virtualgrounp.less';
import {ImportPart} from '../../PartyBuildGarden/PartyMembers/PartyMembers';
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
      key:1000,
      isback: GetQueryString(location.hash, ['back']).back || '',
    };
  }

componentWillMount(){
  localStorage.setItem('selectedRowKeys','');
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
      key:this.state.key + 1,
    });
  }
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  editHotWordName =(record) => {
    console.log(record);
    this.setState({
      visible: true,
      record:record,
      flag:true,
      key:this.state.key + 1,
    });
  }
  getData = async(url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
  getVisible = (visible) => {
    this.setState({
      visible:visible,
    });
  }
  redirectHash = (record) => {
  	location.hash = '/EnterpriseConfig/VirtualGroupUser?groupId='+ `${record.id}`;
  }
  render() {
    let powers=this.props.powers;
    console.log('权限码', powers);
    let hasAddPower=powers&&powers['20004.21505.001'];
    let hasEditPower=powers&&powers['20004.21505.002'];
    let hasFindPower=powers&&powers['20004.21505.003'];
    let hasDelPower=powers&&powers['20004.21505.004'];
   
    // let hasAddPower=true;
    // let hasDelPower=true;
    // let hasEditPower=true;
  	const columns=[
      {
        title:'群名称',
        dataIndex:'name',
        key:'name',
      },
      {
        title:'群简介',
        dataIndex:'intro',
        key:'intro',
      },
      // {
      //   title:'群类型',
      //   dataIndex:'groupType',
      //   key:'groupType',
      //   render:(data,record) => {
      //     if(record.type === 1){
      //       return '班车圈';
      //     }else if(record.type === 2){
      //       return '工作圈';
      //     }else if(record.type === 3){
      //       return '虚拟圈';
      //     }else if(record.type === 4){
      //       return '单聊';
      //     }else if(record.type === 5){
      //       return '生活圈';
      //     }else if(record.type === 6){
      //       return '提醒小助手';
      //     }else if(record.type === 7){
      //       return '文件小助手圈';
      //     }else if(record.type === 8){
      //       return '签到小助手';
      //     }
      //   },
      // },
      {
        title:'创建人',
        dataIndex:'createUserName',
        key:'createUserName',
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
      },
      {
        title:'操作',
        dataIndex:'x',
        key:'x',
        render:(data,record)=>(
            <div>
              <a disabled={!hasEditPower} className='operation' onClick={this.editHotWordName.bind(this,record)}>编辑</a>
              <Divider type="vertical" />
              <a className='operation' onClick={this.redirectHash.bind(this,record)}>群成员管理</a>
            </div>
        ),
      },

    ];
    const search=[
      {key:'name',label:'群名称',qFilter:'Q=name',type:'input'},
    ];
    return (
    	<div className="virtualGroup">
	    	<TableAndSearch columns={columns} search={hasFindPower?search:''}
	           addBtn={hasAddPower?{order:1,OnEvent:this.showModal}:null}  deleteBtn={hasDelPower?{order:2}:null} url={'services/web/company/group/getGroupList'} 
             delUrl={'services/web/company/group/batchDeleteGroup'}
             getCheckboxProps={(record) => ({disabled: record.groupType == 1,
             })} type="virtualGroupBack" />
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
            <WrappedNormalLoginForm getData={this.getData} handleCancel={this.handleCancel} record={this.state.record} flag={this.state.flag} url={'services/web/company/group/getGroupList'} visible={this.state.visible} getVisible={this.getVisible}
            pageData={this.props.pageData} flagForm={this.state.flag}/>
          </Modal>
          {this.state.isback === '1' ?
            <Button className="resetBtn" type="primary" onClick={() => {
                sessionStorage.setItem('eventAndInfoKey', 1);// yelu 设置从查看权限设置点击进来时，返回后保存tab对应的key值
                history.back();}}>
              返回
            </Button> : null}
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
      optionData:[],
    };
  }
  componentWillMount(){
    // getService(API_PREFIX + `services/lookup/init/VirtualGroup`, data => {
    //       this.setState({
    //         optionData:[data[2]],//接口里面之前是取data,现只取虚拟圈的数据并转化为数组[data[2]],xwx2019/3/12
    //       });
    //   });
    // if(this.props.flag) {
    //     getService(API_PREFIX + `services/web/company/group/getGroupById/${this.props.record.id}`, res => {

    //     })
    // }
    
  }
  handleChange = (value) => {
	  console.log(`selected ${value}`);
	}
  handleSubmit = (e) => {
    e.preventDefault();
    console.log("this.props.pageData",this.state.pageData, this.props);
    this.props.form.validateFields((err, values) => {
    // 	if(values.groupType == '班车圈'){
    //   	values.groupType = '1';
    //   }else if(values.groupType == '工作圈'){
    //   	values.groupType = '2';
    //   }else if(values.groupType == '生活圈'){
    //   	values.groupType = '5';
    //   }else if(values.groupType == '虚拟圈'){
    //   	values.groupType = '3';
    //   }
    console.log('Received values of form: ', err, values);
      if (!err) {
        console.log('Received values of form11111111111: ', values);
        if(this.props.flag){
          values.id = this.props.record.id;
          postService(API_PREFIX + `services/web/company/group/updateGroup`,values, data => {
            if (data.status == 1) {
              console.log("31132");
              message.success("修改成功!");
              this.props.getData(`${this.props.url}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
              },() => {
                this.props.getVisible(this.state.visible);
              });
            }
          });
        }else{
          postService(API_PREFIX + `services/web/company/group/addGroup`,values, data => {
            if (data.status == 1) {
              message.success("新增成功!");
              this.props.getData(`${this.props.url}/1/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
              },() => {
                this.props.getVisible(this.state.visible);
              });
            }
          });
        }
      }
    });
  }
  handleConfirmPassword = (rule, value, callback) => {
      if(this.props.flag){
        if(value == ''){
          this.setState({
            validUserno:{
              retCode:1,
            },
          });
           callback([new Error("群组名称不能为空!")]);
        }else{
          getService(API_PREFIX + `services/web/company/group/checkGroupDuplicate?Q=name=${value}&Q=id=${this.props.record.id}`, data => {
              if(data.root.object){
                this.setState({
                    validUserno:{
                      retCode:0,
                    },
                });
                callback();
              }else{
                 this.setState({
                    validUserno:{
                      retCode:1,
                    },
                  });
                callback([new Error("群组名称已存在请勿重复添加!")]);
              }
              //callback()
          });
        }
      }else{
         if(value == ''){
          this.setState({
            validUserno:{
              retCode:1,
            },
          });
           callback([new Error("群组名称不能为空!")]);
        }else{
          getService(API_PREFIX + `services/web/company/group/checkGroupDuplicate?Q=name=${value}`, data => {
              if(data.root.object){
                this.setState({
                    validUserno:{
                      retCode:0,
                    },
                });
                callback();
              }else{
                 this.setState({
                    validUserno:{
                      retCode:1,
                    },
                  });
                callback([new Error("群组名称已存在请勿重复添加!")]);
              }
              //callback()
          });
        }
      }
      
     
  }
  render() {
    console.log("record",this.props.record);
    const { getFieldDecorator } = this.props.form;
    if(this.props.flag){
      var name = this.props.record.name;
      var intro = this.props.record.intro;
      if(this.props.record.groupType == 1){
      	var groupType = '班车圈';
      }else if(this.props.record.groupType == 2){
      	var groupType = '工作圈';
      }else if(this.props.record.groupType == 5){
      	var groupType = '生活圈';
      }else if(this.props.record.groupType == 3){
      	var groupType = '虚拟圈';
      }
      var isNick = this.props.record.isNick;
      var autoSign = this.props.record.autoSign;
      var canDraw = this.props.record.canDraw;
    }else{
      var name = '';
      var intro = '';
      // var groupType = '工作圈'
      var groupType='虚拟圈';//默认虚拟圈xwx2019/3/12
      var isNick = true;
      var autoSign = true;
      var canDraw = true;
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
              validator: this.handleConfirmPassword,
            }],initialValue:name,
          })(
            <Input placeholder="请输入群名称" />
          )}
        </FormItem>
        <FormItem label="群简介" {...formItemLayout}>
          {getFieldDecorator('intro', {
            rules: [{ required: true, message: '请输入群简介,且最长为20个字符！',max:20 }],initialValue:intro,
          })(
            <Input placeholder="请输入群简介" />
          )}
        </FormItem>
        {/* <FormItem label="群类型" {...formItemLayout}>
          {getFieldDecorator('groupType', {
            rules: [{ required: true, message: '请选择群类型'}],initialValue:groupType,
          })(
            <Select style={{ width: 120 }} onChange={this.handleChange} disabled={this.props.flagForm?true:false}>
				      {
				      	this.state.optionData.map((item,index) => {
				      		return <Option key={index} value={item.code}>{item.desp}</Option>;
				      	})
				      }
				    </Select>
          )}
        </FormItem>
        <FormItem label="是否允许匿名聊天" {...formItemLayout}>
          {getFieldDecorator('isNick', {
            rules: [{ required: true, message: '请选择是否允许匿名聊天' }],
            initialValue:isNick,
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
            initialValue:autoSign,
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
            initialValue:canDraw,
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </RadioGroup>
          )}
        </FormItem> */}
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
