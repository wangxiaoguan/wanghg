import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import './popularWord.less';
import {postService,getService} from '../../myFetch';
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
class PopularWords extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      value: true,
      record:{},
      flag:true,
      key:100,
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
      flag:false,
      key:this.state.key + 1,
    });
  }
  handleOk = (e) => {
    console.log("e==>",e);
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
  render() {
    let powers=this.props.powers;
    console.log('权限码', powers);
    let hasAddPower=powers&&powers['20003.21406.001'];//新建
    let hasDelPower=powers&&powers['20003.21406.004'];//删除
    let hasEditPower=powers&&powers['20003.21406.002'];//编辑
    console.log("this.props.pageData",this.props.pageData);
    const columns=[
      {
        title:'热词名称',
        dataIndex:'hotWordName',
        key:'hotWordName',
        // width:900
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        // width:500
      },
      {
        title:'是否优先显示',
        dataIndex:'show',
        key:'show',
        // width:400,
        render: (text, record) => {
          if(record.show == true){
            return <span>是</span>;
          }else {
            return <span>否</span>;
          }
        },
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        // width:300,
        render:(data,record)=>(
            <div>
              <a disabled={!hasEditPower} className='operation' onClick={this.editHotWordName.bind(this,record)}>编辑</a>
            </div>
        ),
      },

    ];
    const search=[
      {key:'hotWordName',label:'热词名称',qFilter:'Q=hotWordName',type:'input'},
    ];
    return (
        <div>
          <TableAndSearch columns={columns} search={search}
           type="PopularWords"
           addBtn={hasAddPower?{order:1,OnEvent:this.showModal}:null}  deleteBtn={hasDelPower?{order:2}:null} url={'services/web/config/hotWord/getList'}
           delUrl={'services/web/config/hotWord/delete'}
           />
          <Modal
            title={this.state.flag ? "编辑热词" : "新建热词"}
            maskClosable={false}//点击蒙层是否关闭
            footer={null}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            key={this.state.key}
            className="modal"
          >
            <WrappedNormalLoginForm getData={this.getData} handleCancel={this.handleCancel} record={this.state.record} flag={this.state.flag} url={'services/web/config/hotWord/getList'} visible={this.state.visible} getVisible={this.getVisible}
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
      validUserno:{},
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log("this.props.pageData",this.state.pageData);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if(this.props.flag){
          values.id = this.props.record.id;
          postService(API_PREFIX + `services/web/config/hotWord/update`,values, data => {
            if (data.status == 1) {
              message.success("修改成功!");
              console.log("31132");
              this.props.getData(`${this.props.url}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
              },() => {
                this.props.getVisible(this.state.visible);
              });
            } else {     
              message.error(data.errorMsg);
            }
          });
        }else{
          console.log("values==>",values);
          postService(API_PREFIX + `services/web/config/hotWord/add`,values, data => {
            console.log('data==>',data);
            if (data.status == 1) {
              message.success("新增成功!");
              console.log("31132");
              this.props.getData(`${this.props.url}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
              },() => {
                this.props.getVisible(this.state.visible);
              });
            } else {     
              message.error(data.errorMsg);
            }
          });
        }
      }
    });
  }
  //唯一性校验
  onblur = (e) => {
    postService(API_PREFIX + `services/web/config/hotWord/check/name`,{"hotWordName":e.target.value}, data => {
      if(data.root.object.retType==true){//不存在
        this.setState({
          validUserno:{
            retCode:0,
            retMsg:data.root.object.retMsg,
          },
        });
      }else{//存在
        this.setState({
          validUserno:{
            retCode:1,
            retMsg:data.root.object.retMsg,
          },
        });
      }
    });
  }
  onfocus = () => {
     this.setState({
          validUserno:{
            retCode:0,
            retMsg:'',
          },
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
           callback();
        }else{
          postService(API_PREFIX + `services/web/config/hotWord/check/name`,{"id":this.props.record.id,"hotWordName":value}, data => {
              if(data.root.object.retType==true){
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
                callback([new Error("热词名称已存在请勿重复添加!")]);
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
           callback();
        }else{
          postService(API_PREFIX + `services/web/config/hotWord/check/name`,{"hotWordName":value}, data => {
              if(data.root.object.retType==true){
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
                callback([new Error("热词名称已存在请勿重复添加!")]);
              }
              //callback()
          });
        }
      }
     // console.log("values",value)
     
     
  }
  render() {
    console.log("record",this.props);
    let hotname='';
    if(this.props.flag){
      hotname=this.props.record.hotWordName;
    }
    const { getFieldDecorator } = this.props.form;
    if(this.props.flag){
      var hotWordName = this.props.record.hotWordName;
      var show = this.props.record.show;
    }else{
      var hotWordName = '';
      var show = true;
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem 
        label="热词关键字" 
        validateStatus={this.state.validUserno.retCode=='1'?'error':'success'}
        {...formItemLayout}>
          {getFieldDecorator('hotWordName', {
            rules: [{ required: true, message: '请输入热词关键字,且最长为20个字符！',max:20 }, {
              validator: this.handleConfirmPassword,
            }],
            initialValue:hotname,
          })(
            <Input placeholder="请输入热词关键字" />
          )}
        </FormItem>
        <FormItem label="是否优先显示" {...formItemLayout1}>
          {getFieldDecorator('show', {
            rules: [{ required: true, message: '请选择是否显示热词关键字' }],
            initialValue:show,
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem>
          <Button style={{marginLeft:"145px"}} type="primary" className='resetBtn' onClick={this.props.handleCancel}>
            返回
          </Button>
          <Button type="primary" htmlType="submit" className='queryBtn'>
            保存
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default PopularWords;
