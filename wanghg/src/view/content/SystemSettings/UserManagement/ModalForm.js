import React, { Component } from 'react';
import { Form, Col,Row,Radio, Input, Button,Select,DatePicker,InputNumber,message} from 'antd';
import {RuleConfig} from  '../../ruleConfig';
import {postService} from '../../myFetch.js';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
//用于下拉框
const Option = Select.Option;
@connect(
    state => ({
      dataSource: state.table.tableData,
      pageData:state.table.pageData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)

@Form.create()
class ModalForm extends Component{
  constructor(props){
    super(props);
    this.state={
      flag:this.props.flag,//modal组件传入的标识  point===》经验分修改   否则   积分修改
      record:this.props.record,//给modal传入的数据
      // pageData:this.props.pageData,//重新刷新页面
      whichPage:this.props.whichPage,//判断是从游客管理页面调转过来的还是用户管理页面跳转过来的

    }
  }
  //当 当前积分为0时，不能进行减少操作
  handleChange=(value)=>{
   console.log("value",value);
   if(this.props.flag=='point'&&this.props.record&&this.state.record.points==0&&value==2){//经验值
     message.error('当前经验值为0，不可进行减少经验值的操作');
     return;
   }else if(this.props.flag!='point'&&this.props.record&&this.state.record.treasure==0&&value==2){//经验值
     message.error('当前积分值为0，不可进行减少积分值的操作');
     return;
   }
}
  //表单提交处理函数
  handleSubmit=(e)=>{
    //阻止默认表单事件
    e.preventDefault();
    this.props.form.validateFields((err,fieldsValue)=>{
      if(err){
        return;
      }
      if(this.props.flag=='point'&&this.props.record&&this.state.record.points==0&&fieldsValue['action']==2){//经验值
        message.error('当前经验值为0，不可进行减少经验值的操作');
        return;
      }else if(this.props.flag!='point'&&this.props.record&&this.state.record.treasure==0&&fieldsValue['action']==2){//经验值
        message.error('当前积分值为0，不可进行减少积分值的操作');
        return;
      }
      const values={
          ...fieldsValue,
        'userId':this.state.record.userId,
        'level':this.state.record.level?this.state.record.level:1,
      }
      console.log("this.state:",this.state);
      console.log("表单中的数据values：",values);
      //modal传入一个标识：是经验值修改还是积分修改 flag=='point'?'经验值修改':'积分修改'
      //还需要传递一个标识：判断是用户管理页面的还是游客管理页面的，从而做不同的刷新 user:用户管理  visitor：游客管理
      if(this.state.flag=='point'){//调用经验值操作的接口
        postService(API_PREFIX+'services/system/systemAndCompanyUser/updatePoint',values,data=>{
          if(data.retCode==1){
            message.success("操作成功");
             if(this.state.whichPage=='user'){//用户管理页面
               console.log("用户管理页面");
               this.props.getData(API_PREFIX+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
             }else if(this.state.whichPage=='visitor'){//游客管理页面
               console.log("游客管理页面");
               this.props.getData(API_PREFIX+ `services/system/touristUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
             }
            this.props.ok();
          }else{
            message.success(data.retMsg);
          }
        });
      }else{//调用积分操作的接口
        postService(API_PREFIX+'services/system/systemAndCompanyUser/updateTreasure',values,data=>{
          if(data.retCode==1){
            message.success("操作成功");
            if(this.state.whichPage=='user'){//用户管理页面
              console.log("用户管理页面");
              this.props.getData(API_PREFIX+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else if(this.state.whichPage=='visitor'){//游客管理页面
              console.log("游客管理页面");
              this.props.getData(API_PREFIX+ `services/system/touristUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }
            this.props.ok();
          }else{
            message.success(data.retMsg);
          }
        });
      }
    })
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

    return(
        <Form onSubmit={this.handleSubmit}>
          <FormItem
              {...formItemLayout}
              label="用户名"
          >
            {
              getFieldDecorator('name',{initialValue:this.state.record.lastname})
              (<Input disabled/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label={this.state.flag=='point'?"当前经验值":"当前积分"}
          >
            {
              getFieldDecorator(this.state.flag=='point'?"point":"treasure",{initialValue:this.state.flag=='point'?this.state.record.points:this.state.record.treasure})
              (<Input disabled/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="类型"
          >{
            getFieldDecorator('type',{initialValue:1,...RuleConfig.typeCofig})
            (<RadioGroup>
              <Radio value={1}>资讯</Radio>
              <Radio value={2}>活动</Radio>
              <Radio value={3}>评论</Radio>
              <Radio value={4}>分享</Radio>
              <Radio value={5}>意见反馈</Radio>
              <Radio value={6}>投稿</Radio>
              <Radio value={7}>盒子开机</Radio>
              <Radio value={8}>观看影片</Radio>
              <Radio value={9}>下载应用</Radio>
              </RadioGroup>
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
              label={this.state.flag=='point'?"经验值":"积分值"}
          >
            {
              getFieldDecorator(this.state.flag=='point'?'newPoint':'newTreasure',{initialValue:'',...RuleConfig.pointCofig})
              (<InputNumber min={1}/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="描述"
          > {
            getFieldDecorator('remark',{initialValue:'',...RuleConfig.remarkCofig})
            (<Input/>)
          }

          </FormItem>
          <Row>
            <Col>
              <Button style={{marginLeft:"165px"}} className="queryBtn" type="primary" htmlType="submit" size="large">保存</Button>
              <Button className="resetBtn" onClick={()=>this.props.cancel()}>取消</Button>
            </Col>
          </Row>
        </Form>
    );
  }
}
export default ModalForm;