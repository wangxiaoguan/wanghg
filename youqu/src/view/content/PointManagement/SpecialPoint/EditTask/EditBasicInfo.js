import React, { Component } from 'react';
import moment from 'moment';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
import { connect } from 'react-redux';
import {setBasicInfoData, BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../../redux-root/action';
import { Form, Row, Col, Input, DatePicker, InputNumber, Select, Radio, Cascader, Divider, Button, message, Table} from 'antd';
import {RuleConfig} from  '../../../ruleConfig';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
//日期格式
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
// import './CarouselDetail.less';

@connect(
  state => ({
    dataSource: state.tableData,
    pageData:state.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    setBasicInfoData: n=> dispatch(setBasicInfoData(n)),
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)),
    retSetData: n=>dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
@Form.create()
export default class EditBasicInfo extends Component{
  constructor(props){
    super(props);
    this.state = {
      pointTypeOpt: [], //积分类型下拉框
      operateType: 1, //任务类型
      timelimt:true,
    };
  }

  componentDidMount(){
    //积分类型下拉框 数据获取
    getService(ServiceApi + 'services/system/specialTreasureTask/typeList/1/100', data => {
      if(data.retCode === 1){
        let pointTypeTemp = [];
        data.root.list && data.root.list.map(item => {
          pointTypeTemp.push({
            key: item.id,
            value: item.typeName});
        });

        this.setState({
          pointTypeOpt: pointTypeTemp,
        }, () => {
          console.log('pointTypeOpt', this.state.pointTypeOpt);
        });
      }
    });
  }

  //表单提交处理函数
  handleSubmit= (e, next) => { //若next不为空，则 “保存并下一步”
    //阻止默认表单事件
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) =>{
      console.log('fieldsValue', fieldsValue);
      if(err){
        return;
      }

      if(fieldsValue['deliverydate']){}

      let values = {
        ...fieldsValue,
        'deliverydate': fieldsValue['deliverydate'].format(dateFormat),
        'expireddate': fieldsValue['expireddate'].format(dateFormat),
        'startdate': fieldsValue['startdate'].format(dateFormat),
        'enddate': fieldsValue['enddate'].format(dateFormat),
      };
      console.log('values', values);

      if(this.props.flowData && this.props.flowData.id){ //编辑 or 返回上一步
        values.id = this.props.flowData.id;
        postService(ServiceApi + 'services/system/specialTreasureTask/update/task', values, data => {
          if(data.retCode === 1){
            message.success('编辑成功');
            if(data.root.object){
              console.log('receive flowData:', data.root.object);
              this.props.setBasicInfoData({...data.root.object});
            }
          } else{
            message.error(data.retMsg);
          }
        });

        if(next){ //保存并下一步
          this.props.next();//跳到下一步
        }else{ //单单保存，返回 专项积分发放管理列表页面
          location.hash = '/PointManagement/SpecialPoint';
        }

      } else{ //新增
        postService(ServiceApi + 'services/system/specialTreasureTask/add/task', values, data => {
          if(data.retCode === 1){
            message.success('新增成功');
            if(data.root.object){
              console.log('receive flowData:', data.root.object);
              this.props.setBasicInfoData({...data.root.object});
            }
          } else{
            message.error(data.retMsg);
          }

          if(next){ //保存并下一步
            this.props.next();//跳到下一步
          }else{ //单单保存，返回 专项积分发放管理列表页面
            location.hash = '#/PointManagement/SpecialPoint';
          }
        });
      }
    });
  }


  handleChange = (value) => {
    console.log('value', value);
  }

  //选单选框时触发
  onRadioChange = (e) => {
    this.setState({
      operateType: e.target.value,
    }, () => {
      console.log('operateType', this.state.operateType);
    });
  }

  //设定的时间范围
  range =(start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  //禁止选择部分日期
  disabledDate =(current) => {
    // console.log('disabledDate', new Date().toLocaleString());
    // return current && current < moment().endOf('day');
    return  current && current < moment().add(-1, 'd');

  }

  //禁止选择部分时间
  disabledDateTime =() => {
      if(this.state.timelimt){
      return {
        disabledHours: () => this.range(0, 24).splice(0, new Date().getHours()+1),
        disabledMinutes: () => this.range(0, 60).splice(0, new Date().getMinutes()+1),
        disabledSeconds: () => this.range(0, 60).splice(0, new Date().getSeconds()+1),
      };
    }
  }
  onChange=(value)=>{
    let currentDay=new Date().getDate()
    let month=String(value._d).split(" ")[2]
    if(month==currentDay){
      this.setState({timelimt:true})
      this.disabledDateTime() 
    }else{
      this.setState({timelimt:false})
      this.disabledDateTime() 
    }
  }
  render(){
    const {pointTypeOpt} = this.state;
    let {editTaskData}=this.props
    const operateTypeOpt = [
      {label: '单次任务', value: 1},
      {label: '循环任务', value: 2},
    ];
    const modelTypeOpt = [
      {label: '按年执行', value: 'Y'},
      {label: '按月执行', value: 'M'},
      {label: '按日执行', value: 'D'},
    ];

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
        <FormItem {...formItemLayout} label="任务名称" maxLength="60">
          {getFieldDecorator('taskname', {
            rules: [
              {
                required: true,
                whitespace: true,
                max: 60,
                message: '任务名称为必填项,且最大长度不能超过60',

              },
            ],initialValue:editTaskData.taskname
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="积分类型" maxLength="60">
          {getFieldDecorator('typeid', {
            initialValue: editTaskData.typeid,
            rules: [
              {
                type: 'integer',
                required: true,
                whitespace: true,
                message: '积分类型是必填项',
              },
            ],
          })(
            <Select
              className="select"
              disabled={false}
              placeholder="请选择"
            >
              {pointTypeOpt &&
                    pointTypeOpt.map(_ => {
                      return (
                        <Option key={_.key} value={_.key}>
                          {_.value}
                        </Option>
                      );
                    })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="积分值" maxLength="60">
          {getFieldDecorator('value', {
            rules: [
              {
                type: 'integer',
                required: true,
                whitespace: true,
                message: '积分值为必填项,且必须为整数！',
              },
            ],
            initialValue:editTaskData.value,
          })(
            <InputNumber className="input1" min={0} disabled={false}
            />)}
        </FormItem>
        <FormItem {...formItemLayout} label="任务类型" maxLength="60">
          {getFieldDecorator('operateType', {
            initialValue:editTaskData.operateType,
            rules: [
              {
                type: 'integer',
                required: true,
                whitespace: true,
                message: '任务类型为必填项',
              },
            ],
          })(
            <RadioGroup
              disabled={false}
              options={operateTypeOpt}
              onChange={e => this.setState({ operateType: e.target.value })}
            />
          )}
        </FormItem>
        {
          this.state.operateType === 2 ?
            (< FormItem {...formItemLayout} label="执行方式" maxLength="60">
              {getFieldDecorator('modelType', {
                initialValue:editTaskData.modelType,
                rules: [
                  {
                    type: 'string',
                    required: true,
                    whitespace: true,
                    message: '任务类型为必填项',
                  },
                ],
              })(
                <RadioGroup
                  disabled={false}
                  options={modelTypeOpt}
                  onChange={e => console.log(e.target.value)}
                />
              )}
            </FormItem>) : null
        }
        <FormItem {...formItemLayout} label="发放时间" maxLength="60">
          {getFieldDecorator('deliverydate', {
            rules: [
              {
                type: 'object',
                required: true,
                whitespace: true,
                message: '发放时间必填项',

              },
            ],
            initialValue:moment(editTaskData.deliverydate)
          })(
            (<DatePicker 
              disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              onChange={this.onChange}
              disabled={false}  
             
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} 
              />)
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="活动截止时间" maxLength="60">
          {getFieldDecorator('expireddate', {
            rules: [
              {
                type: 'object',
                required: true,
                whitespace: true,
                message: '活动截止时间必填项',
              },
            ], initialValue:moment(editTaskData.expireddate)
          })(
            (<DatePicker disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              onChange={this.onChange}
              disabled={false}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="积分生效时间" maxLength="60">
          {getFieldDecorator('startdate', {
            rules: [
              {
                type: 'object',
                required: true,
                whitespace: true,
                message: '积分生效时间必填项',
              },
            ], initialValue:moment(editTaskData.startdate)
          })(
            (<DatePicker disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              onChange={this.onChange}
              disabled={false}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="积分失效时间" maxLength="60">
          {getFieldDecorator('enddate', {
            rules: [
              {
                type: 'object',
                required: true,
                whitespace: true,
                message: '积分失效时间必填项',
              },
            ],initialValue:moment(editTaskData.enddate)
          })(
            (<DatePicker disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              onChange={this.onChange}
              disabled={false}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)
          )}
        </FormItem>
        <Row>
          <Col>
            <Button style={{marginLeft:'165px'}} className="resetBtn" onClick={() => location.hash = '#/PointManagement/SpecialPoint'}>取消</Button>
            <Button className="queryBtn" onClick={this.handleSubmit}>
              保存
            </Button>
            <Button
              className="queryBtn"
              onClick={e => this.handleSubmit(e, 'next')}
            >
              保存并下一步
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}


