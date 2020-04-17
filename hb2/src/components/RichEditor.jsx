import React, { Component } from 'react';
import Editor from 'wangeditor';
import { DOWNLOAD_API, UPLOAD_API } from '@/services/api';
import { message } from 'antd';
/**
 * 富文本编辑器
 */
class RichEditor extends Component {
  static defaultProps = {
    uploadImgServer: UPLOAD_API,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  initEditor() {
    this.editor = new Editor(this.refs.richEditor);
    this.editor.customConfig.uploadImgServer = this.props.uploadImgServer;
    this.editor.customConfig.uploadImgHooks = {
      customInsert: this.customInsert,
    };
    this.editor.customConfig.onchange = (html) => {
      if (this.props.onChange) {
        this.props.onChange(html);
      }
    };
    this.editor.create();
    this.editor.$textElem.attr('contenteditable', !this.props.disabled)
  }

  customInsert = (insertImg, result) => {
    if (result.sucess) {
      result.entity.forEach((item) => {
        insertImg(DOWNLOAD_API(item.id))
      });
    }
    else {
      message.error('上传失败');
    }
  }

  componentDidMount() {
    this.initEditor();
    this.initContent();
  }

  initContent() {
    if (this.props.value) {
      this.editor.txt.html(this.props.value);
    }
    this.editor.$textElem.attr('contenteditable', this.props.enable);
  }

  componentDidUpdate(prevProps) {
    // 当从有值变成无值，或无值变成有值时，重置内容（如果每次都didupdate都initContent，性能有问题）
    if ((!this.props.value || !prevProps.value) && this.props.value !== prevProps.value) {
      this.initContent();
    }
  }

  render() {
    return (
      <div ref='richEditor' disabled={true} />
    );
  }
}

export default RichEditor;