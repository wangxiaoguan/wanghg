import React, { Component } from 'react';
import { Upload, Button, Icon, message, Slider, Input } from 'antd';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import avatarTest from '../../../styles/images/sidebarMenu/test.jpg';
import './CutBeforeUpload.less';
export default class CutAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = { image: avatarTest, zoom: 1, rotate: 0 };
  }

  handleDrop = dropped => {
    this.setState({ image: dropped[0] });
  }
  beforeUpload = (file, fileList) => {
    console.log('file', file);
    console.log('filelist', fileList);
    const isJPG = file.type === 'image/jpeg';
    this.setState({ image: file });

    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return false;
  }
  // getBase64(img, callback) {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result));
  //   reader.readAsDataURL(img);
  // }
  // handleChange = (info) => {
  //   if (info.file.status === 'uploading') {
  //     this.setState({ loading: true });
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     this.getBase64(info.file.originFileObj, imageUrl => this.setState({
  //       imageUrl,
  //       loading: false,
  //     }));
  //   }
  // }
  setEditorRef = (editor) => this.editor = editor;
  render() {
    const { image, zoom, rotate, picUrl } = this.state;
    const props = {
      showUploadList: false,
      accept: 'image/*',
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload: this.beforeUpload,
      onChange: this.handleChange,
    };
    return <div className="cut-upload">
      <Dropzone onDrop={this.handleDrop} disableClick style={{ width: '300px', height: '300px' }}>
        <AvatarEditor ref={this.setEditorRef} width={250} height={250} scale={zoom} image={image} rotate={rotate} />
      </Dropzone>
      <Upload {...props}>
        <Button>
          <Icon type="upload" /> 选择图片
        </Button>
      </Upload>
      {/* <Input type="file" onChange={value=>this.setState({image:value.target.value})
      }/> */}
      <div className="cut-upload-option">
        <div className="cut-upload-option-label">缩放:</div>
        <Slider defaultValue={1} min={1} step={0.01} max={2} onChange={value => this.setState(
          { zoom: value }
        )} className="cut-upload-option-slider" />
      </div>
      <div className="cut-upload-option">
        <div className="cut-upload-option-label">旋转:</div>
        <div className="cut-upload-option-block">
          <Icon type="left" className="cut-upload-option-block-left" onClick={() => this.setState(
            { rotate: rotate - 90 }
          )} />
          <Icon type="right" className="cut-upload-option-block-right" onClick={() => this.setState(
            { rotate: rotate + 90 }
          )} />
        </div>
      </div>
      <Button onClick={() => this.setState({ picUrl: this.editor && this.editor.getImage().toDataURL() })}>
        预览
      </Button>
      <img src={picUrl} />
    </div>;
  }
}