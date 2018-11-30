import React, { Component } from 'react';
import { Form, Row, Col, Checkbox, Input, InputNumber, DatePicker, Radio, Button, Table, Modal, Message } from 'antd';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import moment from 'moment';
import { connect } from 'react-redux';
// import './QuestionsSettings.less';
// import QuestionModal from './import_modal.js';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const { TextArea } = Input;
import './ApplyFields.less';
@Form.create()

@connect(
  state => ({
    powers: state.powers,
  }),
)
export default class ApplyFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fieldData: [],
      fields: [],
      attention: '',
    };
  }

  componentWillUnmount(){
    window.sessionStorage.removeItem('applyField');
  }

  componentDidMount(){
    //获取报名字段的数据
    getService(API_PREFIX + 'services/system/dictionary/enrollField/getList/1/10000', data => {
      if (data.retCode == 1) {
        console.log('报名字段', data.root.list);
        let result = [];
        for (let index = 0; index < data.root.list.length; index++) {
          let temp = data.root.list[index];
          let node = {};
          node.value = temp.id + '';
          node.label = temp.fieldName + '';
          result.push(node);
        }
        this.setState({
          fieldData: result,
        }, () => {
          console.log('fieldData', this.state.fieldData);
        });
      }
    });

    let value =  window.sessionStorage.getItem('applyField');
    let obj = JSON.parse(value);
    console.log('value',obj);
    if(obj != null) {
      this.setState({
        fields: obj.fields && obj.fields.split(','),
        attention: obj.attention,
      }, () => {
        console.log('fields', this.state.fields);
      });
    }
  }

  handleSubmit=(e)=>{
    //e.preventdefault();
    let value =  window.sessionStorage.getItem('applyField');
    let obj = JSON.parse(value);

    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        if(obj != null) {
          fieldsValue.id = obj.id;
        } else{
          fieldsValue.id = GetQueryString(location.hash, ['id']).id || '';
        }
        if(fieldsValue.fields&&fieldsValue.fields!==""&&fieldsValue.fields.length>0){
          fieldsValue.fields = fieldsValue.fields.toString();
          fieldsValue.typeid=2;
        }else{
          fieldsValue.fields=''
          fieldsValue.typeid=1;
        }
        console.log("fieldsValue",fieldsValue)
        
        console.log('提交结果', fieldsValue);
        postService(API_PREFIX + 'services/activity/signUpActivity/updateRegistryForm',fieldsValue, data => {
          if (data.retCode == 1) {
            console.log('++++++++++++++');
            location.hash = '/EventManagement/Apply/List';
            Message.success('修改成功');
            //history.back();  //极其不稳定
          }
        });
      }
    });
  }

  onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
    this.setState({
      fields:checkedValues,
    });
  }

  publish = () => {
    console.log('发布');
  }

  timedPublish = () => {
    this.setState({
      visible: true,
    });
    console.log('定时发布');
  }

  handleOk = () => {
    console.log('确定');
    this.setState({
      visible: false,
    });
  }

  handleCancel = () => {
    console.log('取消');
    this.setState({
      visible: false,
      key:this.state.key + 1,
    });
  }

  render() {
    const{ fieldData, fields, attention } = this.state;
    // let powers = this.props.powers;
    // console.log('权限码', powers);
    // let fieldManagementPowers = powers && powers['20001.21009.000'];
    // let updatePowers = powers && powers['20002.22001.002'];

    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
    return (
      <div className="ApplyFields">
        <Row> 
          <Col style={{color:'red',textAlign:"center",marginTop:"20px"}} span={24}> <span >提示：</span>您可选择以下字段设置报名表单，也可以自定义添加字段。 
          
            <a className="operation" onClick={()=>location.hash='/SystemSettings/Dictionary/Apply'}
              style={{ display: 'inline-block' }}>报名字段管理</a>

          </Col>
        </Row>
        {/*<div>
          <CheckboxGroup style={{ width: '100%' }} options={fieldData} value={fields} onChange={this.onChange} />
        </div>*/}

        <Form onSubmit={this.handleSubmit} style={{paddingTop:'20px'}}>
          <FormItem>
            {
              getFieldDecorator('fields', { initialValue: fields })
              ( <CheckboxGroup style={{ width: '100%' }} options={fieldData} value={fields} onChange={this.onChange} />
              )}
          </FormItem>


          <FormItem {...formItemLayout} label="报名须知">
            {
              getFieldDecorator('attention', { initialValue: attention })
              ( <TextArea rows={8} />
              )}
          </FormItem>

          <Row>
            <Col span={24} style={{textAlign:"center",marginBottom:"20px"}}>
            <Button className="resetBtn" onClick={() => history.back()}>取消</Button>
            <Button
              style={{
                display: 'none',
              }}
            >
            预览
            </Button>
            <Button htmlType="submit" className="queryBtn" type="primary"
              style={{ display: 'inline-block' }}>保存</Button>
            {/*  <Button className="queryBtn" onClick={this.publish.bind(this)}>发布</Button>
            <Button className="queryBtn" onClick={this.timedPublish.bind(this)}>定时发布</Button>*/}
            <Modal
              className="modal"
              title="定时发布"
              maskClosable={false} //点击蒙层是否允许关闭
              visible={this.state.visible}
              onCancel={() => this.setState({ visible:false})}
              key={'timedPublishModal'}
              footer={null}
              destroyOnClose={true}
            >
              <WrappedPubilshForm handleCancel={this.handleCancel} handleOk={this.handleOk} url={'services/system/hotWord/getList'} visible={this.state.visible} />
            </Modal>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}


class PubilshForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: this.props.visible,
      pageData:this.props.pageData,
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log('this.props.pageData',this.state.pageData);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.id = this.props.record.id;
        /*postService(API_PREFIX + 'services/system/hotWord/update', values, data => {
          if (data.retCode == 1) {
            Message.success('修改成功!');
            console.log('31132');
            this.props.getData(`${this.props.url}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
            this.setState({
              visible: false,
            }, () => {
              this.props.getVisible(this.state.visible);
            });
          } else {

          }
        });*/
      }
    });
  }
  render() {
    // console.log('record',this.props.record);
    const { getFieldDecorator } = this.props.form;
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
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem label="定时发布时间" {...formItemLayout}>
          {getFieldDecorator('pushDate', {
            initialValue: moment(new Date()),
            rules: [
              {
                type: 'object',
                required: true,
                whitespace: true,
                message: '必填项',
              },
            ],
          })(<DatePicker className="input" />)}
        </FormItem>
        <FormItem>
          <Button type="primary" className="resetBtn" onClick={this.props.handleCancel}>
                  取消
          </Button>
          <Button type="primary" htmlType="submit" className="queryBtn" onClick={this.props.handleOk} onOk={() => this.setState({ visible:false})}>
                  确定
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedPubilshForm = Form.create()(PubilshForm);