import React, { Component } from 'react';
// import Add from '../../../component/richTexteditor/editor';
import Add from '../../../component/richTexteditor/braftEditor';
import {Button,Modal,Form,Input,Radio,Select,Tabs,Checkbox,Row,Col,Upload,Icon,message,InputNumber } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
// const masterUrl = 'http://10.110.200.62:9080/';
// const uploadPicture = API_PREFIX+'services/attachment/file/upload/AttachmentUpload';
import API_PREFIX, { masterUrl,API_FILE_UPLOAD,API_FILE_VIEW,API_FILE_UPLOAD_INNER,API_CHOOSE_SERVICE,API_FILE_VIEW_INNER } from '../../apiprefix';
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService,GetQueryString} from '../../myFetch';
import $ from 'jquery';
var uploadPicture
if(API_CHOOSE_SERVICE==1){
  uploadPicture = API_FILE_UPLOAD+'/goods';
}else{
  uploadPicture = API_FILE_UPLOAD_INNER;
}


@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    editorData: state.editor.editorData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)

@Form.create()
class List extends Component {
  constructor(props){
    super(props);
    this.state = {
      fileList: [],
      imageUrl : window.sessionStorage.getItem('commodity') ? JSON.parse(window.sessionStorage.getItem('commodity')).imgUrl : '',
      isEdit: eval(GetQueryString(location.hash, ['isEdit']).isEdit)||false,
      isFlag:eval(GetQueryString(location.hash, ['isFlag']).isFlag)||false,
      content:'',
      id:'',
      serveList:[],  //页面数据
    };
  }
  componentDidMount(){
    getService(API_PREFIX + 'services/system/AgreementInfo/findByID',data => {
      console.log('data==>',data)
      if(data.retCode == 1){
        this.setState({content:data.root.content});
        this.props.form.setFieldsValue({
          title:data.root.title,
          content:data.root.content,
        });
      }else{
        message.error(data.retMsg);
      }
    });
  }
  componentWillMount() {
    if(this.state.isEdit){
      let value =  window.sessionStorage.getItem('commodity');
      let obj = JSON.parse(value);   
      let detail = obj.detail;
      let id = obj.id;
      this.setState({
        detail:detail,
        id:id,
      },() => {
        /* console.log("123",this.state.detail)
        var content = this.state.detail;
        var dom = $(content).html();
        $("#detail").append(dom);*/
      });
    }
  }
  componentWillUnmount(){
    
  }
  handleSubmit = () => {
    console.log('000')
    console.log('isEdit',this.state.isEdit)
    if(!this.state.isEdit){
      console.log('222')
      console.log('222',this.props)
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('values33333333=>',values)
          postService(API_PREFIX + 'services/system/AgreementInfo/editAgreementInfo',values,data => {
            console.log('data==>',data)
            if(data.retCode == 1){
              location.hash='SystemSettings/ServiceAgreement/List';
            }
          });
        }
      });
    }

  }
  normFile = (e) => {
    console.log('Upload event:', e);
    if(e.file.status != undefined){
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
  }
   handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = (info) => {
    console.log('321',info.file.status);
    if (info.file.status == 'uploading') {
      this.setState({ fileList :info.fileList});
    }
    
    if (info.file.status === 'done') {
      this.setState({
        previewImage:`${info.file.response.entity[0].filePath}`,
        imageUrl:`${info.file.response.entity[0].filePath}`,
      },() => {
        console.log('qwe',this.state.imageUrl);
      });
      this.setState({ fileList :info.fileList});
      message.success(`${info.file.name} 上传成功。`);
    }else if(info.file.status === 'error'){
      message.error(`${info.file.name} 上传失败。`);
    }
    if (info.file.status == 'removed') {
      this.setState({ fileList :[]});
    }
    /*this.state.fileList.url = this.state.imageUrl;*/
    
  };
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
  getContent = (content) => {
    this.setState({
      content:content,
      detail:content
    });
  }
  //字数120字为一分钟
  wordCount=(value)=>{
    console.log('value',value.length-7)
    this.setState({learnTime:Math.ceil((value.length-7)/120) })
  }
  onRemove = () => {
    if(this.state.isFlag){
      return false;
    }else{
      return true;
    }
    
  }
  render() {
    let powers = this.props.powers;
    console.log('权限码', powers);
    let hasAddPower = powers && powers['20001.21811.001'];
    let hasDelPower = powers && powers['20001.21811.004'];
    let hasEditPower = powers && powers['20001.21811.002'];
    let hasSearchPower = powers && powers['20001.21811.003'];
    const { getFieldDecorator} = this.props.form;
    const {editorData} = this.props;
    const {content} = this.state;
    const isShow = (content == undefined) ? '请输入商品描述' : <span style={{display:'none'}} />;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    // const uploadButton = (
    //   <div>
    //     <Icon type="plus" />
    //     <div className="ant-upload-text">Upload</div>
    //   </div>);
    // console.log('detail==>',this.state.serveList)
    // let data = this.state.serveList;
    // let dateContent = this.state.serveList.content;
    // console.log('data.content',dateContent)
    return <div style={{marginTop:'20px'}}>
      <Form onSubmit={this.handleSubmit}>
        <Col span={24}>
          <FormItem label="标题" {...formItemLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue:''
            })(
              <Input style={{width:'300px'}} />
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="服务协议内容" {...formItemLayout}>
            {getFieldDecorator('content', {
              rules: [{ required: true, message:"请输入内容" }],
              initialValue:content
            })(
              <Add wordCount={this.wordCount.bind(this)} disabled={false} getContent={this.getContent} detail={content} initialValue={this.state.content?this.state.content:null}/>
            )}
          </FormItem>
        </Col>

        {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>  */}
        <Button style={{marginLeft: '460px',marginTop: '30px',marginBottom:'20px'}}  className="resetBtn" type="primary" onClick={() => location.hash='SystemSettings/ServiceAgreement/List'}>返回</Button>
        <Button className="queryBtn" type="primary" htmlType="submit">保存</Button>
      </Form>
    </div>;
  }
}

export default List;


