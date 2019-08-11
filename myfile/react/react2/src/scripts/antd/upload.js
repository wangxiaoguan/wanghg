import { Icon,Spin,Alert,Pagination,Rate,Divider,BackTop,Upload,message,Button,Modal} from 'antd';
import React,{Component} from 'react'
const Dragger = Upload.Dragger;
export default   class Uploadfile extends Component {
    constructor(props){
        super(props);
        this.state={
          // previewVisible:true,
          uploadTitleList: [{
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'http://i2.tiimg.com/1949/626765ed136e2963t.jpg',
          },{
            uid: '-2',
            name: 'xxx.png',
            status: 'done',
            url: 'http://i1.fuimg.com/1949/2ef2d1fc9f914a33.jpg',
          },{
            uid: '-3',
            name: 'xxx.png',
            status: 'done',
            url: 'http://i1.fuimg.com/1949/c56f439f66c0ffe0.jpg',
          },{
            uid: '-4',
            name: 'xxx.png',
            status: 'done',
            url: 'http://i1.fuimg.com/1949/60289f3d485a8c00.jpg',
          }],
          
        }
    }
  
   
 componentWillMount(){
     console.log(this.props)
 } 
 componentDidUpdate(){
    console.log(this.props)
 }
 handleCancel = () => this.setState({ previewVisible: false })

 handlePreview = file => {
  this.setState({
    previewImage: file.url || file.thumbUrl,
    previewVisible: true,
  });
};
beforeUpload = (file) => {
  console.log(file)
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
    const {previewImage,previewVisible,uploadTitleList}=this.state
    const type='image/*, video/*,application/msword,application/pdf,application/vnd.ms-powerpoint,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation'  
    const props = {
        accept:type,
        name: 'file',
        multiple: true,
        listType: 'picture-card',//卡片模式，不写为线条模式
        action: '//jsonplaceholder.typicode.com/posts/',
        // action:'//yq-fiberhome-test.oss-cn-hangzhou.aliyuncs.com/',
        onPreview: this.handlePreview,
        beforeUpload: this.beforeUpload,
        fileList: this.state.uploadTitleList,
        onChange: info => {
          console.log(info)
          const status = info.file.status;
          let fileList = [...info.fileList];
          this.setState({ uploadTitleList: fileList });
          if (!status) {
            fileList.slice(0);
            fileList.splice(fileList.length-1,1);
            this.setState({ uploadTitleList: fileList });
          }
          if (status === 'uploading') {
           
            if (info.file.response === '') {
              message.error('请检查接口状态！');
            }
          }
          if (status === 'removed') {
            delete uploadTitleList[0];
            let content = [...uploadTitleList];
            
          }
          if (status === 'done') {
            if (info.file.response!=='') {
  
              message.success(`${info.file.name}上传成功。`);
              this.setState({ uploadTitleList: fileList });
          
            }else{
              message.error('请检查接口状态！');
              this.setState({ uploadTitleList: [] });
            }
          } else if (status === 'error') {
            this.setState({ uploadTitleList: fileList });
            message.error(`${info.file.name} 上传失败。`);
          }
        },
      }; 
    //   const props = {
    //     accept:'image/*',
    //     key: 'dropUpload',
    //     name: 'file',
    //     multiple: true,
    //     action: this.state.uploadPicture,
    //     listType: 'picture-card',
    //     fileList: this.state.uploadTitleList,
    //     onPreview: this.handlePreview,
    //     beforeUpload: this.beforeUpload,
    //     // showUploadList:false,
    //     onChange: info => {
    //       const status = info.file.status;
    //       let fileList = [...info.fileList];
    //       if(this.props.RadioValue!==3){
    //         fileList = fileList.slice(-1);
    //       }
    //       this.setState({ uploadTitleList: fileList });
    //       if (!status) {
    //         fileList.slice(0);
    //         fileList.splice(fileList.length-1,1);
    //         this.setState({ uploadTitleList: fileList });
    //       }
    //       if (status === 'uploading') {
    //         //
    //         if (info.file.response === '') {
    //           Message.error('请检查接口状态！');
    //         }
    //       }
    //       if (status === 'removed') {
    //         delete uploadTitleList[0];
    //         let content = [...uploadTitleList];
    //         this.props.setUploadPicture({[this.props.keys]: fileList});
    //       }
    //       if (status === 'done') {
    //         if (info.file.response!=='') {
  
    //           Message.success(`${info.file.name}上传成功。`);
    //           this.setState({ uploadTitleList: fileList });
    //           this.props.setUploadPicture({
    //             [this.props.keys]: fileList,
    //           });
    //         }else{
    //           Message.error('请检查接口状态！');
    //           this.setState({ uploadTitleList: [] });
    //         }
    //       } else if (status === 'error') {
    //         Message.error(`${info.file.name} 上传失败。`);
    //       }
    //     },
    //   };
    return (
        <div>
           <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text" style={{textDecoration: 'underline'}}>{'点击或拖拽上传文件'}</p>
          </Dragger>
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


