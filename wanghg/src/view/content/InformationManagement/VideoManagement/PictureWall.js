import React, { Component } from 'react';
import { Upload, Icon, Modal ,Message} from 'antd';
import API_PREFIX,{masterUrl} from '../../apiprefix';
const uploadPicture = API_PREFIX + 'services/attachment/file/upload/AttachmentUpload';

class PictureWall extends  Component{
  constructor(props){
    super(props);
    this.state={
      previewVisible:false,//预览的弹窗是否可见
      previewImage:'',//预览时展示图片的地址
      fileList:[{
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
      }],
    }
  }
  //预览
  handlePreview=(file)=>{
   this.setState({
     previewVisible:true,
     previewImage:masterUrl+'/'+file.response.entity[0].filePath,
   }, console.log('handlePreviewfile',this.state.previewImage));
  }
  handleCancel=()=>{
    this.setState({
      previewVisible:false,});
  }
  //上传之前
  beforeUpload=(file)=>{
    console.log("info-beforeUpload",file);
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    const isPic=isJPG||isPNG||isGIF;
    if(!isJPG&&!isPNG&&!isGIF){
      Message.error('仅支持上传JPG/JPEG/PNG/GIF格式图片!');
    }
    const isLimit2M=file.size/1024/1024<2;
    if(!isLimit2M){
      Message.error('图片尺寸大小必须小于2MB!');
    }
    return isPic&&isLimit2M;

  }
  //上传过程中
  handleChange=(info)=>{
  console.log("info",info);
   const status=info.file.status;//文件的状态  有：uploading done error removed
    console.log('info.file.status',info.file.status);
    // this.setState({ fileList: [...info.fileList] });
    if(status=='uploading'){
      console.log("info-uploading",info,'response',info.file.response);
    }
    if(status=='done'){
      console.log("info-done",info);
      if (info.file.response!=='') {
        Message.success(`${info.file.name}上传成功`);
        // this.setState({ fileList: [...info.fileList] });
      }else{
        Message.error('请检查接口状态！');
      }
    }
    if(status=='error'){
      console.log("info-error",info);
      Message.error(`${info.file.name} 上传失败`);
    }
    if(status=='removed'){
      console.log("info-removed",info);
    }
  }
    render(){
    //上传按钮，超过3个自己隐藏掉
    const uploadButton=(
        <div>
          <Icon type="plus" />
          <div className="upload-text">点击上传</div>
        </div>
    );
    const picProps={
      accept:'image/*',
      action:uploadPicture,
      name: 'file',
      listType: 'picture-card',
      fileList: this.state.fileList,
     onPreview: this.handlePreview,//预览时的回调
     beforeUpload: this.beforeUpload,//上传之前的回调
      onChange:this.handleChange,//上传过程中的回调

    }
    const {previewVisible,previewImage}=this.state;
      return(
          <div>
             <Upload
                 {...picProps}
             >
               {this.state.fileList.length >= 3 ? null : uploadButton}
             </Upload>
            <Modal visible={previewVisible}
                   footer={null}
                   onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
      );

  }
}
export default PictureWall;