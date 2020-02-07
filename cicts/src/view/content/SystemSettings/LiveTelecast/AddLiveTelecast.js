
import  React,{ Component } from 'react';
import { Tabs,Form, Row, Col, Input, Button, Icon, DatePicker,Table, message, Select, Upload, Modal  } from 'antd';
import moment from 'moment';
import {GetQueryString, postService, getService, getExcelService} from '../../myFetch';
import API_PREFIX,{masterUrl,API_FILE_VIEW,API_FILE_UPLOAD,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../apiprefix';
import './LiveTelecast.less'
// import RichText from '../../../component/richTexteditor/editor';
import RichText from '../../../component/richTexteditor/braftEditor';
import UploadWrapper from '../../../component/EventAndInfoAdd/uploadPic';
import MultipleTree from '../../../component/EventAndInfoAdd/MultipleTree';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


@Form.create()
@connect(
  state => ({
    flowData: state.flowData.flowData,
    leaveData: state.flowData.leaveData,
  }), 
)
export default class AddLiveTelecast extends Component{
  constructor(props){
    super(props);
    this.state = {
      MultipleTreeData:[],
      name:'',//创建人名称
      activeKey: '1',
      dataInfo:{},
      pointData:[],
      totalNum: 0,
      currentPage:1,
      pageSize: 10,
      visible:false,
      selectedRowKeys:[],//表格选中项
      selectedRows:[],
      // urlRequest:`${API_PREFIX}services/partybuildingreport/SpecialPointUI/IdAndNameList`,
      previewVisible: false,
      previewImage: '',
      imageUrl : window.sessionStorage.getItem('menu') ? JSON.parse(window.sessionStorage.getItem('menu')).icon : '',
      fileList: [],
      uploadPicture:'',
      uploadStatus:false,
      chooseUserText:'',//选择用户 输入框
      isLiveName:'',//直播间是否重名 错误消息
      isLiveNameBool:false,//直播间是否重名
    }
  }
  componentDidMount(){
    if(API_CHOOSE_SERVICE==1){
      if(this.props.modal=='event'){
        this.setState({
          uploadPicture:API_FILE_UPLOAD + '/liveTelecast',
        })
      }else{
        this.setState({
          uploadPicture:API_FILE_UPLOAD + '/news',
        })
      }
    }else{
      if(this.props.modal=='event'){
        this.setState({
          uploadPicture:API_FILE_UPLOAD_INNER,
        })
      }else{
        this.setState({
          uploadPicture:API_FILE_UPLOAD_INNER ,
        })
      }
    }
  }
  componentWillReceiveProps(nextProps){
  }
  //图片上传
  handleImgCancel = () => this.setState({ previewVisible: false })

  beforeUpload=(file)=>{
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    if ( !isJPG && !isPNG && !isGIF) {
      message.error('仅支持上传JPG/JPEG/PNG/GIF格式文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片尺寸大小必须小于2MB!');
    }
    return (isJPG || isPNG || isGIF) && isLt2M;
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = (info) => {
    if (info.file.status == 'uploading') {
      this.setState({ fileList :info.fileList,uploadStatus:true});
    }
    if (info.file.status === 'done') {
      this.setState({
        previewImage:masterUrl +`${info.file.response.entity[0].filePath}`,
        imageUrl:masterUrl +`${info.file.response.entity[0].filePath}`,
        uploadStatus:false
      });
      this.setState({ fileList :info.fileList});
      message.success(`${info.file.name} 上传成功。`);
    }else if(info.file.status === 'error'){
      message.error(`${info.file.name} 上传失败。`);
    }
    if (info.file.status == 'removed') {
      this.setState({ fileList :info.fileList,uploadStatus:false});
    }
    /*this.state.fileList.url = this.state.imageUrl;*/

  };

  //tab栏切换
  tabsChange= (activeKey) =>{
    this.setState({
      activeKey,
      dataInfo:{},
      pointData:[],
      totalNum:0,
    },)
  }
  //table选中项发生变化时的回调
  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({selectedRowKeys,selectedRows});
  }
  //选择用户
  chooseUser = ()=>{
    this.setState({
      visible:true,
      dataInfo:{
        name:''
      }
    },()=>{
      this.props.form.resetFields(['name'])
      getService(`${API_PREFIX}services/live/live/userList/get/${this.state.currentPage}/${this.state.pageSize}?Q=lastname_LK=${this.state.chooseUserText}`,data=>{
        if(data.retCode === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        }else if(data.retCode === 0){
          message.error(data.retMsg);
        }else{
          message.error('数据请求失败')
        }
      });
    })
  }
  //点击modal 确定
  handleOk = () => {
    if(this.state.selectedRowKeys.length == 0){
      message.error('请选择发起人');
    }else{
      this.setState({
        dataInfo:{
          ...this.state.dataInfo,
          name:this.state.selectedRows[0].lastname,
          userId:this.state.selectedRows[0].userId
        },
        visible:false,
      },()=>{
        this.child.props.form.setFieldsValue({name:this.state.dataInfo.name})
      })
    }
  }
  //点击modal 取消
  handleCancel = () => {
    this.setState({
      visible:false,
    })
  }
  //子组件往父组件传输imageUrl
  normFile = (e) => {
    if(e.file.status != undefined){
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
  }
  //创建人name
  sendFormName = (e) =>{
    return this.state.dataInfo.name;
  }
  //用户名输入框change事件
  userNameChange = (e) => {
    this.setState({chooseUserText:e.target.value,},()=>{
      getService(`${API_PREFIX}services/live/live/userList/get/${this.state.currentPage}/${this.state.pageSize}?Q=lastname_LK=${this.state.chooseUserText}`,data=>{
        if(data.retCode === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        }else if(data.retCode === 0){
          message.error(data.retMsg);
        }else{
          message.error('数据请求失败')
        }
      });
    })
  }
  //页码改变触发
  onPageChange = (current, pageSize) =>{
    getService(`${API_PREFIX}services/live/live/userList/get/${current}/${pageSize}?Q=lastname_LK=${this.state.chooseUserText}`,data=>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      }else if(data.status === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    });
  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    getService(`${API_PREFIX}services/live/live/userList/get/${current}/${pageSize}?Q=lastname_LK=${this.state.chooseUserText}`,data=>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      }else if(data.status === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    });
  }
  //直播间重名查询
  isLiveNameChange = (liveName) => {
    getService(`${API_PREFIX}services/live/live/verifyLiveNameIsUnique/${liveName}/add`,data=>{
      if(data.retCode === 1){
        this.setState({
          isLiveNameBool:true,
          isLiveName:data.retMsg,
        });
      }else if(data.retCode === 0){
        message.error(data.retMsg);
        this.setState({
          isLiveNameBool:false,
          isLiveName:data.retMsg,
        });
      }else{
        message.error('数据请求失败')
      }
    });
  }
  //表单赋值
  changeDataInfo = (data) => {
    // this.isLiveNameChange(data.liveName);
    let ossViewPath = sessionStorage.getItem('ossViewPath') || API_FILE_VIEW
    this.setState({
      dataInfo:{
        ...data,
        userId:this.state.selectedRows[0].userId,
        name:this.state.selectedRows[0].name,
        livePic:ossViewPath + this.state.imageUrl,
        totalNum: 0,
        pageSize: 10,
        currentPage: 1,
      }
    })
    getService(`${API_PREFIX}services/live/live/verifyLiveNameIsUnique/${data.liveName}/add`,data=>{
      if(data.retCode === 1){
        this.setState({
          isLiveNameBool:true,
          isLiveName:data.retMsg,
        },()=>{
          postService(`${API_PREFIX}services/live/live/add/insertLive`,this.state.dataInfo,data=>{
            if(data.retCode === 1){
              this.setState({
                totalNum: data.root.totalNum,
                pointData: data.root.list,
              },()=>{
                message.success('添加成功');
                window.location.href='#/SystemSettings/LiveTelecast'
              });
            }else if(data.retCode === 0){
              message.error(data.retMsg);
            }else{
              message.error('数据请求失败')
            }
          });
        })
      }else if(data.retCode === 0){
        message.error(data.retMsg);
        this.setState({
          isLiveNameBool:false,
          isLiveName:data.retMsg,
        });
      }else{
        message.error('数据请求失败')
      }
    })
  }
  //学习内容字数120字为一分钟
  wordCount = (value) => {
    value = value.substring(3,value.length-4);
    this.setState({ 
      dataInfo:{
        ...this.state.dataInfo,
        notice:value,
      }
    })
  }
  onRef = (ref) => {
    this.child = ref
  }
  render(){
    const columns = [{
      title: '用户ID',
      dataIndex: 'userId',
      key:'userId',
    },{
      title: '姓名',
      dataIndex: 'lastname',
      key:'lastname',
    },{
      title: '手机号',
      dataIndex: 'mobile',
      key:'mobile',
    },]
    const rowSelection = {
      type:'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    }
    let pagination = {
      total: this.state.totalNum,
      pageSize: this.state.pageSize,
      current: this.state.currentPage,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
    };
    return <div className='addLiveTelecast' style={{paddingTop:20}} >
        {/* <Tabs onChange={this.tabsChange} type="card"> */}
          {/* <TabPane tab="基本信息" key="1"> */}
            <AddLiveForm onRef={this.onRef} name={this.state.name} dataInfo={this.state.dataInfo} fileList={this.state.fileList} previewImage={this.state.previewImage} previewVisible={this.state.previewVisible}
            handleImgCancel={this.handleImgCancel} handlePreview={this.handlePreview} uploadStatus={this.state.uploadStatus} handleChange={this.handleChange} beforeUpload={this.beforeUpload} normFile={this.normFile}
            chooseUser={this.chooseUser} changeDataInfo={this.changeDataInfo} uploadPicture={this.state.uploadPicture} isLiveName={this.state.isLiveName} sendFormName={this.sendFormName}
            wordCount={this.wordCount} />
            <Modal className='addLiveModal' title="添加用户" okText='添加' width='50%'
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Input style={{width:200,marginBottom:10}} onChange={this.userNameChange} size='small' placeholder='请输入姓名'/>
              <Table  className="tabCommon" dataSource={this.state.pointData} columns={columns} 
              rowKey='userId' pagination={pagination} rowSelection={rowSelection} bordered/>
            </Modal>
          {/* </TabPane> */}
          {/* <TabPane tab="鉴权信息" key="2">
          <MultipleTree type="join" disabled={false} flowData={this.props.flowData} leaveData={this.props.leaveData['apply']} initialValue={this.state.MultipleTreeData ? this.state.MultipleTreeData : null} />
          </TabPane> */}
        {/* </Tabs> */}
      </div>
  }
}
class AddContent extends Component{
  constructor(props){
    super(props);
    this.props.onRef(this)
    this.state = {
      loading: false,
    };
  }
  
  handleSubmit= e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) =>{
      if(err){
        return;
      }
      this.props.changeDataInfo(fieldsValue)
    })
  }
  render(){
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const { previewVisible, previewImage, fileList } = this.props;

    const { getFieldDecorator } = this.props.form;
    const isLiveName = isLiveName || '*必填项';
    return <div>
      <Form onSubmit={this.handleSubmit} >
        <FormItem {...formItemLayout} colon={false} label='创建人：'>
        <div>
          {getFieldDecorator('name', {
              initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
              rules: [{ required: true, message: '*必填项'}],
            })(
              <Input disabled style={{width:200}} size='small'/>
            
            )} 
            <Button style={{ width:80,height:24,marginLeft:20 }}  type="primary" onClick={this.props.chooseUser}>选择用户</Button>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label='直播间类型：'>
          {getFieldDecorator('type', {
            initialValue: this.props.dataInfo.type ? this.props.dataInfo.type : '',
            rules: [{ required: true, message: '*必填项'}],
          })(
            <Select
              style={{width:200}}
              size='small'
            >
              <Select.Option key='0' value='0'>rtmp</Select.Option>
              <Select.Option key='1' value='1'>hls</Select.Option>
              <Select.Option key='2' value='2'>http</Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label='直播间名称：'>
          {getFieldDecorator('liveName', {
             initialValue: this.props.dataInfo.liveName ? this.props.dataInfo.liveName : '',
             rules: [{ required: true, message:isLiveName}],
          })(
            <Input style={{width:200}} size='small'/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label='直播间默认图像：'>
          <div>
            {getFieldDecorator('livePic', {
              valuePropName: 'filelist',
              getValueFromEvent: this.props.normFile,
              })(
              <Upload
                action={this.props.uploadPicture}
                listType="picture-card"
                fileList={fileList}
                onPreview={this.props.handlePreview}
                onChange={this.props.handleChange}
                beforeUpload={this.props.beforeUpload}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            )}
            <Modal visible={previewVisible} footer={null} onCancel={this.props.handleImgCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label='直播间公告：'>
          {getFieldDecorator('notice', {
            initialValue: this.props.dataInfo.notice ? this.props.dataInfo.notice : '',
          })(
            // <RichText wordCount={this.wordCount.bind(this)} disabled={disabled} initialValue={initialValue ? initialValue[item.key] : ''} 
            // flowData={this.props.flowData[item.key]} leaveData={this.props.leaveData[this.props.belonged][item.key]} />
            <RichText wordCount={this.props.wordCount} disabled={false} initialValue=''/>
          )}
        </FormItem>
        <FormItem {...formItemLayout} colon={false} label=' '>
          <Button style={{ width:80,height:24,}}  type="primary" htmlType="submit" disabled={this.props.uploadStatus}>确定</Button>
          <Button style={{ width:80,height:24,marginLeft:20 }}  type="primary"  onClick={()=>{window.location.href="#/SystemSettings/LiveTelecast"}} >返回</Button>
        </FormItem>
      </Form>
    </div>
  }
}
const AddLiveForm = Form.create()(AddContent);