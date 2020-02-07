import React, { Component } from 'react';
import TableAndSearch from '../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Select,Tabs,Checkbox,Row,Col} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
var arr = [];
var obj = {};
var arr5 = [];
var obj5 = {};
var optionS=[];
var num = [];
import {  BEGIN,getDataSource,getPageData } from '../../../redux-root/action';
import {connect} from 'react-redux';
import {postService,getService,GetQueryString} from '../myFetch';
import ServiceApi from '../apiprefix';
import './AddVersionManagement.less'
//import './AddRolePermissions.less';
import $ from 'jquery';
@connect(
  state => ({
    dataSource: state.tableData,
    pageData:state.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
@Form.create()
class AddVersionManagement extends Component {
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
      key:1
    }
  }

  componentWillMount(){
     if(this.state.flag == 'true'){
       this.setState({
          menuPermissions:[],
          operation:[],
       })
    }else{
      getService(ServiceApi + `services/system/edition/permission/`+ this.state.roleId,data => {
        if (data.retCode == 1) {
            const arr5 = [];
            const arr6= [];
            data.root.list.map((item) => {
              if(item.length == 11){
                arr5.push(item)
              }else{
                arr6.push(item)
              }
            })
            this.setState({
              menu:arr5,
              operation:arr6
            })
          this.setState({
            value:data.root.list,
            name:data.root.object.name,
            desp:data.root.object.desp,
          },() => {
            this.props.form.setFieldsValue({
                name: this.state.name,
                desp:this.state.desp
            });
          })
        }else{     
            
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
    getService(ServiceApi + `services/system/edition/permission/menu/all`,data => {
      if (data.retCode == 1) {
        console.log('menuPermissionsData==>',data)
        this.setState({
          menuPermissionsData:data.root.list
        })
      }else{     
          
      }
    });
  }
  onChange = (checkedList) => {
    this.setState({
      menu:checkedList
    })
  }
  menuPermissions = () => {
    //this.handleSubmit()
    $(".ant-checkbox-group .ant-checkbox").each(function () {
        var node = $(this)
        if (node.hasClass("ant-checkbox-checked")) {
            num.push(node.children($("input")).val())
        }
    })
    console.log("num",num)
    const {operation} = this.state;
    console.log("operation",operation)
    if(this.state.key == '2'){
      var sum = Array.from(new Set([...num]))
    }else{
      if(this.state.isEdit){
        var sum = Array.from(new Set([...num,...operation]))
      }else{
        var sum = Array.from(new Set([...num]))
      }
      
    }
    this.setState({
      menuPermissions:sum
    },() => {
      //var data = this.handleSubmit(); 
      var data;
      this.props.form.validateFields((err, values) => {
      if (!err) {
          console.log('Received values of form: ', values);
          data = values;
          if(this.state.menuPermissions && data != undefined){
            data.permissions = this.state.menuPermissions;
          }
          if(data != undefined){
             if(this.state.isEdit){
                data.id = this.state.roleId;
                postService(ServiceApi + `services/system/edition/update`,data,data => {
                  if (data.retCode == 1) {
                    this.setState({
                      operation:[],
                      sum:[]
                    })
                    num = []
                    location.hash = 'SystemSettings/versionManagement'
                  }else{     
                      
                  }
                });
              }else{
                postService(ServiceApi + `services/system/edition/add`,data,data => {
                  if (data.retCode == 1) {
                    this.setState({
                      operation:[],
                      sum:[]
                    })
                    num = []
                    location.hash = 'SystemSettings/versionManagement'
                  }else{     
                      
                  }
                });
              }
          }
        }
      });
    })
    
    
  }
 /* handleSubmit(){
    var value;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        value = values;
      }
    });
    return value;
  }*/
  onTabClick = (key) =>{
    this.setState({
      key:key
    })
    var num1 = []
    $(".ant-checkbox-group .ant-checkbox").each(function () {
        var node = $(this)
        if (node.hasClass("ant-checkbox-checked")) {
          console.log("node",node.children($("input")).val())
          if(node.children($("input")).val().length == 11){
            num1.push(node.children($("input")).val())
          }
        }
    })
    this.setState({
      operationPermissions:num1
    },() => {
      console.log("12343",this.state.operationPermissions)
      if(key == '2'){
        postService(ServiceApi + `services/system/edition/permission/operation`,{menuPermission:this.state.operationPermissions},data => {
          if (data.retCode == 1) {
            this.setState({
              operationPermission:data.root.list
            })
          }else{     
              
          }
        });
      }
    })
    
  }
  handleConfirmPassword = (rule, value, callback) => {
      console.log("values",value)
      if(this.state.isEdit){
        if(value == undefined||value == ''){
          this.setState({
            validUserno:{
              retCode:1,
            }
          });
           callback()
        }else{
          postService(ServiceApi + `services/system/edition/check/name`,{"id":this.state.roleId,"name":value}, data => {
              if(data.retType==0){
                this.setState({
                    validUserno:{
                      retCode:0,
                    }
                });
                callback()
              }else{
                 this.setState({
                    validUserno:{
                      retCode:1,
                    }
                  });
                callback([new Error("版本名称已存在请勿重复添加!")])
              }
              //callback()
          })
        }
      }else{
        if(value == undefined||value == ''){
          this.setState({
            validUserno:{
              retCode:1,
            }
          });
           callback()
        }else{
          postService(ServiceApi + `services/system/edition/check/name`,{"id":96371236132,"name":value}, data => {
              if(data.retType==0){
                this.setState({
                    validUserno:{
                      retCode:0,
                    }
                });
                callback()
              }else{
                 this.setState({
                    validUserno:{
                      retCode:1,
                    }
                  });
                callback([new Error("版本名称已存在请勿重复添加!")])
              }
              //callback()
          })
        }
      }
  }

  onCheckAllChange(ti,options){
    console.log(options)
    console.log(this.state.menuPermissionsData)
    var titles=[];
    this.state.menuPermissionsData.map(b=>{
      titles.push(b.label)
    })
    var index=0
    var menu=this.state.menu
    titles.map(c=>{
      if(c===ti){
        if(menu.length>0){
            options.map(t=>{
              if(menu.indexOf(t.value)>0){
                index+=1
              }
            })
        }
        if(index===0){
          options.map(v=>{
            menu.push(v.value)
          })
        }else{
          options.map(a=>{
            var indexO=menu.indexOf(a.value)
            if(indexO>-1){
              menu.splice(indexO,1)
            }
          })
        }
      }
    })
    this.setState({
      menu: menu
    });
  }

  render() {
    const { getFieldDecorator} = this.props.form;
    const {disabled} = this.state;
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
        <Form onSubmit={this.handleSubmit}>
        <Col span={6}>
            <FormItem 
            label="版本名称" 
            //validateStatus={this.state.validUserno.retCode=='1'?'error':'success'}
            {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入版本名称,且最长为20个字符!',max:20 }, {
              validator: this.handleConfirmPassword,
            }],initialValue:name,
              })(
                <Input />
              )}
            </FormItem>
        </Col>
        <Col span={6}>
            <FormItem label="版本描述" {...formItemLayout}>
              {getFieldDecorator('desp', {
                rules: [{ required: true, message: '请输入版本描述,且最长为20个字符!' }],
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
             <CheckboxGroup options={item.options} disabled={disabled}  value={this.state.menu} onChange={this.onChange.bind(this)} /></div>
            })
          }
        </TabPane>
        <TabPane tab="操作权限" key="2">
          {
            this.state.operationPermission&&this.state.operationPermission.map((item,index) => {
              return <div key={index} className="div1">
                <span className="title">{item.label}</span> 
              { 
                item.options.map((item,index) => {
                  return <div key={index+'1'} className="div" style={{height:"50px",display: "table"}}> 
                  <span className="span">{item.label}</span>
                  <CheckboxGroup options={item.options} defaultValue={this.state.operation}  />
               
                  </div>
                })
              }
              </div>
            })
          }
        </TabPane>
      </Tabs>
      <Button style={{marginLeft: "460px",marginTop: "30px",marginBottom:"30px"}}  className="resetBtn" type="primary" onClick={() => location.hash='SystemSettings/versionManagement'}>返回</Button>
      { this.state.flag == "false" &&this.state.isEdit == "false" ? null :
        <Button className="queryBtn" type="primary" onClick={this.menuPermissions.bind(this)}>保存</Button> }
          {/*<a href="javascript:history.back(-1);">返回</a>*/}
    </div>;
  }
}

export default AddVersionManagement;
