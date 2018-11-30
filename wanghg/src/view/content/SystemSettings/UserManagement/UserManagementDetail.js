import React, { Component } from 'react';
import { Form,  Input, Button, Checkbox,Select,Radio,InputNumber,message,Row,Col} from 'antd';
const FormItem = Form.Item;
@Form.create()
class UserManagementDetail extends Component{
  constructor(props){
    super(props);
    this.state={
      userDetailData:'',//详情中的数据，从缓存中获取
    }
  }
  componentWillMount(){
    //从缓存中获取详情中的数据
    let userData=window.sessionStorage.getItem('userData');
    console.log("详情中的数据为：",userData);
    let obj=JSON.parse(userData);
    this.setState({
      userDetailData:obj,
    });
  }
  render(){
    // const datas=this.state.userDetailData;
    //详情中的假数据
    const datas={
      employeeNum:"2017012879",
      name:"玉林雨",
      email:"277999@qq.com",
      phone:"15987865678",
      age:25,
      degree:"本科",
      gender:"男",
      isGrayUser:"是",
      belongsDepart:"B级部门1",
      assignRoles:["role1,role2"]



    }
    console.log("详情中的数据：",datas);
    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    //详情中的数据
    const details=this.state.userDetailData;
    return(
        <div style={{marginTop:"20px"}}>
          <Row>
          <Form>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="员工工号"
            >
                  <Input value={details.userno} disabled/>
            </FormItem>
            </Col>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="姓名"
            >
              {
                (
                    <Input value={details.lastname} disabled/>
                )
              }
            </FormItem>
            </Col>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="邮箱"
            >
              {
                (
                    <Input value={details.email} disabled/>
                )
              }
            </FormItem>
            </Col>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="手机号"
            >
              {
                (
                    <Input value={details.mobile} disabled/>
                )
              }

            </FormItem>
            </Col>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="年龄"
            >
              {
                (
                    <Input value={details.age} disabled/>
                )
              }

            </FormItem>
            </Col>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="学历"
            >
              {
                (
                    <Input value={details.edu} disabled/>
                )
              }
            </FormItem>
            </Col>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="性别"
            >
              {
                (
                    <Input value={details.sex} disabled/>
                )
              }

            </FormItem>
            </Col>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="是否为灰度用户"
            >
                    <Input value={details.isGrayUser} disabled/>

            </FormItem>
            </Col>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="所属部门"
            >
              <Input value={details.orginfoName} disabled/>
            </FormItem>
            </Col>
            <Col span={10}>
            <FormItem
                {...formItemLayout}
                label="分配角色"
            >
                    <Input value={details.roleNames} disabled/>

            </FormItem>
            </Col>
            <Col span={24}>
            <FormItem
                {...formItemLayout}
                style={{marginLeft:"45%"}} 
            >
              <div >
                <Button className="resetBtn" onClick={()=>location.hash = "/SystemSettings/UserManagement"}>返回</Button>
              </div>

            </FormItem>
            </Col>
          </Form>
          </Row>
        </div>
    );
  }
}
export default UserManagementDetail;