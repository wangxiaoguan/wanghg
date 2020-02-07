import React, { Component } from 'react';
import { Form,  Input, Button, Checkbox,Select,Radio,InputNumber,message,Cascader,Row,Col} from 'antd';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import { connect } from 'react-redux';
import TreeList from '../../../component/tree/TreeList';
import API_PREFIX from '../../apiprefix';
import {RuleConfig} from  '../../ruleConfig';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

// @connect(state => ({
//   checkData: state.tree.treeSelectData.department,
// }))

@Form.create()
class detail extends Component{
  constructor(props){
    super(props);
    this.state= {
      Id:GetQueryString(location.hash,['id','isEdit']).id,//定义id，用来查询详情信息
      displayWarn: false,  //人为控制  所属部门的的必填属性校验
      userId: '',//定义id，用来查询详情信息
      isEdit: GetQueryString(location.hash,['id','isEdit']).isEdit,  //定义该页面的属性  编辑？新建
      roles: '',// 该用户拥有的所有角色，通过查询接口获取
      userInfo: '',//编辑时，页面传过来的用户的基本信息，通过接口查询获取
    };
  }

  componentWillMount(){
    console.log('this.state.isEdit===>',this.state.isEdit);
    console.log('this.state.Id=====>',this.state.Id);
    if(this.state.isEdit=="true"){
        getService(API_PREFIX+`services/web/config/VersionInfo/getList/1/1?Q=id=${this.state.Id}`,data=>{
          console.log('data====>',data);
          if(data.status===1){
            this.setState(
              {
                userInfo:data.root.list[0],
              }
          );
          }else{
            message.error(data.errorMsg);
          }
        });
      }
  }
  
  
 

  
  render(){
      const Option = Select.Option;
      const provinceData = ['Android', 'IOS','TV', 'Windows'];
    //设置formItem的格式
    const formItemLayout ={ 
      labelCol: {
        xs: { span: 14 },
        sm: { span: 8},
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 8 },
      },
     };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    //获取数据
    const { getFieldDecorator } = this.props.form;
    //树型控件选中的数据
    // const treeCheckData= this.props.checkData;
    // console.log("选中的数据为---",treeCheckData);
    
    //临时变量，存放每个字段的默认值
    let nearCode='';
    let versionName='';
    let type='';
    let downLoadAddr='';
    let need=false;
    let log='';
    let length='';
    let remark='';
    let isGray=false;
    if(this.state.isEdit=='true'){//编辑，则默认值是查询到的值
      console.log('this.state.userInfo', this.state.userInfo);
      nearCode=this.state.userInfo.nearCode;
      versionName=this.state.userInfo.versionName;
      downLoadAddr=this.state.userInfo.downLoadAddr;
      // type=this.state.userInfo.type;
      if(this.state.userInfo.versionType===1){
        type='Android';
      }
      if(this.state.userInfo.versionType===2){
        type='IOS';
      }
      if(this.state.userInfo.versionType===3){
        type='TV';
      }
      if(this.state.userInfo.versionType===4){
        type='Windows';
      }
      need=this.state.userInfo.isNeed;
      log=this.state.userInfo.versionLog;
      length=this.state.userInfo.versionLength;
      remark=this.state.userInfo.remark;
      isGray=this.state.userInfo.isGray ?true:false;
      
      console.log('log',this.state.userInfo.log);
      // console.log('*********eduDf',eduDf);
      // sexDf=this.state.userInfo.sex=='男'?true:false;
      // isGrayUserDf=this.state.userInfo.isGrayUser;
      // belongsDepartDf=this.state.userInfo.orginfo?this.state.userInfo.orginfo.split(','):[];
      // assignRolesDf=this.state.userInfo.roleIds?this.state.userInfo.roleIds.split(','):[];
      // console.log("assignRolesDf",assignRolesDf);
    }


    return(
      <div className="new-user-main">
        <Form onSubmit={this.handleSubmit}>
         
              <FormItem
                {...formItemLayout}
                label="版本号"
              >
                {
                 getFieldDecorator('nearCode',
                 {
                   rules: [{ required: true, message: '请输入版本号'}, {
                   //validator: this.handleValidMobile
                 }],
                   initialValue:nearCode})(
               <Input disabled={true}/>
             )
                }
              </FormItem>
           
              <FormItem
                {...formItemLayout}
                label="版本名称"
              >
                {
                 getFieldDecorator('versionName',
                 {
                   rules: [{ required: true, message: '请输入版本名称'}, {
                     //validator: this.handleValidMobile
                   }],
                   initialValue:versionName})(
               <Input disabled={true}/>
             )
                }
              </FormItem>
              <FormItem 
        label="平台类型" 
        {...formItemLayout}>
          {getFieldDecorator('versionType', {
            rules: [{ required: true, message: '请输入选项'}, {
              //validator: this.handleValidMobile
            }],
            initialValue:type,
          })(
            <Select
              // defaultValue="请选择"
              style={{ width: 120 }}
              disabled={true}
            >
            {provinceData.map(province => <Option key={province}>{province}</Option>)}
            </Select>
          )}
        </FormItem>
              <FormItem
                {...formItemLayout}
                label="下载地址"
                // help={this.state.validEmail.retCode=='0'?this.state.validEmail.retMsg:''}
              >
                {
                  getFieldDecorator('downLoadAddr', {
                    rules: [ 
                        {type:'url',message:'您输入的下载地址格式不正确，请输入正确的下载地址'},
                        {required: true, message: '请输入下载地址'},
                        ], 
                        initialValue: downLoadAddr,
                  })(
                    <Input disabled={true}/>
                  )
                }
              </FormItem>
           
            <FormItem
              {...formItemLayout}
              label="是否强制升级"
            >
              {
                getFieldDecorator('isNeed',{initialValue:need})(
                  <RadioGroup disabled={true}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="更新日志"
              >
                {
                  getFieldDecorator('versionLog',
                      {initialValue:log,...RuleConfig.lastnameConfig})(
                    <TextArea
                    disabled={true}
                    style={{ height: 300 }}
                    />
                  )
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="大小"
              >
                {
                  getFieldDecorator('versionLength',
                      {initialValue:length,...RuleConfig.lastnameConfig})(
                    <Input disabled={true}　style={{width:'90%'}}/>
                  )
                }　{
                  this.state.userInfo.versionType===4?(<span>B</span>):(<span>M</span>)
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="描述"
              >
                {
                  getFieldDecorator('remark',
                      {initialValue:remark,...RuleConfig.lastnameConfig})(
                    <TextArea
                    style={{ height: 150 }}
                    disabled={true}
                    />
                  )
                }
              </FormItem>
              {/* <FormItem
              {...formItemLayout}
              label="是否推送"
            >
              {
                getFieldDecorator('need',{initialValue:need})(
                  <RadioGroup>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </RadioGroup>
                )
              }
            </FormItem> */}
            {/* <FormItem
              {...formItemLayout}
              label="是否为灰度版本"
            >
              {
                getFieldDecorator('isGray',{initialValue:isGray})(
                  <RadioGroup>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </RadioGroup>
                )
              }
            </FormItem> */}
          <FormItem>
            <Row>
                <Col span={2}  offset={8}><Button className="resetBtn" onClick={()=>location.hash = '/SystemSettings/VersionInformation/VersionInformation'}>返回</Button></Col>
            </Row>
          </FormItem>
        </Form>


      </div>


    );
  }
}
export default detail;