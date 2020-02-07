import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,Tabs,Checkbox,Row,Col,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
let arr = [];
let obj = {};
let arr5 = [];
let obj5 = {};
let num = [];
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService,GetQueryString} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import './AddRolePermissions.less';
import $ from 'jquery';
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
class AddRolePermissions extends Component {
	constructor(props){
    super(props);
    this.state = {
       menuPermissionsData:[],
      operationPermissionsData:[],
      info:{},
      menuPermissions:[],
      name:'',
      desp:'',
      value:[],
      menu:[],
      operation:[],
      roleId:GetQueryString(location.hash,['flag','roleId','isEdit']).roleId,
      isEdit:GetQueryString(location.hash,['flag','roleId','isEdit']).isEdit,
      disabled1:'',
      flag:GetQueryString(location.hash,['flag','roleId','isEdit']).flag,
      validUserno:{},
      key:1,
    };
  }


  componentWillMount(){
    if(this.state.flag == 'true'){
       this.setState({
          menuPermissions:[],
          operation:[],
       });
    }else{
      getService(API_PREFIX + `services/web/role/getRole/`+ this.state.roleId,data => {
        if (data.status == 1) {
            const arr5 = [];
            const arr6= [];
            data.root.object.codeList.map((item) => {
              if(item.length == 11){
                arr5.push(item);
              }else{
                arr6.push(item);
              }
            });
            this.setState({
              menu:arr5,
              operation:arr6,
            });
          this.setState({
            value:data.root.list,
            name:data.root.object.name,
            desp:data.root.object.desp,
          },() => {
            this.props.form.setFieldsValue({
                name: this.state.name,
                desp:this.state.desp,
            });
          });
        }else{     
          message.error(data.errorMsg);
        }
      });
    }
  }
  componentDidMount() {
/*    let param = GetQueryString(location.hash,['flag','roleId','isEdit']);
    this.setState({
      roleId:param.roleId,
      isEdit:param.isEdit,
      flag:param.flag,
    })
    console.log(param.flag == 'true')*/
    getService(API_PREFIX + `services/web/role/permission/menu/all`,data => {
      if (data.status === 1) {
        console.log(data);
        let powers = sessionStorage.getItem('permissions') //yelu 添加，根据登陆人员角色权限控制页面显示的菜单权限
        let menuPermissionsData = []
        data.root.object.forEach(item => {
          if(powers.indexOf(item.value) > -1) {
            let arr = []
            item.options.map(res => {
              if(powers.indexOf(res.value) > -1) {
                arr.push(res)
                // return res
              }
            })
            item.options = arr
            menuPermissionsData.push(item)
          }
        })
        this.setState({
          menuPermissionsData:menuPermissionsData,
        });
      }else{     
          message.error(data.errorMsg);
      }
    });
  }
  onChange = (value, checkedList) => {  //yelu 修改添加参数value区分复选框处理数据, 解决改变复选框的值其它复选框的值全部消失的问题
    let menu = this.state.menu;
    let arr = menu.filter((item, i) => {
      return item.split('.')[0] != value && item;
    });
    let result = [...arr, ...checkedList];
    this.setState({menu: result});
  // this.setState({
  //   menu:checkedList
  // })
}
  onChangeA = (value,checkedList)=>{  //yelu 修改添加参数value区分复选框处理数据, 解决改变复选框的值其它复选框的值全部消失的问题
    let operation = this.state.operation;
    let arr = operation.filter(item => {
        let str = item.split('.')[0] + '.' + item.split('.')[1];
        return str != value && item;
    });
    let result = [...arr, ...checkedList];
    this.setState({operation: result});
//     this.setState({
//       operation:checkedList
//     })
  }
  menuPermissions = () => {
    $(".ant-checkbox-group .ant-checkbox").each(function () {
        let node = $(this);
        if (node.hasClass("ant-checkbox-checked")) {
            num.push(node.children($("input")).val());
        }
    });
    console.log("num",num);
    const {operation} = this.state;
    console.log("operation",operation);
    if(this.state.key == '2'){
      var sum = Array.from(new Set([...num]));
    }else{
      if(this.state.isEdit){
        var sum = Array.from(new Set([...num,...operation]));
      }else{
        var sum = Array.from(new Set([...num]));
      }
      
    }
    this.setState({
      menuPermissions:sum,
    },() => {
      //var data = this.handleSubmit(); 
      let data;
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          data = values;
          if(this.state.menuPermissions && data){
            data.codeList = this.state.menuPermissions;
          }
          if(data != undefined){
             if(this.state.isEdit){
                data.id = this.state.roleId;
                postService(API_PREFIX + `services/web/role/update`,data,data => {
                  if (data.status == 1) {
                    this.setState({
                      operation:[],
                      sum:[],
                    });
                    num = [];
                    location.hash = 'EnterpriseConfig/RolePermissions';
                  }else{     
                    message.error(data.errorMsg);
                  }
                });
              }else{
                postService(API_PREFIX + `services/web/role/add`,data,data => {
                  if (data.status == 1) {
                    this.setState({
                      operation:[],
                      sum:[],
                    });
                    num = [];
                    location.hash = 'EnterpriseConfig/RolePermissions';
                  }else{     
                    message.error(data.errorMsg);
                  }
                });
              }
          }
        }
      });
    });
    
    
  }
  handleSubmit(){
    let value;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        value = values;
      }
    });
    return value;
  }
  onTabClick = (key) =>{
    this.setState({
      key:key,
    });
    let num1 = [];
    $(".ant-checkbox-group .ant-checkbox").each(function () {
        let node = $(this);
        if (node.hasClass("ant-checkbox-checked")) {
          console.log("node",node.children($("input")).val());
          if(node.children($("input")).val().length == 11){
            num1.push(node.children($("input")).val());
          }
        }
    });
    this.setState({
      operationPermissions:num1,
    },() => {
      console.log("12343",this.state.operationPermissions);
      if(key == '2'){
        postService(API_PREFIX + `services/web/role/permission/operation`,{menus:this.state.operationPermissions},data => {
          if (data.status === 1) {
            this.setState({
              operationPermission:data.root.object,
            });
          }else{     
              message.error(data.errorMsg);
          }
        });
      }
    });
    
  }
  handleConfirmPassword = (rule, value, callback) => {
      console.log("values",value);
      if(this.state.isEdit){
        if(value == undefined||value == ''){
          this.setState({
            validUserno:{
              retCode:1,
            },
          });
           callback();
        }else{
          postService(API_PREFIX + `services/web/role/checkName`,{"id":this.state.roleId,"name":value}, data => {
              if(data.status===1){//未重复
                this.setState({
                    validUserno:{
                      retCode:0,
                    },
                });
                callback();
              }else{//重复
                 this.setState({
                    validUserno:{
                      retCode:1,
                    },
                  });
                callback([new Error("角色名称已存在请勿重复添加!")]);
              }
              //callback()
          });
        }
      }else{
        if(value == undefined||value == ''){
          this.setState({
            validUserno:{
              retCode:1,
            },
          });
           callback();
        }else{
          postService(API_PREFIX + `services/web/role/checkName`,{"id":'',"name":value}, data => {
              if(data.status===1){//未重复
                this.setState({
                    validUserno:{
                      retCode:0,
                    },
                });
                callback();
              }else{//重复
                 this.setState({
                    validUserno:{
                      retCode:1,
                    },
                  });
                callback([new Error("角色名称已存在请勿重复添加!")]);
              }
              //callback()
          });
        }
      }
  }

  //点击全选设置
  onCheckAllChange(ti,options){ 
    console.log(options);
    console.log(this.state.menuPermissionsData);
    let titles=[];
    this.state.menuPermissionsData.map(b=>{
      titles.push(b.label);
    });
    let index=0;
    let menu=this.state.menu;
    titles.map(c=>{
      if(c===ti){
        if(menu.length>0){
            options.map(t=>{
              if(menu.indexOf(t.value)>0){
                index+=1;
              }
            });
        }
        if(index===0){
          options.map(v=>{
            menu.push(v.value);
          });
        }else{
          options.map(a=>{
            let indexO=menu.indexOf(a.value);
            if(indexO>-1){
              menu.splice(indexO,1);
            }
          });
        }
      }
    });
    this.setState({
      menu: menu,
    });
  }

  //权限操作点击全选设置
  onCheckAllChangeA(ti,options,PermissionsData){ 
    let titles=[];
    PermissionsData.map(b=>{
      titles.push(b.label);
    });
    let index=0;
    let operation=this.state.operation;
    titles.map(c=>{
      if(c===ti){
        if(operation.length>0){
            options.map(t=>{
              if(operation.indexOf(t.value)>0){
                index+=1;
              }
            });
        }
        if(index===0){
          options.map(v=>{
            operation.push(v.value);
          });
        }else{
          options.map(a=>{
            let indexO=operation.indexOf(a.value);
            if(indexO>-1){
              operation.splice(indexO,1);
            }
          });
        }
      }
    });
    this.setState({
      operation: operation,
    });
  }

  render() {
    const { getFieldDecorator} = this.props.form;
    const {disabled} = this.state;
    console.log("111111111111111111111111111",this.state.operation);
    console.log("222222222222222222222222222",this.state.menu);
    console.log('3333333333333333333333333', this.state.operationPermission)
    console.log('444444444444444444444444444', this.state.menuPermissionsData)
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return <div>
      <Row style={{marginTop:"50px",marginBottom:"20px"}}>
        
        <Form>
        <Col span={6}>
            <FormItem 
            label="角色名称" 
            //validateStatus={this.state.validUserno.retCode=='1'?'error':'success'}
            {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入角色名称,且最长为20个字符!',max:20 }, {
              validator: this.handleConfirmPassword,
            }],initialValue:name,
              })(
                <Input />
              )}
            </FormItem>
        </Col>
        <Col span={6}>
            <FormItem label="角色描述" {...formItemLayout}>
              {getFieldDecorator('desp', {
                rules: [{ required: true, message: '请输入角色描述,且最长为20个字符!' }],
              })(
                <Input />
              )}
            </FormItem>
        </Col>
        <Button type="primary" style={{display:"none"}} htmlType="submit" className='queryBtn'>
            保存
          </Button>
        </Form>
      </Row>
      <Tabs defaultActiveKey="1" onTabClick={this.onTabClick}>
        <TabPane tab="菜单权限" key="1">
          {
            this.state.menuPermissionsData&&this.state.menuPermissionsData.map((item,index) => {
             return <div className="div" style={{height:"50px",display: "table"}} key={index}><span className="span" onClick={()=>this.onCheckAllChange(item.label,item.options)}>{item.label}</span>
             <CheckboxGroup options={item.options} disabled={disabled}  
             value={this.state.menu} 
             onChange={this.onChange.bind(this, item.value)} /></div>;
            })
          }
        </TabPane>
        <TabPane tab="操作权限" key="2">
          {
            this.state.operationPermission&&this.state.operationPermission.map((item1,index1) => {
              return <div key={index1} className="div1">
                <span className="title">{item1.label}</span> 
              { 
                item1.options.map((item,index) => {
                  return <div key={index} className="div" style={{height:"50px",display: "table"}}> 
                  <span className="span" onClick={()=>this.onCheckAllChangeA(item.label,item.options,item1.options)}>{item.label}</span>
                  <CheckboxGroup options={item.options} value={this.state.operation} onChange={this.onChangeA.bind(this,item.value)}/>
               
                  </div>;
                })
              }
              </div>;
            })
          }
        </TabPane>
      </Tabs>
      <Button style={{marginLeft: "45%",marginTop: "30px",marginBottom:"28px"}}  className="resetBtn" type="primary" onClick={() => location.hash='EnterpriseConfig/RolePermissions'}>返回</Button>
      { this.state.flag == "false" &&this.state.isEdit == "false" ? null :
        <Button className="queryBtn" type="primary" onClick={this.menuPermissions.bind(this)}>保存</Button> }
          {/*<a href="javascript:history.back(-1);">返回</a>*/}
    </div>;
  }
}

export default AddRolePermissions;
