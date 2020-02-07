import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../redux-root/action/table/table';
import { Form, Row, Col, Input, InputNumber, Select, Radio, Cascader, Divider, Button, message, Table} from 'antd';
import {RuleConfig} from  '../../ruleConfig';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
// import './CarouselDetail.less';

@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)),
    retSetData: n=>dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
@Form.create()
class AlterPoint extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataInfo: this.props.dataInfo,
      flag: this.props.flag, //point-经验值；treasure-积分
    };
  }

  componentDidMount(){

  }

  //表单提交处理函数
  handleSubmit= e => {
    //阻止默认表单事件
    e.preventDefault();
    const {dataInfo,flag} = this.state;
    this.props.form.validateFields((err, fieldsValue) =>{
      if(err){
        return;
      }

      // const values = {
      //   ...fieldsValue,
      //   'userid': this.state.dataInfo.userid,
      //   'level': this.state.dataInfo.level ? this.state.dataInfo.level : 1,
      //   'point': this.state.dataInfo.point,
      //   'treasure': this.state.dataInfo.treasure,
      // };
      let values = {...dataInfo,...fieldsValue,createUserId:dataInfo.id,createUserName:dataInfo.name};
      values['tenantId'] = window.sessionStorage.getItem('tenantId')
      if(flag == 'point'){ //经验值变更
        postService(API_PREFIX + 'services/web/point/info/insertExpNoWeight', values, data => {
          if(data.status === 1){
            message.success('经验值变更成功');
            this.props.refreshData(); //刷新列表展示数据
            this.props.outPoint(); //关闭弹窗
          } else {
            message.error(data.errorMsg);
          }
        });
      } else { //积分变更
        values['pointType'] = 1;
        postService(API_PREFIX + 'services/web/point/info/insertPointInfo', values, data => {
          if(data.status === 1){
            message.success('普通积分变更成功');
            this.props.refreshData();
            this.props.outTreasure();
          } else{
            message.error(data.errorMsg);
          }
        });
      }
    });
  }

  handleChange=(value)=>{
    if(this.props.flag=='point' && this.props.dataInfo && this.state.dataInfo.exp==0 && value==2){
      message.error('当前经验值为0，不可进行减少经验值的操作');
      return;
    }else if(this.props.flag!='point' && this.props.dataInfo && this.state.dataInfo.commonPoint==0 && value==2){
      message.error('当前积分值为0，不可进行减少积分值的操作');
      return;
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const {dataInfo,flag} = this.state;
    const formItemLayout = {labelCol: {sm: { span: 8}},wrapperCol: {sm: { span: 10 }}};
    return (
      <Form onSubmit={this.handleSubmit} >
        <FormItem {...formItemLayout} label="用户名">
            {
                getFieldDecorator('name', {initialValue:dataInfo.name})(<Input disabled/>)
            }
        </FormItem>
        {
            flag=='point' ?
            <FormItem {...formItemLayout} label='当前经验值'>
                {
                    getFieldDecorator('countExp',{initialValue: dataInfo.exp})(<InputNumber disabled/>)
                }
            </FormItem>:
            <FormItem {...formItemLayout} label='当前积分值'>
                {
                    getFieldDecorator('countPoint',{initialValue: dataInfo.commonPoint})(<InputNumber disabled/>)
                }
            </FormItem>
        }
        {
            flag=='point' ?
            <FormItem {...formItemLayout} label="类型">
            {
              getFieldDecorator('type',{initialValue:1})
              (
                <RadioGroup>
                    <Radio value={1}>资讯</Radio>
                    <Radio value={2}>活动</Radio>
                    <Radio value={3}>评论</Radio>
                    <Radio value={4}>分享</Radio>
                    <Radio value={5}>意见反馈</Radio>
                    <Radio value={6}>投稿</Radio>
                </RadioGroup>
              )
            }
          </FormItem>:
          <FormItem {...formItemLayout} label="类型">
          {
            getFieldDecorator('type',{initialValue:1})
           (
              <RadioGroup>
                  <Radio value={1}>活动</Radio>
                  <Radio value={2}>意见反馈</Radio>
                  <Radio value={3}>投稿</Radio>
              </RadioGroup>
          )
            
          }
        </FormItem>
        }
        <FormItem {...formItemLayout} label="操作">
          {
            getFieldDecorator('action',{initialValue:1})
            (
              <Select onChange={this.handleChange}>
                <Option value={1}>增加</Option>
                <Option value={2}>减少</Option>
              </Select>
            )
          }
        </FormItem>
        {
            flag=='point' ?
            <FormItem {...formItemLayout} label="变更数值" >
                {
                    getFieldDecorator('changeExp',{initialValue:1,...RuleConfig.changePointCofig})
                    (<InputNumber min={1}/>)
                }
            </FormItem>:
            <FormItem {...formItemLayout} label="变更数值" >
                {
                    getFieldDecorator('changePoint',{initialValue:1,...RuleConfig.changePointCofig})
                    (<InputNumber min={1}/>)
                }
            </FormItem>
        }
        <FormItem {...formItemLayout} label="变更原因" > {
            getFieldDecorator('remark',{initialValue:'',...RuleConfig.remarkReasonCofig})
            (<Input placeholder="15个汉字以内"/>)
          }
        </FormItem>
        <Row>
          <Col>
            <Button style={{marginLeft:'165px'}} className="queryBtn" type="primary" htmlType="submit" size="large">保存</Button>
            <Button className="resetBtn"
              onClick={()=>{
                if(this.props.flag == 'point'){
                  this.props.outPoint();
                } else{
                  this.props.outTreasure();
                }
              }}>取消</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default AlterPoint;


