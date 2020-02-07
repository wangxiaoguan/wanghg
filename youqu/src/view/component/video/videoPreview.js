import React, {Component} from 'react';
import { Upload, Button, Icon } from 'antd';
export default class VideoPreview extends Component{
  constructor(props) {
    super(props);
    this.state={
      video:'',
    };
  }
  
  

  beforeUpload = (file, fileList) => {
    console.log('file', file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e=> {
      this.setState({ video: reader.result });
    };

    return false;
  }
  render(){
    console.log('video', this.state.video);
    let a = document.getElementById('my-player');
    console.log('a', a);
    const props = {
      showUploadList: false,
      accept: 'video/*',
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload: this.beforeUpload,
      onChange: this.handleChange,
    };
    return <div>
      <Upload {...props}>
        <Button>
          <Icon type="upload" /> 选择视频
        </Button>
      </Upload>
      {
        this.state.video ?
          <video id="my-player" className="video-js" controls preload="auto" poster="" data-setup="{}">
            <source src={this.state.video} type="video/mp4" />
          </video> : null
      }
    </div>;
  }
}