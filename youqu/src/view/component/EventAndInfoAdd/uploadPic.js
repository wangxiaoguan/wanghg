import React, { Component } from 'react';
import { Upload, Message, Icon, Button, Modal, Input,Popconfirm} from'antd';
import API_PREFIX,{API_FILE_VIEW,API_FILE_UPLOAD,API_CHOOSE_SERVICE,API_FILE_UPLOAD_INNER,API_FILE_VIEW_INNER} from '../../content/apiprefix';
import { setUploadPicture, setUploadContentPicture} from '../../../redux-root/action';
const Dragger = Upload.Dragger;
import {exportExcelService} from '../.././content/myFetch';
import { connect } from 'react-redux';
@connect(
  state => ({
    uploadData: state.uploadPictureData,
  }),
  dispatch => ({
    setUploadPicture: n => dispatch(setUploadPicture(n)),
    setUploadContentPicture: n => dispatch(setUploadContentPicture(n)),
  })
)
export default class UploadWrapper extends Component {
  constructor(props) {
    super(props);
    console.log('this.props.form',props)
    this.state = {
      contentList: [],
      img_review: false,
      img_array: [],
      img_preview:[],
      addKey: 0,
      uploadTitleList: [],
      current: '',
      currentInput: [],
      initialValue: [],
      isRadio:false,//是否是视频
      isIamge:false,//是否是图片
      isAttach:false,
      fileName:'',//下载时的文件名
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
    console.log('modal',this.props.modal);
    console.log('path',this.props.uploadPicture);
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

    const { initialValue } = this.state;
    console.log("图片initialValue", initialValue);
    if (initialValue && Array.isArray(initialValue)) {
      /**
       * 处理拖拽图片
       */
      if(API_CHOOSE_SERVICE==1){
        if (this.props.type === 'uploadPicture_drop') {
          let defaultList = [];
          initialValue.map((item, index) => {
            defaultList.push({
              uid: index,
              url: API_FILE_VIEW + item,
            });
          });
          this.setState({
            uploadTitleList: defaultList,
          });
        }
  
        /**
         * 处理按钮图片
         */
        else{
          let currentInput = [];
          let content = [];
          let img_preview = [];
          initialValue.map((item,index) => {
            item.id = index;
            if (item.describe) {
              currentInput[index] = item.describe;
            }
            this.setState({fileName:item.response.entity[0].fileName});
            content[index] = [{ name: item.response.entity[0].fileName, uid: index, response:item.response}];
            img_preview[index] = item.response.entity[0].filePath;
          });
          this.setState({ img_array: initialValue, currentInput, contentList: content, img_preview,addKey:content.length });
        }
      }else{
        if (this.props.type === 'uploadPicture_drop') {
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
        }
  
        /**
         * 处理按钮图片
         */
        else{
          let currentInput = [];
          let content = [];
          let img_preview = [];
          initialValue.map((item,index) => {
            item.id = index;
            if (item.describe) {
              currentInput[index] = item.describe;
            }
            this.setState({fileName:item.response.entity[0].fileName});
            content[index] = [{ name: item.response.entity[0].fileName, uid: index, response:item.response}];
            img_preview[index] = item.response.entity[0].filePath;
          });
          this.setState({ img_array: initialValue, currentInput, contentList: content, img_preview,addKey:content.length });
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
    const { contentList, img_preview, currentInput } = this.state;
    let img_array = [...this.state.img_array];
    img_array = img_array.filter(item=>item.id !==key);
    delete img_preview[key];
    delete contentList[key];
    delete currentInput[key];
    let content = [...contentList];
    this.props.setUploadContentPicture({ key: key, content: content[key], type: this.props.keys });
    this.setState({ img_array, contentList, img_preview, currentInput});
  };
  getUploadURL = content => {
    return content.map(item => {
      return (item[0] = item[0].response.entity[0].filePath);
    });
  };
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    const isVideo = file.type === 'video/mp4';
    let limit=true;
    if (this.props.mode ==='视频上传') {

      limit = isVideo;
      if (!isVideo) {
        Message.error('仅支持上传MP4格式视频文件!');
      }
    } else if (this.props.mode === '上传附件') {
      limit = true;
    }else{
      limit = (isJPG || isPNG || isGIF)&& isLt2M;
      if (!isJPG && !isPNG && !isGIF) {
        Message.error('仅支持上传JPG/JPEG/PNG/GIF格式图片!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        Message.error('图片尺寸大小必须小于2MB!');
      }
    }
    return limit;
  }
  render() {
    const {
      uploadTitleList,
      contentList,
      currentInput,
      previewVisible,
      previewImage,
      img_preview,
    } = this.state;
    const { initialValue, flowData, uploadData, describe, isAttach,isRadio,isIamge } = this.props;
    console.log("previewImage",this.state.contentList);
    console.log('RadioValue',this.props.RadioValue);
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
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      listType: 'picture-card',
      fileList: this.state.uploadTitleList,
      onPreview: this.handlePreview,
      beforeUpload: this.beforeUpload,
      // showUploadList:false,
      onChange: info => {
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
          //
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

            Message.success(`${info.file.name}上传成功。`);
            this.setState({ uploadTitleList: fileList });
            this.props.setUploadPicture({
              [this.props.keys]: fileList,
            });
          }else{
            Message.error('请检查接口状态！');
            this.setState({ uploadTitleList: [] });
          }
        } else if (status === 'error') {
          Message.error(`${info.file.name} 上传失败。`);
        }
      },
    };
    console.log('img_preview',this.state.img_preview)
    return (
      <div>
        {this.props.type === 'uploadPicture' ? (
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text" style={{textDecoration: 'underline'}}>{'点击或拖拽上传文件'}</p>
          </Dragger>
        ) : this.props.type === 'uploadPicture_button' ? (
          <div>
            <Button onClick={this.addImg}>
              {describe ? '添加图片' : '添加文件'}
            </Button>
            {this.state.img_array.map(item => {
              return (
                <div key={item.id} style={{ display: 'flex' }}>
                  <Upload
                    accept={this.props.mode ==='视频上传'?'video/*':this.props.mode === '上传附件'?'txt/*':'image/*'}
                    key={'upload' + item.id}
                    name="file"
                    multiple={true}
                    action={this.state.uploadPicture}
                    fileList={contentList[item.id]}
                    beforeUpload= {this.beforeUpload}
                    onChange={info => {
                      // debugger;
                      const status = info.file.status;
                      let fileList = [...info.fileList];
                      fileList = fileList.slice(-1);
                      if (currentInput[item.id]) {
                        fileList[0] = {
                          ...fileList[0],
                          ...{ describe: currentInput[item.id] },
                        };
                        contentList[item.id] = fileList;
                      } else {
                        contentList[item.id] = [...fileList];
                      }
                      if (status === 'removed') {
                        delete contentList[item.id];
                        delete img_preview[item.id];
                        delete currentInput[item.id];
                        this.deleteImg(item.id);
                        let content = [...contentList];
                        this.props.setUploadContentPicture({ key: item.id, content: content[item.id], type: this.props.keys});
                      }
                      this.setState({ contentList });
                      if (status === 'uploading') {
                        //
                        if (info.file.response === '') {
                          Message.error('请检查接口状态！');
                        }
                      }
                      if (status === 'done') {
                        if (info.file.response !== '') {
                          Message.success(`${info.file.name}上传成功。`);
                          this.setState({fileName:info.file.name});
                          if (currentInput[item.id]) {
                            fileList[0] = {
                              ...fileList[0],
                              ...{ describe: currentInput[item.id] },
                              ...{id:item.id},
                            };
                            contentList[item.id] = fileList;
                          } else {
                            fileList[0] = {
                              ...fileList[0],
                              ...{ id: item.id },
                            };
                            contentList[item.id] = fileList;
                          }
                          let content = contentList;
                          console.log("content",content)
                          this.props.setUploadContentPicture({ key: item.id, content: content[item.id][0], type: this.props.keys});
                          console.log("this.props",this.props)
                          if(this.props.onChange){
                            this.props.onChange(content);
                          }
                          img_preview[item.id]= content[item.id][0].response.entity[0].filePath;
                          this.setState({ contentList, img_preview });
                        }else{
                          Message.error('请检查接口状态！');
                          this.setState({ contentList: [] });
                        }
                      } else if (status === 'error') {
                        Message.error(`${info.file.name} 上传失败。`);
                      }
                    }}
                  >
                    {
                      contentList[item.id] ?null:
                        <Button>
                          <Icon type="upload" />{' '}
                          {'选择文件'}
                        </Button>
                    }
                  </Upload>
                  {contentList[item.id] ? (
                    <div>
                      <Button
                        onClick={() =>
                          this.setState({ img_review: isIamge?true:false,isAttach:isAttach?true:false,isRadio:isRadio?true:false,current: img_preview[item.id] })
                        }
                      >
                        查看
                      </Button>
                    </div>
                  ) : null}
                  <div style={{ display: describe ? 'inline-block' : 'none' }}>
                    <span>描述</span>
                    <Input
                      onChange={e => this.describeChange(e, item.id)}
                      style={{ width: '300px' }}
                      value={currentInput[item.id]}
                    />
                  </div>
                  <Button onClick={() => this.deleteImg(item.id)}>删除</Button>
                </div>
              );
            })}
          </div>
        ) : null}

        <span style={{display:this.props.isRadio?'inline-block':'none',color:'red'}}>在线预览仅支持H264编码格式的mp4视频文件</span>
        
        <Modal
          className="img-review-modal"
          visible={this.state.img_review}
          onCancel={() => this.setState({ img_review: false })}
          footer={null}
          destroyOnClose
        >
          {API_CHOOSE_SERVICE==1?<img src={API_FILE_VIEW + this.state.current} style={{ width: '520px', height: '300px' }} />:<img src={API_FILE_VIEW_INNER + this.state.current} style={{ width: '520px', height: '300px' }} />

          }
          
        </Modal>
        <Modal
          className="img-review-modal"
          visible={this.state.isRadio}
          onCancel={() => this.setState({ isRadio: false })}
          footer={null}
          destroyOnClose
        >
          <video id="my-player" className="video-js" controls preload="auto" poster="" data-setup="{}">
            <source src={this.state.current} type="video/mp4" />
          </video>
        </Modal>
        <Modal

          className="img-review-modal"
          visible={this.state.isAttach}
          onCancel={() => this.setState({ isAttach: false })}
          footer={null}
          destroyOnClose
        >
          {API_CHOOSE_SERVICE==1?<a  className="attach" href={API_FILE_VIEW+this.state.current} download={API_FILE_VIEW+this.state.fileName}>{this.state.fileName}</a>:
            <a  className="attach" href={API_FILE_VIEW_INNER + this.state.current} download={API_FILE_VIEW_INNER + this.state.fileName}>{this.state.fileName}</a>
          }
          
        </Modal>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={ previewImage} />
        </Modal>
      </div>
    );
  }
}