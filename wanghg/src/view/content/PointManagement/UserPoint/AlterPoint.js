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

    this.props.form.validateFields((err, fieldsValue) =>{
      if(err){
        return;
      }

      const values = {
        ...fieldsValue,
        'userid': this.state.dataInfo.userid,
        'level': this.state.dataInfo.level ? this.state.dataInfo.level : 1,
        'point': this.state.dataInfo.point,
        'treasure': this.state.dataInfo.treasure,
      };

      if(this.state.flag == 'point'){ //经验值变更
        postService(API_PREFIX + 'services/system/pointTreasure/updatePoint', values, data => {
          if(data.retCode === 1){
            message.success(data.retMsg);
            this.props.refreshData(); //刷新列表展示数据
            this.props.outPoint(); //关闭弹窗
          } else {
            message.error(data.retMsg);
          }
        });
      } else { //积分变更
        postService(API_PREFIX + 'services/system/pointTreasure/updateTreasure', values, data => {
          if(data.retCode === 1){
            message.success(data.retMsg);
            this.props.refreshData();
            this.props.outTreasure();
          } else{
            message.error(data.retMsg);
          }
        });
      }
    });
  }

  //当 当前 经验值/积分 为0时，不能进行减少操作
  handleChange=(value)=>{
    console.log('value',value); //value=2 --进行减少操作
    if(this.props.flag=='point' && this.props.dataInfo && this.state.dataInfo.point==0 && value==2){//经验值
      message.error('当前经验值为0，不可进行减少经验值的操作');
      return;
    }else if(this.props.flag!='point' && this.props.dataInfo && this.state.dataInfo.treasure==0 && value==2){//积分
      message.error('当前积分值为0，不可进行减少积分值的操作');
      return;
    }
  }

  render(){

    //获取数据
    const { getFieldDecorator } = this.props.form;
    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        sm: { span: 8},
      },
      wrapperCol: {
        sm: { span: 10 },
      },
    };

    const config = {
      rules: [{
        required: false,
      }],
    };

    return (
      <Form onSubmit={this.handleSubmit} >
        <FormItem {...formItemLayout} label="用户名" maxLength="60">
          {getFieldDecorator('name', {initialValue: this.state.dataInfo.name})(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={this.state.flag=='point' ? '当前经验值' : '当前积分值'}
          maxLength="11">
          {getFieldDecorator(this.state.flag=='point' ? 'point' : 'treasure',
            {initialValue: this.state.flag=='point' ? this.state.dataInfo.point : this.state.dataInfo.treasure})(
            <Input disabled/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="类型"
        >{
            getFieldDecorator('type',{initialValue:1,...RuleConfig.typeCofig})
            (this.state.flag=='point' ? (<RadioGroup>
              <Radio value={1}>资讯</Radio>
              <Radio value={2}>活动</Radio>
              <Radio value={3}>评论</Radio>
              <Radio value={4}>分享</Radio>
              <Radio value={5}>意见反馈</Radio>
              <Radio value={6}>投稿</Radio>
            </RadioGroup>)
              : (<RadioGroup>
                <Radio value={1}>活动</Radio>
                <Radio value={2}>意见反馈</Radio>
                <Radio value={3}>投稿</Radio>
              </RadioGroup>)
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="操作"
        >
          {
            getFieldDecorator('action',{initialValue:1,...RuleConfig.actionCofig})
            (
              <Select onChange={this.handleChange}>
                <Option value={1}>增加</Option>
                <Option value={2}>减少</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="变更数值"
        >
          {
            getFieldDecorator('changePoint',{initialValue:'',...RuleConfig.changePointCofig})
            (<InputNumber min={1}/>)
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="变更原因"
        > {
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


