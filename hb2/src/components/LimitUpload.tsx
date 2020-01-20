import React, { Component, ReactNode } from 'react';
import { Upload, Icon, Button, Spin, message,Modal } from 'antd';
import { isEqual } from '@/utils/SystemUtil';
import { UPLOAD_API } from '@/services/api';

export enum LimiteTypeEnum {
  /**
   * 普通文件
   */
  NORMAL = 1,

  /**
   * 图片
   */
  IMAGE = 2,
}

interface ILimiteUploadProps {
  /**
   * 上传链接，如果在uploadProps设置相同属性，优先使用uploadProps中的值
   */
  action: string;

  disabled: boolean;

  /**
   * 最大允许的文件数量，0表示不限制，默认为1
   */
  max?: number;

  /**
   * 文件类型
   */
  type?: LimiteTypeEnum;

  /**
   * 接受上传的文件类型，如果在uploadProps设置相同属性，优先使用uploadProps中的值
   */
  accept?: string;

  /**
   * 判断文件是否上传成功的函数
   */
  fileUploadSuccess?: (file) => boolean;

  /**
   * 传给Upload的props
   */
  uploadProps?: any;

  /**
   * 上传成功的文件列表变化时触发的函数
   */
  onChange?: (value) => any;

  /**
   * 文件上传成功的回调
   */
  onFileUploadSuccess?: (file) => any;

  /**
   * 文件列表
   */
  value?: any[];

  uploadElement?: ReactNode;
}

interface ILimiteUploadState {
  fileList: any[];
  uploading: boolean;
  previewVisible: boolean;
  previewImage: any;
}

/**
 * 可设置最大上传数量的上传组件
 */
class LimitUpload extends Component<ILimiteUploadProps, ILimiteUploadState> {
  static defaultProps = {
    max: 1,
    type: LimiteTypeEnum.NORMAL,
    action: UPLOAD_API,
    disabled: false,
    uploadElement: '上传',
  };

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      fileList: null,
      previewVisible:false,
      previewImage:'',
    };
  }

  componentDidMount() {
    this.checkFileList(this.props.value);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.value, prevProps.value)) {
      this.checkFileList(this.props.value);
    }
  }

  fileUploadSuccess(file) {
    if (this.props.fileUploadSuccess) {
      return this.props.fileUploadSuccess(file);
    }
    return file && file.response && file.response.sucess;
  }

  /**
   * 创建上传的元素
   */
  _createUploadElement(): ReactNode {
    if (this.props.max && this.state.fileList && this.state.fileList.length >= this.props.max) {
      return null;
    }
    switch (this.props.type) {
      case LimiteTypeEnum.IMAGE:
        return (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">{this.props.uploadElement}</div>
          </div>
        );
      default:
        return (
          <Button disabled={Boolean(this.props.disabled)}>
            <Icon type="upload" />
            {this.props.uploadElement}
          </Button>
        );
    }
  }

  _createListType() {
    switch (this.props.type) {
      case LimiteTypeEnum.IMAGE:
        return 'picture-card';
      default:
        return 'text';
    }
  }

  fileChangeHandler = arg => {
    const { file, fileList } = arg;
    //上传时，使用antd自带的参数，否则无法进入下一个状态
    //上传结束时，检查文件列表
    if (file.status === 'uploading') {
      this.setState({ fileList, uploading: true });
    } else {
      this.checkFileList(fileList);
      this.setState({ uploading: false });

      switch (file.status) {
        case 'done':
          if (this.fileUploadSuccess(file)) {
            if (this.props.onFileUploadSuccess) {
              this.props.onFileUploadSuccess(file);
            }
            message.success('上传成功');
          } else {
            message.error('上传失败');
          }
          break;
        case 'error':
          message.error(`上传失败${file.status}`);
          break;
      }
    }
  };

  /**
   * 过滤文件
   */
  checkFileList(fileList) {
    let result = [];
    if (!fileList || !fileList.length) {
      result = fileList;
    } else {
      for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        if (result.length < this.props.max) {
          //如果文件上传成功，且未超出最大数量，则保存
          if (this.fileUploadSuccess(file)) {
            result.push(file);
          }
        } else {
          break;
        }
      }
    }
    this.setState({ fileList: result });
    if (this.props.onChange) {
      this.props.onChange(result);
    }
  }
  handlePreview = async file => {
    if(this.props.type===LimiteTypeEnum.IMAGE){
      this.setState({
        previewImage: file.thumbUrl||file.url,
        previewVisible: true,
      });
    }
  };
  handleCancel = () =>{
    this.setState({
      previewVisible: false,
    });
  }
  render() {
    const {previewVisible,previewImage} = this.state
    return (
      <div>
        <Spin spinning={this.state.uploading}>
          <Upload
            disabled={Boolean(this.props.disabled)}
            listType={this._createListType()}
            fileList={this.state.fileList}
            action={this.props.action}
            onChange={this.fileChangeHandler}
            accept={this.props.accept}
            {...this.props.uploadProps}
            onPreview={this.handlePreview}
          >
            {this._createUploadElement()}
          </Upload>
          <Modal visible={previewVisible} width={1000} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Spin>
      </div>
    );
  }
}

export default LimitUpload;
