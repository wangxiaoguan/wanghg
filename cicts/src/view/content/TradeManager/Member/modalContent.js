import React, { Component } from 'react';
import { Form, Col, Row, Input, Cascader, DatePicker, Button, message } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import DutyItem from './dutyItem';
import { RuleConfig } from '../../ruleConfig';
import './index.less';

import API_PREFIX from '../../apiprefix';
import { getService, postService } from '../../myFetch';

class ModalContent extends Component {

  state = {
    //dutyTypes: [{ id: 'custom', desp: '自定义' }],
    dutyTypes: [],
    loading: false,
    validUserno:{},//校验员工号的信息
    lastname:'',
  }

  getAllDuties = () => {
    getService(API_PREFIX + 'services/web/union/user/getUnionUserPost', (data) => {
      //console.log('data', data);
      //data ????裸着返回 不带任何信息????
      this.setState({
        // dutyTypes: [...data, ...this.state.dutyTypes],
        dutyTypes: [...data.root.object],
      });
    });
  }
  componentDidMount() {
    this.getAllDuties();
  }
//根据员工号进行新增判断用户是否存在
handleUsernoInputFinish=(e)=>{
  if(e.target.value == '' || e.target.value == undefined || /^[\s]*$/.test(e.target.value)) {
    return
  }
  if(e.target.value){
    getService(API_PREFIX + `services/web/union/user/getByUserNo/${e.target.value}`, data => {
      if(data.status==1){
        this.props.form.setFieldsValue({'lastname':data.root.object.name});
        this.setState({lastname:data.root.object.name, userId: data.root.object.id});
      }else{
        this.props.form.setFieldsValue({'lastname':''});
      }
    });
  }
}
  auchInfoPower = (flag, unionId) => {
    let currentItem = this.props.currentItem
    let userId = ''
    if (currentItem.editDuties) { //如果是编辑
      userId = currentItem.userId
    }else {
      userId = this.state.userId
    }
    let name = ''
    let forAuth = (orgs) => {
      orgs.map(item => {
        if(item.id == unionId) {
          name = item.name
        }
        if(item.unionOrgList) {
          forAuth(item.unionOrgList)
        }
      })
    }
    forAuth(this.props.organizations)
    let body = {type: 5, id: unionId, userId, name, }
    postService(API_PREFIX + `services/web/auth/authunion/${flag ? 'addAuthUser' : 'updateAuthUser'}`, body, res => {
      if(res.status !== 1) {
        message.error(res.errorMsg)
      }
    })
  }
  render() {
    // 判断是不是编辑modal 用currentItem.editDuties
    const { dutyTypes, loading } = this.state;
    const { form, onClose, organizations,
      currentItem, changeDutySource, refreshScreen } = this.props;
    const { getFieldDecorator, getFieldsValue, setFieldsValue,
      getFieldValue, validateFields } = form;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const onAdd = () => {
      let { duties = [] } = getFieldsValue();
      duties = [...duties, { org: '', duty: '', otherDuty: '' }];
      setFieldsValue({ duties });
      if (currentItem.editDuties) { //如果是编辑
        //回调改变currentItem
        changeDutySource([...currentItem.editDuties, { org: '', duty: '', otherDuty: '' }]);
      }
    };
    const onRemove = (index) => {
        const { duties = [] } = getFieldsValue();
        duties.splice(index, 1);
        setFieldsValue({ duties });

        const { duty } = getFieldsValue();
        duty.splice(index, 1);
        setFieldsValue({ duty });
      if (currentItem.editDuties) { //如果是编辑
        //回调改变currentItem
        currentItem.editDuties.splice(index, 1);
        changeDutySource([...currentItem.editDuties]);
      }
    };  
    // getFieldDecorator('duties', { initialValue: [{ org: '', duty: '', otherDuty: '' }] });
    getFieldDecorator('duties', { initialValue: [] });
    let duties = getFieldValue('duties');
    if (currentItem.editDuties && currentItem.editDuties.length !== 0) { //如果是编辑
      duties = currentItem.editDuties;
    } else if (currentItem.editDuties && currentItem.editDuties.length === 0) {
      // duties = [{ org: '', duty: '', otherDuty: '' }];
      duties = [];
    }
    const addDuties = () => {
        let { duties = [] } = getFieldsValue();
      duties = [...duties, { org: '', duty: '', otherDuty: '' }];
      setFieldsValue({ duties });
      if (currentItem.editDuties) { //如果是编辑
        //回调改变currentItem
        changeDutySource([...currentItem.editDuties, { org: '', duty: '', otherDuty: '' }]);
      }
    };
    const submit = () => {
      validateFields((err, values) => {
        if (!err) {
          const unionMemPostList = values.duty&&values.duty.map((current,index) => {
            return {
              postId: current.duty,
              unionId: current.org[current.org.length - 1],
              sortId:index,
            };
          }).filter(currentItem => currentItem.postId && currentItem.unionId);
          const filterArray = _.uniqWith(unionMemPostList, _.isEqual);
          if (filterArray.length < unionMemPostList&&unionMemPostList.length) {
            message.error('同一组织机构下只能选择一个职务');
            return;
          }
          let olgL = unionMemPostList&&unionMemPostList.length;
          let allArr = [];
          //去重
          if(unionMemPostList){
            for(let i=0;i<unionMemPostList.length;i++){
              　　let flag = true;
              　　for(let j=0;j<allArr.length;j++){
              　　　　if(unionMemPostList[i].postId == allArr[j].postId){
                          if(unionMemPostList[i].unionId == allArr[j].unionId){
                            flag = false;
                          }
              　　　　}
              　　} 
              　　if(flag){
              　　　　allArr.push(unionMemPostList[i]);
              　　}
              }
    
              if(olgL != allArr.length){
                message.error('职务不能重复！');
                return;
              }
          }

          const uploadParam = {
            name: values.lastname,
            userNo: values.member,
            unionId: values.organization[values.organization.length - 1],
            joinDate:values.joinDate? moment(values.joinDate).format('YYYY-MM-DD'):'',
            unionUserPostList:unionMemPostList,
          };
          this.setState({ loading: true });
          if (currentItem.editDuties) {//如果是编辑
            //编辑 uploadParam 加 id
            postService(API_PREFIX + 'services/web/union/user/update', { id: currentItem.id, ...uploadParam }, (data) => {
              //console.log('----data----', data);
              this.setState({ loading: false });
              if (data.status === 1) {
                message.success('修改成功');
                this.auchInfoPower(false, uploadParam.unionId)
                refreshScreen();
                onClose();
              } else {
                message.error(data.errorMsg);
              }
            });
          } else {
            postService(API_PREFIX + 'services/web/union/user/insert', uploadParam, (data) => {
              //console.log('----data----', data);
              this.setState({ loading: false });
              if (data.status === 1) {
                message.success('新建成功');
                this.auchInfoPower(true, uploadParam.unionId)
                refreshScreen();
                onClose();
              } else {
                message.error(data.errorMsg);
              }
            });
          }
        }
      });
    };
    return (
      <Form>
        <Row>
          <Col span={12}>
            <Form.Item label="员工号" {...formItemLayout}
            validateStatus={this.state.validUserno.retCode=='0'?'error':'success'}
            >
              {getFieldDecorator('member', {
                rules:[{//将会员管理里面的员工号仅设置为必填项，不做其他长度限制xwx2018/12/25
                  // required:true,message:'请输入您的员工号，最长20个字符', max:20,},
                  // required:true,message:'请输入您的员工号',
                  required: true, 
                  whitespace: true,
                  validator: (rule, value, callback) => {
                      if(value == '' || value == undefined) {
                          callback('员工号不能为空!')
                      }else if(/^[\s]*$/.test(value)) {
                          callback('员工号不能全为空格!')
                      }else {
                          callback()
                      }
                  }
                },
                  {
                    // validator: this.handleValidUserno
                  },
                ],initialValue: currentItem.userNo || '',
              })(
                <Input
                 disabled={!!currentItem.editDuties}
                onChange={(e)=>this.handleUsernoInputFinish(e)}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item label="姓名" {...formItemLayout}>
              {getFieldDecorator('lastname', {
                initialValue: currentItem.name || '',
                ...RuleConfig.lastnameConfig,
              })(
                <Input
                // disabled={!!currentItem.editDuties}
                 disabled={true}
                  />
              )}
            </Form.Item>    
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="所属工会组织" {...formItemLayout}>
              {getFieldDecorator('organization', {
                initialValue: currentItem.treePath ? currentItem.treePath.split(',') : '',
                ...RuleConfig.belongsDepartmentCofig,
              })(
                <Cascader
                  placeholder="请选择关键字"
                  options={organizations}
                  changeOnSelect
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="入会时间" {...formItemLayout}>
              {getFieldDecorator('joinDate', {
                initialValue: currentItem.joinDate ? moment(currentItem.joinDate) : moment(),
              })(
                <DatePicker />
              )}
            </Form.Item>
          </Col>
        </Row>
        {
             duties && duties.map((current, index) => (
                <Form.Item key={index + ''} label="职务" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator(`duty[${index}]`, {
                    initialValue: { ...current },
                })(
                    <DutyItem
                    isFirst={index === 0}
                    
                    options={organizations}
                    dutyTypes={dutyTypes}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    which={index}
                    />
                )}
                </Form.Item>
            ))
              
        }
        <Form.Item label=" " colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          {/* <div style={{width:250,height:34,border:'1px dashed #000',lineHeight:'34px',textAlign:'center'}}>添加职务</div> */}
          <Button type="dashed" onClick={addDuties}>添加职务</Button>
        </Form.Item>
        
        <div className="outer">
          <div>
            <Button className="resetBtn" onClick={onClose}>取消</Button>
            <Button
              className="queryBtn"
              type="primary"
              onClick={submit}
              style={{ marginLeft: 20 }}
              loading={loading}
            >
              确定
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default Form.create()(ModalContent);
