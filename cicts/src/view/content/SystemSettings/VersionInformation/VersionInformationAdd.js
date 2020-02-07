import React, { Component } from 'react';
import { Form,  Input, Button, Checkbox,Select,Radio,InputNumber,message,Cascader,Row,Col,Upload,Icon} from 'antd';
import {postService,GetQueryString,getService ,plateTypeuploadService} from '../../myFetch.js';
import { connect } from 'react-redux';
import TreeList from '../../../component/tree/TreeList';
import API_PREFIX,{API_FILE_VIEW} from '../../apiprefix';
import {RuleConfig} from  '../../ruleConfig';
import './version.less';
import SparkMD5 from 'spark-md5';

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

// @connect(state => ({
//   checkData: state.tree.treeSelectData.department,
// }))

@Form.create()
class VersionInformationAdd extends Component{
  constructor(props){
    super(props);
    this.state= {
      // checkData:this.props.checkData,//数选择的数据
      displayWarn: false,  //人为控制  所属部门的的必填属性校验
      userId: '',//定义id，用来查询详情信息
      isEdit: false,  //定义该页面的属性  编辑？新建
      roles: '',// 该用户拥有的所有角色，通过查询接口获取
      userInfo: '',//编辑时，页面传过来的用户的基本信息，通过接口查询获取
      organizations: [],//部门中的数据，通过接口获取
      ownAdmindRole:false,//当前登录用户是否拥有最高管理员权限，用于控制 “分配角色”功能是否显示，是，则显示，否则，不显示
      validMobile:{},  //校验手机号的信息
      validEmail:{},//校验邮箱的信息
      validUserno:{},//校验员工号的信息
      platType:'',//新建默认平台类型为空
      fileList: [],
      loading:false,
      FileByte:'',
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
    };
  }

  componentWillMount(){

  }
  

  //表单提交事件处理   注意，给后端传入数据时，需要将 表单中的数据 以及 树 中的数据一起传入
  handleSubmit = (e) => {
    e.preventDefault();
    //树中数据的校验    判断是否选择了树
    this.props.form.validateFields((err, fieldsValue) => {
      // console.log("选中的树中的数据是：",this.props.checkData)
      // if(this.props.checkData.length===0||!this.props.checkData){
      //   this.setState({displayWarn:true})
      //   return;
      // }
      if (!err) {
        if(fieldsValue.versionType === 'Android'){
          fieldsValue.versionType = 1;
        }
        if(fieldsValue.versionType === 'IOS'){
          fieldsValue.versionType = 2;
        }
        if(fieldsValue.versionType === 'TV'){
          fieldsValue.versionType = 3;
        }
        if(fieldsValue.versionType === 'Windows'){
          fieldsValue.versionType = 4;
          fieldsValue.versionLength=fieldsValue.length1;
          if(this.state.fileList&&this.state.fileList.length!==0){
            fieldsValue.downLoadAddr=this.state.ossViewPath+this.state.fileList[0].Download;
            fieldsValue.md5=this.state.fileList[0].FileMD5;
          }else{
            message.error('请上传附件');
            return false;
          }
          delete fieldsValue.downLoad;
          delete fieldsValue.length1;
        }

        //表单中的数据
      console.log('表单中的值为2222222222：',fieldsValue);
      const values={...fieldsValue};
      console.log('表单中的值为：',values);
      postService(API_PREFIX + 'services/web/config/VersionInfo/add', values, data => {
        if (data.status == 1&&data.root.object===1) {
          message.success('新增成功！');
          location.hash = '/SystemSettings/VersionInformation/VersionInformation';
        } else {
          message.error(data.errorMsg);
        }
      });
      }
      
  

    });
  }

  //切换平台类型
  platformType=(value)=>{
    this.setState({platType:value});
}

//文件上传
uploadBefore = file => {
  let fileTypes = [
    'zip',
  ];
  if (!fileTypes.includes(file.name.split('.').pop())) {
    message.warning('上传的文件类型不支持！');
    return false;
  }
  this.setState({ loading: true });
  let { fileList } = this.state;
  let that=this;
  if(fileList&&fileList.length!==0&&fileList.length>=1){//限制只能上传一个文件
    message.error('只能上传一个文件');
    this.setState({ loading: false });
    return ;
  }
  
    let chunkSize = 2097152,                             // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();
 
    fileReader.onload = function (e) {
        console.log('read chunk nr', currentChunk + 1, 'of', chunks);
        spark.append(e.target.result);                   // Append array buffer
        currentChunk++;
 
        if (currentChunk < chunks) {
            loadNext();
        } else {
         
            plateTypeuploadService(API_PREFIX+`services/web/file/upload/AttachmentUpload/system`,file,callback=>{
              if(callback.status===1){
                let fileObj={
                  uid:`${file.uid}`,
                  fileName:`${file.name}`,
                  name:`${file.name}`,
                  url:callback.root.object[0].filePath,
                  FileMD5:spark.end(),
                  Download:callback.root.object[0].filePath,
                  FileByte:Math.floor(file.size/1024),
                };
                fileList.push(fileObj);
                that.props.form.setFieldsValue({
                  length1:Math.floor(file.size/1024),
                });
                that.setState({ loading: false,fileList,FileByte:Math.floor(file.size/1024) });
                message.success('上传成功');
          
              }else{
                message.error(callback.errorMsg);
                that.setState({ loading: false });
              }
            });
        }
    };
 
    fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
    };
 
    function loadNext() {
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice, //yelu 计算要上传文件的md5值
         start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
 
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
 
    loadNext();

 
};
// fileChange = (info) => {
//     console.log('我们都是一家人', info);
//       const status = info.file.status;
//       let fileList = [...info.fileList];
     
//       if (status === 'uploading') {
//         if (!info.file.response) {
//             message.error('请检查接口状态！');
//             this.setState({ loading: false });
//         }
//       }
//       if (status === 'done') {
//         if (info.file.response!=='') {
//           let file = info.file;
//           message.success(`${info.file.name}上传成功。`);
//           let callback = info.file.response;
//           let fileObj={
//             uid:`${file.uid}`,
//             fileName:`${file.name}`,
//             name:`${file.name}`,
//             url:callback.root.Download,
//             FileMD5:callback.root.FileMD5,
//             Download:callback.root.Download,
//             FileByte:callback.root.FileByte,
//           };
//           fileList.push(fileObj);
//           this.props.form.setFieldsValue({
//             length1:callback.root.FileByte,
//           });
//           this.setState({ loading: false,fileList,FileByte:callback.root.FileByte });
          
//         }else{
//             message.error('请检查接口状态！');
//             this.setState({ loading: false });
//         }
//       } else if (status === 'error') {
//         message.error(`${info.file.name} 上传失败。`);
//         this.setState({ loading: false });
//       }
// }
//移除上传的文件
removeFile=(uid)=>{
  let {fileList}=this.state;
  let temp = fileList.filter(item => item.uid !== uid.uid);
  this.setState({ fileList: temp });
}

//下载文件
downloadFile=(file)=>{
  window.open(this.state.ossViewPath+`${file.Download}`);
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
    //临时变量，存放每个字段的默认值
    let nearCode='';
    let versionName='';
    let type='';
    let downLoadAddr='';
    let isNeed=false;
    let log='';
    let length='';
    let remark='';
    let isGray=false;
    // if(this.state.isEdit=='true'){//编辑，则默认值是查询到的值
    //   console.log('this.state.userInfo', this.state.userInfo);
    //   usernoDf=this.state.userInfo.userno;
    //   lastnameDf=this.state.userInfo.lastname;
    //   emailDf=this.state.userInfo.email;
    //   mobileDf=this.state.userInfo.mobile;
    //   ageDf=this.state.userInfo.age;
    //   edu=this.state.userInfo.edu;

    //   // console.log('*********eduDf',eduDf);
    //   sexDf=this.state.userInfo.sex=='男'?true:false;
    //   isGrayUserDf=this.state.userInfo.isGrayUser;
    //   belongsDepartDf=this.state.userInfo.orginfo?this.state.userInfo.orginfo.split(','):[];
    //   assignRolesDf=this.state.userInfo.roleIds?this.state.userInfo.roleIds.split(','):[];
    //   console.log("assignRolesDf",assignRolesDf);
    // }
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
                        rules: [
                          { 
                            required: true,
                            message: '请输入版本号',
                          }, 
                          {
                            validator:(rule, value, callback)=>{
                              let reg=/^[0-9]+$/;
                              if(value&&!reg.test(value)){
                                callback('版本号只能为正整数');
                              }
                              callback();
                            },
                          },
                    ],
                        initialValue:nearCode})(
                    <Input/>
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
                    <Input/>
                  )
                }
              </FormItem>
              <FormItem 
        label="平台类型" 
        {...formItemLayout}>
          {getFieldDecorator('versionType', {
            rules: [{ required: true, message: '请选择平台类型'}, {
              //validator: this.handleValidMobile
            }],
            initialValue:type,
          })(
            <Select
              style={{ width: 120 }}
              onChange={this.platformType}
            >
            {provinceData.map(province => <Option key={province}>{province}</Option>)}
            </Select>
          )}
        </FormItem>
            {this.state.platType==='Windows'?(
                <FormItem
                {...formItemLayout}
                label="文件上传"
              >
                {
                  getFieldDecorator('downLoad', {
                    initialValue:[],
                    rules: [
                      {
                      required: true,
                      validator: (rule, value, callback) => {
                        if (value&&value.fileList&&value.fileList.length>0) {
                            if(typeof value === 'string' || 'array'){
                              callback();
                            }
                        } else {
                          callback('文件为必传项');
                        }
                        callback();
                      },
                    }],
                  })(
                    <Upload
                    name=""
                    accept=".zip"
                    fileList={this.state.fileList}
                    beforeUpload={this.uploadBefore}
                    showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                    onRemove={this.removeFile}
                    onPreview={this.downloadFile}
                    // onChange={this.fileChange}
                  >
                    <Button  loading={this.state.loading}
                    >
                      <Icon type="upload" />
                      上传文件
                    </Button>
                    <span style={{marginLeft: 10,color: 'red'}}>仅支持zip类型的文件！</span>
                  </Upload>
                   )
                 }
              </FormItem>
            ):(
              <FormItem
              {...formItemLayout}
              label="下载地址"
              validateStatus={this.state.validEmail.retCode=='0'?'error':'success'}
              // help={this.state.validEmail.retCode=='0'?this.state.validEmail.retMsg:''}
            >
              {
                getFieldDecorator('downLoadAddr', {
                  rules: [{required: true, message: '请输入下载地址'}, {
              }], initialValue: downLoadAddr,
                })(
                  <Input/>
                )
              }
            </FormItem>
            )
          }
           
            <FormItem
              {...formItemLayout}
              label="是否强制升级"
            >
              {
                getFieldDecorator('isNeed',{initialValue:isNeed})(
                  <RadioGroup>
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
                      {initialValue:log,...RuleConfig.updateLog})(
                    <TextArea
                    style={{ height: 300 }}
                    />
                  )
                }
              </FormItem>
              {
                this.state.platType==='Windows'&&this.state.FileByte&&this.state.FileByte!==''?(
                  <FormItem
                  {...formItemLayout}
                  label="大小"
                >
                  {
                    getFieldDecorator('length1',
                    {initialValue: this.state.FileByte,
                      rules: [{
                        type:'number',
                        required: true,
                        validator: (rule, value, callback) => {
                          if(!value){
                            callback('大小为必填项');
                          }else if(!(/^[0-9.]+$/.test(value))) {
                            callback('大小只能为数字')
                          }else if(value<=0){
                            callback('数值必须大于0');
                          }else if(isNaN(value)){
                            callback('数值不为数字');
                          }else{
                            callback();
                          }
                        },
                    }],
                  })(
                      <Input style={{width:'90%'}} disabled/>
                    )
                  }　B
                </FormItem>
                ):(
                  <FormItem
                  {...formItemLayout}
                  label="大小"
                >
                  {
                    getFieldDecorator('versionLength',
                    {initialValue:length,
                      rules: [{
                        type:'number',
                        required: true,
                        validator: (rule, value, callback) => {
                          if(!value){
                            callback('大小为必填项');
                          }else if(!(/^[0-9.]+$/.test(value))) {
                            callback('数值只能为数字')
                          }else if(value<=0){
                            callback('数值必须大于0');
                          }else if(isNaN(value)){
                            callback('数值不为数字');
                          }else{
                            callback();
                          }
                        },
                    }],
                  })(
                      <Input style={{width:'90%'}}/>
                    )
                  }　M
                </FormItem>
                )
              }
              <FormItem
                {...formItemLayout}
                label="描述"
              >
                {
                  getFieldDecorator('remark',
                      {initialValue:remark,...RuleConfig.describeRemark})(
                    <TextArea
                    style={{ height: 150 }}
                    />
                  )
                }
              </FormItem>
              {/* <FormItem
              {...formItemLayout}
              label="是否推送"
            >
              {
                getFieldDecorator('sexType',{initialValue:sexDf})(
                  <RadioGroup>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </RadioGroup>
                )
              }
            </FormItem> */}
            <FormItem
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
            </FormItem>
          <FormItem>
            <Row>
                <Col span={2}  offset={8}><Button className="resetBtn" onClick={()=>location.hash = '/SystemSettings/VersionInformation/VersionInformation'}>返回</Button></Col>
                <Col span={2} ><Button className="queryBtn" type="primary" onClick={this.handleSubmit}>保存</Button></Col> 
            </Row>
          </FormItem>
        </Form>


      </div>


    );
  }
}
export default VersionInformationAdd;