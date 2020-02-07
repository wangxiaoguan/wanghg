import React, { Component } from 'react';
import moment from 'moment';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../../redux-root/action/table/table';
import {setBasicInfoData } from '../../../../../redux-root/action/specialPoint/specialPoint';
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
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
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
export default class AddBasicInfo extends Component{
  constructor(props){
    super(props);
    console.log("props==>",props)
    this.state = {
      pointTypeOpt: [], //积分类型下拉框
      operateType: 1, //任务类型
      currentDay:new Date().getDate(),
      timelimt:true,
      F_disabled:false,
      modelType:'Y'
    };
  }

  componentDidMount(){
    //积分类型下拉框 数据获取
    getService(API_PREFIX + 'services/awardpoint/specialTreasureTask/typeList/1/100', data => {
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

    if(JSON.stringify(this.props.flowData)!='{}'){
      this.props.form.setFieldsValue({
        taskname:this.props.flowData.taskname,
        typeid:this.props.flowData.typeid,
        value:this.props.flowData.value,
        deliverydate:this.props.flowData.deliverydate,
        enddate:this.props.flowData.enddate,
        expireddate:this.props.flowData.expireddate,
        startdate:this.props.flowData.startdate,
        operateType:this.props.flowData.operateType,
        
      });
      this.setState({
        operateType:this.props.flowData.operateType,
        modelType:this.props.flowData.modelType
      })

    }
  }

  //表单提交处理函数
  handleSubmit= (e, next) => { //若next不为空，则 “保存并下一步”
    let that=this
    let timestamp=new Date().getTime();
    //阻止默认表单事件
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) =>{
      const deliveryValue=Date.parse(fieldsValue['deliverydate'].format(dateFormat))
      let  timeValue=deliveryValue-timestamp
      if(timeValue<=0){
        message.error('请重新选择发放时间');
        return;
      }

      let expireddate=Date.parse(fieldsValue['expireddate'].format(dateFormat))
      let  e_timeValue=expireddate-deliveryValue
      let d_timeValue=expireddate-timestamp
      if(e_timeValue<=0){
        message.error('活动截止时间必须大于发放时间');
        return;
      }
      if(d_timeValue<=0){
        message.error('请重新活动截止时间');
        return;
      }

      const startdate=Date.parse(fieldsValue['startdate'].format(dateFormat))
      let  s_timeValue=startdate-timestamp
      if(s_timeValue<=0){
        message.error('请重新选择积分生效时间');
        return;
      }
      const enddate=Date.parse(fieldsValue['enddate'].format(dateFormat))
      let  E_timeValue=enddate-timestamp
      if(E_timeValue<=0){
        message.error('请重新选择积分失效时间');
        return;
      }

      let  SE_timeValue=enddate-startdate
      if(SE_timeValue<=0){
        message.error('积分生效时间必须小于积分失效时间');
        return;
      }
      if(d_timeValue>E_timeValue){
        message.error('积分失效时间应大于活动截止时间');
        return;
      }
      that.setState({
        F_disabled:true
      })
      
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
      let timePushTask = {
        'taskName': '专项积分发放任务',
        'cronDate': values['deliverydate'],
        'operateType': fieldsValue['operateType'],
        'queryType': 'get',
        'queryUrl': API_PREFIX + `services/awardpoint/specialTreasureTask/putUserSpecialPoint/`,//*newsId/
        'queryValue': {},
        'queryContentType': 'application/json',
      };

      if(fieldsValue['operateType']===2){
        timePushTask['modelType']=fieldsValue['modelType']
      }
       
      if(this.props.flowData && this.props.flowData.id){ //编辑 or 返回上一步
        values.id = this.props.flowData.id;
        postService(API_PREFIX + 'services/awardpoint/specialTreasureTask/update/task', values, data => {
          if(data.retCode === 1){
            message.success('编辑成功');
            timePushTask['queryUrl'] = timePushTask['queryUrl'] + data.root.id
            fieldsValue['id']=data.root.id
            if(data.root.jobId){
              timePushTask['id'] =  data.root.jobId

              postService(API_PREFIX + `services/automation/job/update`,
                timePushTask,
                timeData => {
                  if (timeData.retCode === 1) {
                    message.success(
                      `保存成功！将于${values['deliverydate']}定时发布`
                    );
                  }else{
                    message.error('服务异常！请重试！');
                  }
              })
            }else{
              postService(API_PREFIX + `services/automation/job/add`,
              timePushTask,
              timeData => {
                if (timeData.retCode === 1) {
                  getService(API_PREFIX + `services/awardpoint/specialTreasureTask/add/taskId/${data.root.id}/${timeData.root.id}`,Data => {
                    if (Data.retCode === 1) {
                      message.success(
                        `保存成功！将于${values['deliverydate']}定时发布`
                      );
                    }
                  })
                }else{
                  message.error('服务异常！请重试！');
                  that.setState({
                    F_disabled:fasle
                  })
                }
              })
            }

          } else{
            message.error(data.retMsg);
          }
        });

        if(next){ //保存并下一步
          that.props.next(fieldsValue,values.id);//跳到下一步
        }else{ //单单保存，返回 专项积分发放管理列表页面
          location.hash = '/PointManagement/SpecialPoint';
        }

      } else{ //新增
        postService(API_PREFIX + 'services/awardpoint/specialTreasureTask/add/task', values, data => {
          if(data.retCode === 1){
            message.success('新增成功');
            timePushTask['queryUrl'] = timePushTask['queryUrl'] + data.root.id
            fieldsValue['id']=data.root.id

            postService(API_PREFIX + `services/automation/job/add`,
            timePushTask,
            timeData => {
              if (timeData.retCode === 1) {
                getService(API_PREFIX + `services/awardpoint/specialTreasureTask/add/taskId/${data.root.id}/${timeData.root.id}`,Data => {
                  if (Data.retCode === 1) {
                    message.success(
                      `保存成功！将于${values['deliverydate']}定时发布`
                    );
                  }
                })
              }else{
                message.error('服务异常！请确认重试！');
                that.setState({
                  F_disabled:fasle
                })
              }
            })
          } else{
            message.error(data.retMsg);
            that.setState({
              F_disabled:fasle
            })
          }
          if(next){ //保存并下一步
            that.props.next(fieldsValue,fieldsValue['id']);//跳到下一步
          }else{ //单单保存，返回 专项积分发放管理列表页面
            location.hash = '#/PointManagement/SpecialPoint';
          }
        });
      }
    });
  }

  // next = (values,id) => {
  //   console.log(id)
  //   this.setState({addid:id})
  //   this.props.setEventData(values); //保存上一页内容
  //   const current = this.state.current + 1;
  //   if (location.hash.indexOf('?step')>-1) {
  //     location.hash = location.hash.replace(/\?step=[0-2]/,`?step=${current}`);
  //   }else{
  //     location.hash += `?step=${current}&id=${id}`;
  //   }
  //   this.setState({ current, showPrompt: false });

  // };

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
    console.log('disabledDate', new Date().toLocaleString());
    // return current && current < moment().endOf('day');
     return  current && current < moment().add(-1, 'd');
  }

  //禁止选择部分时间
  disabledDateTime =() => {
    // if(this.state.timelimt){
    //   return {
    //     disabledHours: () => this.range(0, 24).splice(0, new Date().getHours()+1),
    //     disabledMinutes: () => this.range(0, 60).splice(0, new Date().getMinutes()+1),
    //     disabledSeconds: () => this.range(0, 60).splice(0, new Date().getSeconds()+1),
    //   };
    // }
    
  }
  onChange=(value)=>{
    // let currentDay=new Date().getDate()
    // let month=String(value._d).split(" ")[2]
    // if(month==currentDay){
    //   this.setState({timelimt:true})
    //   this.disabledDateTime() 
    // }else{
    //   this.setState({timelimt:false})
    //   this.disabledDateTime() 
    // }
  }
  render(){
    const {pointTypeOpt,F_disabled} = this.state;

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
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="积分类型" maxLength="60">
          {getFieldDecorator('typeid', {
            initialValue: '',
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
                message: '积分值为必填项,且必须为大于0的整数,最大9位！',
              },
            ],
            // initialValue:"",
          })(
            <InputNumber className="input1" min={1} max={999999999} disabled={false}
            />)}
        </FormItem>
        <FormItem {...formItemLayout} label="任务类型" maxLength="60">
          {getFieldDecorator('operateType', {
            initialValue: this.state.operateType,
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
                initialValue: this.state.modelType,
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
          })(
            (<DatePicker disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              format="YYYY-MM-DD HH:mm:ss"
              disabled={false}
              onChange={this.onChange}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)
          )}　　<span style={{color:'red'}}>请设置大于当前时间</span>
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
            ],
          })(
            (<DatePicker disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              onChange={this.onChange}
              format="YYYY-MM-DD HH:mm:ss"
              disabled={false}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)
          )}　　<span style={{color:'red'}}>请设置大于当前时间</span>
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
            ],
          })(
            (<DatePicker disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              onChange={this.onChange}
              format="YYYY-MM-DD HH:mm:ss"
              disabled={false}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)
          )}　　<span style={{color:'red'}}>请设置大于当前时间</span>
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
            ],
          })(
            (<DatePicker disabledDate={this.disabledDate}
              disabledTime={this.disabledDateTime}
              onChange={this.onChange}
              format="YYYY-MM-DD HH:mm:ss"
              disabled={false}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)
          )}　　<span style={{color:'red'}}>请设置大于当前时间</span>
        </FormItem>
        <Row>
          <Col>
            <Button style={{marginLeft:'165px'}} className="resetBtn" onClick={() => location.hash = '#/PointManagement/SpecialPoint'}>取消</Button>
            {/* <Button className="queryBtn" onClick={this.handleSubmit}>
              保存
            </Button> */}
            <Button disabled={F_disabled}
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


