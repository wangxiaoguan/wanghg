import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
// import Add from '../../../../component/richTexteditor/editor';
import Add from '../../../../component/richTexteditor/braftEditor';
import {Button,Modal,Form,Input,Radio,Select,Tabs,Checkbox,Row,Col,Upload,Icon,message,InputNumber } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
// const masterUrl = 'http://10.110.200.62:9080/';
// const uploadPicture = API_PREFIX+'services/attachment/file/upload/AttachmentUpload';
import API_PREFIX, { masterUrl,API_FILE_UPLOAD,API_FILE_VIEW,API_FILE_UPLOAD_INNER,API_CHOOSE_SERVICE,API_FILE_VIEW_INNER } from '../../../apiprefix';
import {  BEGIN,getDataSource,getPageData } from '../../../../../redux-root/action/table/table';
import RichText from '../../../../component/richTexteditor/braftEditor';
import {connect} from 'react-redux';
import {postService,getService,GetQueryString} from '../../../myFetch';
import $ from 'jquery';
let uploadPicture;
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
      isEdit: eval(GetQueryString(location.hash, ['isEdit']).isEdit)||false,
      isFlag:eval(GetQueryString(location.hash, ['isFlag']).isFlag)||false,
      description:'',
      id:GetQueryString(location.hash, ['id']).id||false,
      getcategoryData:[],
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW,
      imgUrl:'',
      editorData: this.props.editorData,
    };
  }
  componentDidMount(){

console.log("id",this.state.id)

    //获取商品分类
    this.getcategory();
    //数据回显
    if(this.state.isEdit){
      this.getGoodsDetail();
    } 
  }
  componentWillMount() {
  }
  componentWillUnmount(){
    window.sessionStorage.removeItem('commodity');
  }

  componentDidUpdate(){//更新过后获取富文本框的内容xwx2019/1/12
    if (this.props.editorData !== this.state.editorData) {
      this.setState({editorData: this.props.editorData})
    }
  }


   //学习内容字数120字为一分钟
   wordCount = (value) => {//xwx2019/1/2
    console.log('value', value);
    // this.setState({ learnTime: Math.ceil((value.length - 7) / 120) });
  }


  getcategory=()=>{
     getService(API_PREFIX + `services/web/mall/product/category/getList/1/100`, data => {
      if (data.status === 1) {        
        let  getcategoryData= data.root.list;
        this.setState({getcategoryData})
      }else{
        message.error(data.errorMsg);
        this.setState({ loading: false });
      }
    });
  }

  getGoodsDetail=()=>{
    getService(API_PREFIX + `services/web/mall/product/info/getById/${this.state.id}`, data => {
      if (data.status === 1) {        
        let  getGoodsDetail= data.root.object;
            // let {fileList}=this.state;
            // fileList.push({thumbUrl:`${this.state.ossViewPath}${getGoodsDetail.images}`})
            this.props.form.setFieldsValue({
              name: getGoodsDetail.name,
              price: getGoodsDetail.price,
              productStock:getGoodsDetail.productStock,
              description:getGoodsDetail.description,
              categoryId:getGoodsDetail.categoryId,
              showIndex:getGoodsDetail.showIndex,
              imgUrl:getGoodsDetail.images,       
            });
        this.setState({getGoodsDetail,imgUrl:`${getGoodsDetail.images}`,fileList:[{
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url:this.state.ossViewPath + getGoodsDetail.images,
        }]})

      }else{
        message.error(data.errorMsg);
        this.setState({ loading: false });
      }
    });
  }
  handleSubmit = () => {
    console.log('000');
    console.log('isEdit',this.state.isEdit);
    if(!this.state.isEdit){
      this.props.form.validateFields((err, values) => {
        if (!err) {    
          console.log(this.state); 
          values.images=this.state.imgUrl;
          values.imgUrl=this.state.imgUrl;
          values['description'] = this.props.editorData;
          postService(API_PREFIX + 'services/web/mall/product/info/insert',values,data => {
            console.log('data==>',data);
            if(data.status == 1){
              message.success('新增成功!');
              // location.hash='EventManagement/Order/Commodity';
            }else{
              message.error(data.retMsg);
            }
          });
        }
      });
    }else{
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log("values===>",values,this.state);
          values.id = this.state.id;
          values.images=this.state.imgUrl;
          values.imgUrl=this.state.imgUrl;
          values['description'] = this.props.editorData;
          postService(API_PREFIX + 'services//web/mall/product/info/update',values,data => {
            if(data.status == 1){
              message.success('修改成功!');
              location.hash='EventManagement/Order/Commodity';
            }else{
              message.error(data.retMsg);
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
      console.log("info.file===>",info.file)
      this.setState({
        previewImage:`${info.file.response.root.object[0].filePath}`,
        imageUrl:`${info.file.response.root.object[0].filePath}`,
        imgUrl:`${info.file.response.root.object[0].filePath}`
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
      detail:content,
    });
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
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 12 },
      },
    };
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>);
    console.log('detail==>',this.state,this.state.getcategoryData);
    return <div style={{marginTop:'20px'}}>
      <Form onSubmit={this.handleSubmit}>
        <Col span={24}>
        <FormItem label="商品分类" {...formItemLayout}>
            {getFieldDecorator('categoryId'
            // , {
            //   rules: [{ required: true, message: '请选择商品分类' }],
            // }
            )(
              <Select
                    disabled={this.state.isFlag ? true :false}  placeholder="请选择商品分类"
                  >
                    {
                      this.state.getcategoryData&&this.state.getcategoryData.length>0&&this.state.getcategoryData.map(item => (
                        <Option key={item.id} title={item.name}>{ item.name }</Option>
                      ))
                    }
                  </Select>
            )}
          </FormItem>
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
             {/* {this.state.imgUrl?<img src={this.state.imgUrl} />:''}   */}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="价格" {...formItemLayout}>
            {getFieldDecorator('price', {
              rules: [{ required: true, message: '请输入商品价格' }],
            })(
              <InputNumber disabled={this.state.isFlag ? true :false} min={0}/>
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="库存" {...formItemLayout}>
            {getFieldDecorator('productStock', {
              rules: [{ required: true, message: '请输入商品库存' }],
            })(
              <InputNumber disabled={this.state.isFlag ? true :false} min={0}/>
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="显示顺序" {...formItemLayout}>
            {getFieldDecorator('showIndex', {
              rules: [{ required: true, message: '请输入显示顺序' }],
            })(
              <InputNumber disabled={this.state.isFlag ? true :false} min={0}/>
            )}
          </FormItem>
        </Col>
        <Col span={24}>
     
          <FormItem label="商品描述" {...formItemLayout1}>
          {getFieldDecorator('description', {
            initialValue:'',
          })(
              <RichText wordCount={this.wordCount.bind(this)} disabled={false} initialValue={this.state.getGoodsDetail?this.state.getGoodsDetail.description:""} />
          )}
          </FormItem>
        </Col>
        <Col  span={24} style={{color: 'red', textAlign: 'center'}}>
          {
            !this.state.detail ? 
            '请输入商品描述'
            : null
          }
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


