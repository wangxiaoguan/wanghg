import React, { Component } from 'react';
import { Upload, Message, Icon, Button, Modal, Input,Popconfirm} from'antd';
import API_PREFIX,{API_FILE_VIEW,API_FILE_UPLOAD,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../content/apiprefix';
import { setUploadPicture, setUploadContentPicture} from '../../../redux-root/action/upload/uploadPicture';
const Dragger = Upload.Dragger;
import {exportExcelService} from '../.././content/myFetch';
import { connect } from 'react-redux';
@connect(
  state => ({
    uploadData: state.uploadPicture.uploadPictureData,
  }),
  dispatch => ({
    setUploadPicture: n => dispatch(setUploadPicture(n)),
    setUploadContentPicture: n => dispatch(setUploadContentPicture(n)),
  })
)
export default class TitlePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentList: [],
      img_review: false,
      img_array: [],
      img_preview:[],
      img_previewName:[],
      addKey: 0,
      uploadTitleList: [],
      current: '',
      currentName:'',
      currentInput: [],
      initialValue: [],
      isIamge:false,//是否是图片
      fileName:'',//下载时的文件名
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.initialValue !== state.initialValue) {
      return { initialValue: props.initialValue };
    }
    return null;
  }
  //下载
  onDownLoad(url){
    exportExcelService(url, null,this.state.fileName);
  }
  componentDidMount() {
    if(API_CHOOSE_SERVICE==1){
      if(this.props.modal=='event'){
        this.setState({
            uploadPicture:API_FILE_UPLOAD + '/activity',
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

    let { initialValue } = this.state;
    
    if (initialValue && Array.isArray(initialValue)) {
      if(API_CHOOSE_SERVICE==1){
        if (this.props.type === 'titlePicture') {
          let titleimage=initialValue[0];
          if(titleimage.indexOf(';')>0){
            initialValue=titleimage.split(';')
          }
          let defaultList = [];
          initialValue.map((item, index) => {
            defaultList.push({
              uid: index,
              url: this.state.ossViewPath + item,
            });
          });
          this.setState({
            uploadTitleList: defaultList,
          });
        }else{
          let currentInput = [];
          let content = [];
          let img_preview = [];
          let img_previewName = []
          initialValue.map((item,index) => {
            if(Array.isArray(item)){
              item[0].id = index;
              if (item[0].describe) {
                currentInput[index] = item[0].describe;
              }
              this.setState({fileName:item[0].response.entity[0].fileName});
              content[index] = [{ name: item[0].response.entity[0].fileName, uid: index, response:item[0].response}];
              img_preview[index] = item[0].response.entity[0].filePath;
              img_previewName[index] = item[0].response.entity[0].fileName;

            }else{
              item.id = index;
              if (item.describe) {
                currentInput[index] = item.describe;
              }
              this.setState({fileName:item.response.entity[0].fileName});
              content[index] = [{ name: item.response.entity[0].fileName, uid: index, response:item.response}];
              img_preview[index] = item.response.entity[0].filePath;
              img_previewName[index] = item.response.entity[0].fileName;
            }
          });

          this.setState({ img_array: initialValue, currentInput, contentList: content, img_preview,addKey:content.length,img_previewName });
        }
      }else{
        if (this.props.type === 'titlePicture') {
          let defaultList = [];
          initialValue.map((item, index) => {
            defaultList.push({
              uid: index,
              url: API_FILE_VIEW_INNER + item,
            });
          });
          this.setState({
            uploadTitleList: defaultList,
          });
        }else{
          let currentInput = [];
          let content = [];
          let img_preview = [];
          let img_previewName= []
          initialValue.map((item,index) => {
            item.id = index;
            if (item.describe) {
              currentInput[index] = item.describe;
            }
            this.setState({fileName:item.response.entity[0].fileName});
            content[index] = [{ name: item.response.entity[0].fileName, uid: index, response:item.response}];
            img_preview[index] = item.response.entity[0].filePath;
            img_previewName[index] = item.response.entity[0].fileName;
          });
          this.setState({ img_array: initialValue, currentInput, contentList: content, img_preview,addKey:content.length,img_previewName });
        }
      }
    }
  }
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  addImg = () => {
    
    const { img_array, addKey } = this.state;
    if(this.props.datatype=='partylearn'){
      if(img_array.length>4){
              Message.error('上传的文件不能超过5个')
              return
          }
    }
    if(this.props.Magazinetype&&this.props.Magazinetype==="MagazineManagementArticle"){
      if(img_array.length>2){
        Message.error('首页图片不能超过3张')
        return
    }
    }
    this.setState({ addKey: addKey + 1 });
    img_array.push({ id: addKey });
    this.setState({ img_array });
  };
  handleCancel = () => this.setState({ previewVisible: false })
  describeChange = (e, key) => {
    let content = this.state.contentList;
    if (content[key]) {
      content[key][0].describe = e.target.value;
    }else{
      content = [{ [key]: [{ describe: e.target.value}]}];
    }
    let currentInput = this.state.currentInput;
    currentInput[key] = e.target.value;
    this.setState({ currentInput, contentList: content });
    this.props.setUploadContentPicture({key,content:content[key][0],type:this.props.keys});
  };
  componentWillUnmount(){
    this.props.setUploadPicture([]);
    this.props.setUploadContentPicture({});
  };
  deleteImg = key => {
    const { contentList, img_preview, currentInput,img_previewName } = this.state;
    let img_array = [...this.state.img_array];
    img_array = img_array.filter(item=>item.id !==key);
    delete img_preview[key];
    delete img_previewName[key]
    delete contentList[key];
    delete currentInput[key];
    let content = [...contentList];
    this.props.setUploadContentPicture({ key: key, content: content[key], type: this.props.keys });
    this.setState({ img_array, contentList, img_preview, currentInput,img_previewName});
  };
  getUploadURL = content => {
    return content.map(item => {
      return (item[0] = item[0].response.entity[0].filePath);
    });
  };
  beforeUpload = (file) => {}
  render() {
    const {
      uploadTitleList,
      previewVisible,
      previewImage,
      ossViewPath,
    } = this.state;
    const { initialValue, flowData, uploadData,isIamge } = this.props;
    let isUpload =
      (uploadData[this.props.keys] && uploadData[this.props.keys].length > 0) ||
      (initialValue && initialValue.length > 0) ||
      (flowData && flowData.length > 0);
    let defaultValue = uploadData[this.props.keys]
      ? uploadData[this.props.keys]
      : initialValue
        ? this.state.current
        : '';
    const props = {
      accept:'image/*',
      key: 'dropUpload',
      name: 'file',
      multiple: true,
      action: this.state.uploadPicture,
      listType: 'picture-card',
      fileList: this.state.uploadTitleList,
      onPreview: this.handlePreview,
      beforeUpload: this.beforeUpload,
      // showUploadList:false,
      onChange: info => {
        if(info.fileList.length>=4){
          Message.error('标题图片最多3张');
          return;
        }
        if(info.file.size>1024*1024*2){
          Message.error('图片大小不得超过2M');
          return;
        }
        const status = info.file.status;
        let fileList = [...info.fileList];
        if(this.props.RadioValue!==3){
          fileList = fileList.slice(-1);
        }
        this.setState({ uploadTitleList: fileList });
        if (!status) {
          fileList.slice(0);
          fileList.splice(fileList.length-1,1);
          this.setState({ uploadTitleList: fileList });
        }
        if (status === 'uploading') {
          if (info.file.response === '') {
            Message.error('请检查接口状态！');
          }
        }
        if (status === 'removed') {
          delete uploadTitleList[0];
          let content = [...uploadTitleList];
          this.props.setUploadPicture({[this.props.keys]: fileList});
        }
        if (status === 'done') {
          if (info.file.response!=='') {
            if(info.file.response.status == 1) {
              Message.success(`${info.file.name}上传成功。`);
              this.setState({ uploadTitleList: fileList});
              this.props.setUploadPicture({
                [this.props.keys]: fileList,
              });
            }else {
              Message.error(info.file.response.errorMsg);
              this.setState({ uploadTitleList: [] });
            }
          }else{
            Message.error('请检查接口状态！');
            this.setState({ uploadTitleList: [] });
          }
        } else if (status === 'error') {
          Message.error(`${info.file.name} 上传失败。`);
        }
      },
    };

    return (
      <div>
        {this.props.type === 'titlePicture' ? 
        (this.props.disabled?
        <Button
          onClick={() =>{
            this.setState({ img_review: isIamge?true:false,current: this.props.titleimage })
          }}
        >
          查看</Button>:
          (
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text" style={{textDecoration: 'underline'}}>{'点击或拖拽上传文件'}</p>
            </Dragger>
          )
        )
         : null}

        
        <Modal
          className="img-review-modal"
          visible={this.state.img_review}
          onCancel={() => this.setState({ img_review: false })}
          footer={null}
          destroyOnClose
        >
        {
          this.state.current.length==1||((typeof this.state.current)=='string')?API_CHOOSE_SERVICE==1?<div className='imgsize'><img src={ossViewPath + this.state.current} /></div>:<div className='imgsize'><img src={API_FILE_VIEW_INNER + this.state.current} /></div>
          :API_CHOOSE_SERVICE==1?
            <div className='imgsize'>
              <img src={ossViewPath + this.state.current[0]} />
              <img src={ossViewPath + this.state.current[1]} />
              <img src={ossViewPath + this.state.current[2]} />
            </div>
            :<div className='imgsize'>
              <img src={API_FILE_VIEW_INNER + this.state.current[0]}/>
              <img src={API_FILE_VIEW_INNER + this.state.current[1]}/>
              <img src={API_FILE_VIEW_INNER + this.state.current[2]}/>
             </div>
          
        }
        </Modal>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <div className='imgsize'><img alt="example"  src={ previewImage} /></div>
        </Modal>
      </div>
    );
  }
}