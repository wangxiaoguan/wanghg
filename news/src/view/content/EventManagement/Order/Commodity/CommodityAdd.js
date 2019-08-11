import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import Add from '../../../../component/richTexteditor/editor';
import {Button,Modal,Form,Input,Radio,Select,Tabs,Checkbox,Row,Col,Upload,Icon,message,InputNumber } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
// const masterUrl = 'http://10.110.200.62:9080/';
// const uploadPicture = ServiceApi+'services/attachment/file/upload/AttachmentUpload';
import ServiceApi, { masterUrl,UploadUrl,PictrueUrl,FileUrl,ChooseUrl,API_FILE_VIEW_INNER } from '../../../apiprefix';
import {  BEGIN,getDataSource,getPageData } from '../../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService,GetQueryString} from '../../../myFetch';
import $ from 'jquery';
var uploadPicture
if(ChooseUrl==1){
  uploadPicture = UploadUrl+'/goods';
}else{
  uploadPicture = FileUrl;
}


@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    editorData: state.editor.editorData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)

@Form.create()
class CommodityAdd extends Component {
  constructor(props){
    super(props);
    this.state = {
      fileList: [],
      imageUrl : window.sessionStorage.getItem('commodity') ? JSON.parse(window.sessionStorage.getItem('commodity')).imgUrl : '',
      isEdit: eval(GetQueryString(location.hash, ['isEdit']).isEdit)||false,
      isFlag:eval(GetQueryString(location.hash, ['isFlag']).isFlag)||false,
      detail:'',
      id:'',
    };
  }
  componentDidMount(){
    if(this.state.isEdit){
      let value =  window.sessionStorage.getItem('commodity');
      let obj = JSON.parse(value);
      // let url = obj.imgUrl;
      let url
      if(ChooseUrl==1){
        url = PictrueUrl+obj.imgUrl;
      }else{
        url = API_FILE_VIEW_INNER + obj.imgUrl;
      }
      let detail = obj.detail;
      this.setState({
        fileList:[{
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url:url,
        }],
      });
      
      this.props.form.setFieldsValue({
        name: obj.name,
        price: obj.price,
        imgUrl: obj.imgUrl,
        stock:obj.stock,
        detail:obj.detail,
      });
    } else{
     
    }
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
    window.sessionStorage.removeItem('commodity');
  }
  handleSubmit = () => {
    console.log('000')
    console.log('isEdit',this.state.isEdit)
    if(!this.state.isEdit){
      console.log('222')
      console.log('222',this.props)
      this.props.form.validateFields((err, values) => {
        if (!err) {
          values.imgUrl = this.state.imageUrl;
          values.detail = this.props.editorData;
          postService(ServiceApi + 'services/activity/goods/add',values,data => {
            console.log('data==>',data)
            if(data.retCode == 1){
              message.success('新增成功!');
              location.hash='EventManagement/Order/Commodity';
            }
          });
        }
      });
    }else{
      this.props.form.validateFields((err, values) => {
        if (!err) {
          values.imgUrl = this.state.imageUrl;
          values.id = this.state.id;
          values.detail = this.props.editorData;
          postService(ServiceApi + 'services/activity/goods/update',values,data => {
            if(data.retCode == 1){
              message.success('修改成功!');
              location.hash='EventManagement/Order/Commodity';
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
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>);
    console.log('detail==>',this.state.detail)
    return <div style={{marginTop:'20px'}}>
      <Form onSubmit={this.handleSubmit}>
        <Col span={24}>
          <FormItem label="商品名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入商品名称' }],
            })(
              <Input disabled={this.state.isFlag ? true :false} style={{width:'300px'}} />
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="商品图片" {...formItemLayout}>
            {getFieldDecorator('imgUrl', {
              valuePropName: 'filelist',
              getValueFromEvent: this.normFile,
              rules: [{ required: true, message: '请上传商品图片' }],
            })(
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                action={uploadPicture}
                //className="avatar-uploader"
                //showUploadList={false}
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                beforeUpload={this.beforeUpload}
                // disabled={true} // 禁用的
                onRemove={this.onRemove}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="价格" {...formItemLayout}>
            {getFieldDecorator('price', {
              rules: [{ required: true, message: '请输入商品价格' }],
            })(
              <InputNumber disabled={this.state.isFlag ? true :false} />
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="库存" {...formItemLayout}>
            {getFieldDecorator('stock', {
              rules: [{ required: true, message: '请输入商品库存' }],
            })(
              <InputNumber disabled={this.state.isFlag ? true :false} />
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="商品描述" {...formItemLayout}>
            {getFieldDecorator('content', {
              initialValue:this.state.detail,
              rules: [{ required: true, message:"请输入商品描述" }],
            })(
              <Add wordCount={this.wordCount.bind(this)} disabled={false} getContent={this.getContent} detail={this.state.detail}/>
            )}
          </FormItem>
        </Col>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal> 
        <Button style={{marginLeft: '460px',marginTop: '30px',marginBottom:'20px'}}  className="resetBtn" type="primary" onClick={() => location.hash='EventManagement/Order/Commodity'}>返回</Button>
        {this.state.isFlag ? null :<Button className="queryBtn" type="primary" htmlType="submit">保存</Button>}
      </Form>
    </div>;
  }
}

export default CommodityAdd;


