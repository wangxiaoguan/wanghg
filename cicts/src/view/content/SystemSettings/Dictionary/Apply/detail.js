/* eslint-disable no-self-assign */
import React, { Component } from 'react';
import { Button, Form, Input, Select, Row, Col,message, Message, InputNumber, Modal,Spin} from 'antd';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
const FormItem = Form.Item;
const Option = Select.Option;
import './detail.less';
import { onInput } from '../../../../../utils/ruleConfig';
import { specialCharacter } from '../../../../../utils/checkForm';
@Form.create()
export default class ApplyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteItem:{key:''},
      visible:false,
      FieldRequriedOption:[],
      FieldTypeOption:[],
      typeValue: 'FT1',
      inputNum: 4,
      inputOption: [{ key: 0, value: '' }, { key: 1, value: '' }, { key: 2, value: '' }, { key: 3, value: '' }],
      inputValue: [],
      isEdit: eval(GetQueryString(location.hash, ['isEdit', 'id']).isEdit)||false,
      id: GetQueryString(location.hash, ['isEdit', 'id']).id||'',
      FieldLength:'',
      loading:true,
      addIndex: 0,

    };
  }
  componentWillMount() {
      if(!this.state.isEdit) {
        getService(API_PREFIX + 'services/system/dictionary/enrollField/getCurrentMaxRootRank', data => {
            if (data.retCode === 1) {
                this.setState({addIndex: data.root.object})
              }
          });
      }
  }
  componentDidMount(){
    const { inputOption } = this.state;

   if(!this.state.isEdit){
    this.setState({inputValue:['','','','']});
   }
    // getService(API_PREFIX + 'services/lookup/init/enrollFieldType', data => {
    //   console.log('loockup', data);
    // });
    // getService(API_PREFIX + 'services/lookup/init/enrollFieldRequried', data => {
    //   console.log('loockup', data);
    // });
    this.setState({
      FieldTypeOption: [{
        key: 'FT1', value: '选项',
      }, {
        key: 'FT2', value: '字符串',
      }, {
        key: 'FT3', value: '数字',
      }],
      FieldRequriedOption: [{
        key: '1', value: '是',
      }, {
        key: '0', value: '否',
      }],
    });
    if (this.state.isEdit) {
      getService(API_PREFIX+`services/system/dictionary/enrollField/getDetailById/${this.state.id}`,data=>{
        setTimeout(
          this.setState({     
            loading:false,
          }),500);
        if (data.retCode===1) {
          console.log('具体内容',data);
          let value = data.root.object;
          this.props.form.setFieldsValue({ fieldName: value.fieldName, fieldType: value.fieldType, required: value.required, fieldLength: value.fieldLength});
          this.setState({   
            FieldLength:value.fieldLength,
          })
          if (value.fieldType!=='FT1') {
            this.setState({ typeValue: value.fieldType });
          } else {
            let inputValue = [];
            let inputOption = [];
            value.fieldOption.map((item, index) => {
              inputOption.push({key:index,value:''});
              inputValue.push({fieldName:item.fieldName,parentId:item.parentId,id:item.id, rank: item.rank}); // yelu 添加rank字段用于排序
              console.log('查看', 'option' + `${index}`);
            });
            this.setState({ inputValue, inputOption, inputNum: value.fieldOption.length },()=>{
              value.fieldOption.map((item,index)=>{
                this.props.form.setFieldsValue({
                  ['option' + `${index}`]: item.fieldName,
                }); 
              });
            });
          }     
        }else{
          Message.error('获取数据失败');
        }
      });
      
    }else {
        this.setState({ loading:false});
    }
  }

  // 修改yeyifu
  delete = (item) => {
    console.log('item',item);
    const {inputOption, inputNum, inputValue } = this.state;
    if (inputValue.length <= 2) {
      Message.error('请至少保留两个选项');
      return false;
    }
    console.log('eeeeeeeeeee==============', inputOption, inputValue);
    let indexof;
    inputOption.map((list,index)=>{
         if(list.key==item.key){
             indexof=item.key;
         } 
    });
    console.log("indexof==>",indexof);
    inputValue.splice(indexof,1);
    inputOption.splice(indexof,1);

    inputOption.map((item,index)=>{
      item.key=index;
    });

    console.log('DDDDDDDDDDDDDD==============', inputOption, inputValue);
    //  console.log("inputNum==>",inputNum);
   

 if(!this.state.isEdit){
  this.setState({
    inputOption,
    inputNum: inputNum - 1,
    inputValue,
    visible:false,
  },()=>{
    inputValue.map((item,index)=>{
      this.props.form.setFieldsValue({
        ['option' + `${index}`]: item.fieldName,
      }); 
    });
  });

 }else{
  inputValue.map((item,index)=>{
    item.rank=index+1;
  });
  this.setState({
    inputOption,
    inputNum: inputNum - 1,
    inputValue,
    visible:false,
  },()=>{
    inputValue.map((item,index)=>{
      this.props.form.setFieldsValue({
        ['option' + `${index}`]: item.fieldName,
      }); 
    });
  });
 }
  }
  add = () => {
    let inputOption = [];
    let  inputValue=this.state.inputValue;

    // inputValue[index] = this.state.isEdit ? { fieldName: e.target.value, parentId: this.state.id, id: inputValue[index]&&inputValue[index].id?inputValue[index].id:null, rank: inputValue[index]&&inputValue[index].rank?inputValue[index].rank:null} : { fieldName: e.target.value };
    for (let index = 0; index <= this.state.inputNum; index++) {
      inputOption.push({
        key: index,
        value: ''
      });
    }
    inputValue[this.state.inputNum]={fieldName:'', parentId:null, id:null, rank: null};

    console.log('SSSSSSSSSSSS============', inputOption, this.state.inputValue);
    this.setState({
      inputOption,
      inputNum: this.state.inputNum + 1
    });
  };
  isModal=(item)=>{
    if (this.state.isEdit) {
      this.setState({ visible: true, deleteItem:item});
    }else{
      this.delete(item);
    }
  }
  getOption=(option)=>{
    return option.map((item,index)=>{
      return <Option key={index} value={item.key}>
        {item.value}
      </Option>;
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
        console.log(err);
      if (!err) {
        const values = {
          ...fieldsValue, ...{fieldOption:[]},
        };
        console.log('提交',values);
        this.state.inputValue.map(item=>{
          if(JSON.stringify(item) != '{}') {
            values['fieldOption'].push(item);
          }
        });
        if (this.state.isEdit) {
          let body = {
            id: this.state.id,
            fieldName: values['fieldName'],
            fieldType: values['fieldType'],
            required: values['required'],
            fieldOption: values['fieldOption'],
            fieldLength: values['fieldLength'],
          };
          let oldOption = []
          let newOption = []
          values['fieldOption'] && body.fieldOption.forEach((item, index) => {
            if(item.id) {
                oldOption.push(item)
            }else {
                newOption.push(item)
            }
          })
          let maxRank = null
          if(oldOption.length > 0) {
            for(var i = 0; i < oldOption.length; i++) {
                maxRank = oldOption[i].rank
                for(var j = i + 1; j < oldOption.length; j++) {
                    if(maxRank < oldOption[j].rank) {
                        maxRank = oldOption[j].rank
                    }
                }
            }
          }else {
            maxRank = 0
          }
          newOption.map((item, i) => {
              return item['rank'] = maxRank + i + 1
          })
          body.fieldOption = [...oldOption, ...newOption]
          postService(API_PREFIX + 'services/system/dictionary/enrollField/update', body, data => {
            if (data.retCode === 1) {
              Message.success('修改成功');
              history.back();
            }
          });
        } else {
          let body=''
          if(values['fieldOption'].indexOf('')==-1){//不为空，有选项
             body = {
              fieldName: values['fieldName'],
              fieldType: values['fieldType'],
              required: values['required'],
              fieldOption: values['fieldOption'],
              fieldLength: values['fieldLength'],
              rank: this.state.addIndex + 1,
            };
            values['fieldOption'] && body.fieldOption.map((item, index) => {
              return item['rank'] = index + 1
            })
          }else{//为空,无选项
             body = {
              fieldName: values['fieldName'],
              fieldType: values['fieldType'],
              required: values['required'],
              fieldOption: [],
              fieldLength: values['fieldLength'],
              rank:1,
            };
          }
          postService(API_PREFIX + 'services/system/dictionary/enrollField/add', body, data => {
            if (data.retCode === 1) {
              Message.success('新增成功');
              history.back();
            }
          });
        }
      }
    });
  };
  handleChange(e, index) {
    const { inputValue } = this.state;  
    console.log("inputValue==>",inputValue,e);
    console.log("index",index);
    console.log("this.state.isEdit==>",this.state.isEdit);
    inputValue[index] = this.state.isEdit ? { fieldName: e.target.value, parentId: this.state.id, id: inputValue[index]&&inputValue[index].id?inputValue[index].id:null, rank: inputValue[index]&&inputValue[index].rank?inputValue[index].rank:null} : { fieldName: e.target.value };  // inputValue[index] = { fieldName: e.target.value };
    this.setState({ inputValue });
  }
  render() {
    const { typeValue, inputOption, inputNum, inputValue, FieldTypeOption, FieldRequriedOption } = this.state;
    // console.log('typeValue2222222=>',typeValue);
    const {form: { getFieldDecorator }} = this.props;
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 12 } };
    return    <Spin spinning={this.state.loading}> {this.state.loading==false?<div className="applyDetail">
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="字段名称">
          {getFieldDecorator('fieldName', {
            initialValue: '',
            rules: [{ required: true,validator: (rule, value, callback) => specialCharacter(rule, value, callback, '字段名称为必填项!', 'enrollField', this.state.id,null, {errorField:'最大长度为40个字符！',length:40}) },
                    { whitespace: true ,message: '输入内容不能全为空格'},
                   ],
          })(<Input/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="是否必填">
          {getFieldDecorator('required', {
            initialValue: '1',
            rules: [{ required: true, whitespace: true, message: '必填项' }],
          })(<Select getPopupContainer={trigger => trigger.parentNode}>
            {this.getOption(FieldRequriedOption)}
          </Select>)}
        </FormItem>
        <FormItem {...formItemLayout} label="字段类型">
          {getFieldDecorator('fieldType', {
            initialValue: 'FT1',
            rules: [{ required: true, whitespace: true, message: '必填项' }],
          })(<Select
            getPopupContainer={trigger => trigger.parentNode}
            onChange={value => this.setState({
              typeValue: value,
            })}>
            {this.getOption(FieldTypeOption)}
          </Select>)}
        </FormItem>
        {typeValue === 'FT1' ? <Row className="ant-form-item" style={{ marginBottom: '0px' }}>
          <Col span={4} className="ant-form-item-label">
            <label>
              <span className="ant-form-item-required">选项</span>
            </label>
          </Col>
          <Col span={12}>
            {inputOption.map(item => {
              return <div key={item.key} style={{ display: 'flex', flexDirection: 'row' }}>
                <FormItem style={{ width: '100%' }}>
                  {getFieldDecorator('option' + item.key, {
                    initialValue: item.value,
                    validateTrigger: ['onFocus', 'onChange'],
                    rules: [
                      {
                        required: true,
                        validator: (rule, value, callback) => specialCharacter(rule, value, callback, '选项为必填项,且最大长度为40个字符！', 'enrollField', null, { arrays: inputValue, index: item.key }, { errorField: '最大长度为40个字符！', length: 40 }),
                      },
                      { whitespace: true ,message: '输入内容不能全为空格'},
                    ],
                  })(<Input onChange={e => this.handleChange(e, item.key)} />)}
                </FormItem>
                <Button className="deleteBtn"  onClick={()=>this.isModal(item)} style={{ margin: '6px 0 0 6px' }}>
                    删除
                </Button>
                {/* </Popconfirm> */}
              </div>;
            })}
          </Col>

        </Row> : null}
        {typeValue !== 'FT1'? <FormItem {...formItemLayout} label="字段长度">
          {getFieldDecorator('fieldLength', {
            initialValue:this.state.FieldLength, rules: [
              {
                type:'number',
                required: true,
                whitespace: true,
                message: '字段长度为必填项,且只能为数字！',
              },
            ]})(<InputNumber min={0} max={9999999999} style={{width:'100%'}}/>)}
        </FormItem> : <Button className="queryBtn" onClick={this.add} style={{ display: 'block', marginLeft: '152px', marginBottom: '15px' }}>
            添加
        </Button>}
        <Button type="primary" style={{marginLeft:'275px',marginBottom:'130px'}} className="resetBtn" onClick={() => history.back()}>返回</Button>
        <Button type="primary" className="queryBtn" htmlType="submit">保存</Button>
      </Form>
     
      <Modal
        className="modal"
        title="警告"
        maskClosable={false}
        visible={this.state.visible}
        onOk={()=>this.delete(this.state.deleteItem)}
        onCancel={() => this.setState({ visible:false})}
        key={'warningModal'}
        destroyOnClose={true}
      >
      任何删除选项的行为，都可能导致其它业务出现错误,确定删除?
      </Modal>  
    </div>:null}
    </Spin>
  }
}