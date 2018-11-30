import React, { Component } from 'react';
import {
  Modal,
  Icon,
  Upload,
  message,
} from 'antd';
import API_PREFIX, { masterUrl } from '../../apiprefix';
import './componentAddAndEdit.less';
import Login from '../../../login';
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
export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.pictureUrl == undefined ? [] :[{
      uid: -1,
      name: '',
      status: 'done',
      url: this.props.pictureUrl,
    }],
    imageUrl:'',
  };

  handleCancel = () => {
    console.log('123456');
    this.setState({ previewVisible: false });
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
   
    handleChange = (info) => {
      console.log('123',info.file.status);
      const arr = [];
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        arr.push(this.state.imageUrl);
        this.setState({ imageUrl:masterUrl +`${info.file.response.entity[0].filePath}` ,
          previewImage:masterUrl +`${info.file.response.entity[0].filePath}`,
        },()=>{
          console.log('last',this.state.imageUrl,this.state.previewImage);
        });
        message.success(`${info.file.name} 上传成功。`);
      }else if(info.file.status === 'error'){
        message.error(`${info.file.name} 上传失败。`);
      }
      this.setState({ fileList :info.fileList});

      this.props.getUrlChange(this.state.imageUrl);
    };

    render() {
      const { previewVisible, previewImage, fileList } = this.state;
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      return (
        <div className="clearfix">
          <Upload
            action={uploadPicture}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            beforeUpload={beforeUpload}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      );
    }
}
