import React, { Component } from   'react';
import {
  Modal,
  Icon,
  Upload,
  message,
} from 'antd';

import API_PREFIX, { masterUrl } from '../../apiprefix';

import './uploadPicture.less';
// const masterUrl = 'http://10.110.200.62:9080/';
const uploadPicture = API_PREFIX+'/services/attachment/file/upload/AttachmentUpload';

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('仅支持上传JPG格式文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片尺寸大小必须小于2MB!');
  }
  return isJPG && isLt2M;
}

export default class Avatar extends React.Component {
  constructor(props){
    super(props);
    console.log('props:',this.props);
  }
  state = {
    imageUrl:this.props.pictureUrl ,
    previewImage:this.props.pictureUrl,
  };

  handleChange = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log('handleChange',this.state.imageUrl);
      this.setState({ imageUrl:masterUrl +`${info.file.response.entity[0].filePath}` ,
        previewImage:masterUrl +`${info.file.response.entity[0].filePath}`,
      });
      message.success(`${info.file.name} 上传成功。`);
    }else if(info.file.status === 'error'){
      message.error(`${info.file.name} 上传失败。`);
    }
    this.props.transferUrl(this.state.imageUrl);
  };

  handlePreview = (file) => {
    console.log('file',file);
    this.setState({
      previewImage: file.url || file.thumbUrl,
    });

  }

  render() {
    const {imageUrl,previewImage} = this.state;
    console.log('imageUrl',imageUrl);
    return (
      <div className="avatar_picture">
        <Upload
          className="avatar-uploader"
          name="avatar"
          multiple ={false}
          showUploadList={false}
          action= {uploadPicture}
          beforeUpload={beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {
            imageUrl ?
              <img src={imageUrl} alt="" className="avatar" /> :
              <div>
                <Icon type="plus" className="avatar-uploader-trigger" />
                <div className="ant-upload-text">上传图片</div>
              </div>
          }
        </Upload>
      </div>
    );
  }
}