import React, { Component } from 'react';
import { Form,  Input, Button, Checkbox,Select,Radio,InputNumber,message,Cascader,Row,Col,Upload,Icon} from 'antd';
import {postService,GetQueryString,getService,plateTypeuploadService } from '../../myFetch.js';
import { connect } from 'react-redux';
import TreeList from '../../../component/tree/TreeList';
import API_PREFIX,{API_FILE_VIEW} from '../../apiprefix';
import {RuleConfig} from  '../../ruleConfig';
import SparkMD5 from 'spark-md5';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

// @connect(state => ({
//   checkData: state.tree.treeSelectData.department,
// }))

@Form.create()
class VersionInformationAdd extends Component{
  constructor(props){
    super(props);
    this.state= {
      Id:GetQueryString(location.hash,['id','isEdit']).id,//定义id，用来查询详情信息
      displayWarn: false,  //人为控制  所属部门的的必填属性校验
      userId: '',//定义id，用来查询详情信息
      isEdit: GetQueryString(location.hash,['id','isEdit']).isEdit,  //定义该页面的属性  编辑？新建
      roles: '',// 该用户拥有的所有角色，通过查询接口获取
      userInfo: '',//编辑时，页面传过来的用户的基本信息，通过接口查询获取
      platType:'',//新建默认平台类型为空
      fileList: [],
      loading:false,
      FileByte:'',
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
    };
  }

  componentWillMount(){
    if(this.state.isEdit=="true"){
        getService(API_PREFIX+`services/web/config/VersionInfo/getList/1/1?Q=id=${this.state.Id}`,data=>{
          console.log('data====>',data);
          if(data.root.list[0].length!==0&&data.root.list[0].versionType===4){
            let NewFile=[];
            let fileObj={
              uid:1,
              name:data.root.list&&data.root.list[0].downLoadAddr&&data.root.list[0].downLoadAddr.split('/')&&data.root.list[0].downLoadAddr.split('/').pop(),
              url:data.root.list[0]&&data.root.list[0].downLoadAddr,
              FileMD5:data.root.list[0]&&data.root.list[0].md5,
              Download:data.root.list[0]&&data.root.list[0].downLoadAddr,
            };
            NewFile.push(fileObj);
            if(data.root.list[0].versionType===4){
              this.setState({platType:'Windows',FileByte:data.root.list[0].versionLength});
            }
            this.setState({ fileList:NewFile});
          }
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
  

  //表单提交事件处理   注意，给后端传入数据时，需要将 表单中的数据 以及 树 中的数据一起传入
  handleSubmit = (e) => {
    e.preventDefault();
    //树中数据的校验    判断是否选择了树
    console.log("*****************");
    this.props.form.validateFields((err, fieldsValue) => {
      // console.log("选中的树中的数据是：",this.props.checkData)
      // if(this.props.checkData.length===0||!this.props.checkData){
      //   this.setState({displayWarn:true})
      //   return;
      // }
      if (!err) {
         //表单中的数据
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
          if(this.state.fileList[0].Download.indexOf('http')>-1){
            fieldsValue.downLoadAddr=this.state.fileList[0].Download;
          }else{
            fieldsValue.downLoadAddr=this.state.ossViewPath+this.state.fileList[0].Download;
          }
          fieldsValue.md5=this.state.fileList[0].FileMD5;
        }else{
          message.error('请上传附件');
          return false;
        }
        delete fieldsValue.downLoad;
        delete fieldsValue.length1;
      }

      const values={...fieldsValue,
        id:this.state.Id,
        // 'orginfo':fieldsValue.orginfo?fieldsValue.orginfo[fieldsValue.orginfo.length-1]:'',
        // 'roleids':fieldsValue.roleids.toString(),
        // 'oldEmail':this.state.isEdit=='true'&&this.state.userInfo?this.state.userInfo.email:'',//编辑时需要传入旧的email
      };
      //区分编辑和新增，调用不同的接口
      if(this.state.isEdit=='true'){//调用编辑的接口
        let realValues={
          ...values,
        };
        postService(API_PREFIX + 'services/web/config/VersionInfo/update', realValues, data => {
          if (data.status === 1&&data.root.object===1) {
            message.success('修改成功！');
            location.hash = '/SystemSettings/VersionInformation/VersionInformation';
          } else {
            message.error(data.errorMsg);
          }
        });
      }
      }
    });
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
        console.log('callback====>',callback);
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

   //切换平台类型
   platformType=(value)=>{
    this.setState({platType:value});
}

//移除上传的文件
removeFile=(uid)=>{
  let {fileList}=this.state;
  let temp = fileList.filter(item => item.uid !== uid.uid);
  this.setState({ fileList: temp });
}

  //下载文件
downloadFile=(file)=>{
  if(file.Download.indexOf('http')>-1){
    window.open(`${file.Download}`);
  }else{
    window.open(this.state.ossViewPath+`${file.Download}`);
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
      nearCode=String(this.state.userInfo.nearCode);
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
                    rules: [
                      { required: true,
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
            rules: [{ required: true, message: '请输入选项'}, {
              //validator: this.handleValidMobile
            }],
            initialValue:type,
          })(
            <Select
              // defaultValue="请选择"
              style={{ width: 120 }}
              onChange={this.platformType}
            >
            {provinceData.map(province => <Option key={province}>{province}</Option>)}
            </Select>
          )}
        </FormItem>
        {
          this.state.platType==='Windows'?(
            <FormItem
            {...formItemLayout}
            label="文件上传"
          >
            {
              getFieldDecorator('downLoad', {
                initialValue: this.state.fileList.length!==0?this.state.fileList:[],
                rules: [
                  {
                  required: true,
                  whitespace: true,
                  validator: (rule, value, callback) => {
                    if (value &&value.fileList&&value.fileList.length!==0&&value.fileList[0]!=='' > 0||value.length!==0) {
                        callback();
                    } else {
                      callback('文件为必传项');
                    }
                    callback();
                  },
                }, {
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
              >
                <Button loading={this.state.loading}>
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
                getFieldDecorator('isNeed',{initialValue:need})(
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
                      {initialValue:log,...RuleConfig.lastnameConfig})(
                    <TextArea
                    style={{ height: 300 }}
                    />
                  )
                }
              </FormItem>
              {this.state.platType==='Windows'?(
                    <FormItem
                    {...formItemLayout}
                    label="大小"
                  >
                    {
                      getFieldDecorator('length1',
                      {initialValue:this.state.FileByte,
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
                          }else if(value>1000){
                            callback('数值不得大于1000');
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
              )}
              <FormItem
                {...formItemLayout}
                label="描述"
              >
                {
                  getFieldDecorator('remark',
                      {initialValue:remark,...RuleConfig.lastnameConfig})(
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
                getFieldDecorator('need',{initialValue:need})(
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