import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Modal } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import { storage } from '@/utils/utils';
import FileUpload from '@/components/FileUpload';

const { TextArea } = Input;
// 'jpeg', 'jpg', 'png', 'bmp', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'
const accept = 'image/gif,image/jpeg,image/jpg,image/bmp,image/png,' +
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
  'application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/msword,' // xls,ppt,doc
  + 'application/pdf' // pdf

@Form.create()
@connect(({ comment, loading }) => ({
  comment,
  loading
}))
class NoteModal extends React.Component {

  static propTypes = {
    newsId: PropTypes.string, // 学习id
  };

  static defaultProps = {
    newsId: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      fileList: this.getFileList(props) || [],
    }
  }

  onChange = ({ target: { value } }) => {
    this.setState({ content: value });
  };

  getFileType = (fileName)=>{
    const ext = fileName && fileName.indexOf('.') > -1 ? fileName.split('.').pop() : '';
    if(ext === 'jpg' || ext === 'png' ||ext === 'bmp' ||ext === 'gif') {
      return 3
    } else {
      return 5
    }
  }

  onOk = () => {
    const { noteInfo, allFiles } = this.props.comment;
    const { fileList } = this.state;
    const { newsId, dispatch } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userId = userInfo.id;

    const files = fileList.map(f => {
      return {
        height: 0,
        newsActivity: {
          fileName: f.name,
          fileUrl: f.url,
        },
        type: this.getFileType(f.name),
        width: 0
      }
    })

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // TODO 学习笔记的附件
        // 附件类型（1资讯 2活动 3图片 4视频 5文件）
        const { content } = values;
        let param = {}
        if (noteInfo) {
          // 跟新
          const { noteId } = noteInfo;
          param = {
            dele: noteInfo.dele,
            msgId: "LEARNIN_NOTE_UPDATE",
            newsId: newsId,
            // noteAttachList: [],
            noteAttachList: files,
            noteId: noteId,
            notecontent: content,
            userId: userId
          }
        } else {
          // 增加
          param = {
            dele: "0",
            msgId: "SET_LEARNIN_NOTE",
            newsId: newsId,
            noteAttachList: files,
            notecontent: content,
            userId: userId,
          }
        }
        dispatch({
          type: 'comment/addOrUpdateNote',
          payload: {
            text: JSON.stringify(param)
          }
        })
      }
    });
  }

  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'comment/saveState',
      payload: {
        noteVisible: false
      }
    })
  }

  addTaskAttachList = param => {
    // const { taskAttachList } = this.state;
    // taskAttachList.push(param);
    // this.setState({ taskAttachList });
  };

  setFileList = (param, index) => {
    const { fileList } = this.state;
    fileList.push(param);
    this.setState({ fileList });
  };

  removeFile = file => {
    const { fileList } = this.state;
    const newFileList = fileList.filter(item => item.url !== file.url);
    this.setState({ fileList: newFileList });
  };


  renderFooter = () => {
    const { noteInfo } = this.props.comment;
    return <div style={{ textAlign: 'center' }}>
      <Button className='red-btn' onClick={this.onOk}>
        {noteInfo ? '保存' : '提交'}
      </Button>

      <Button className='btn-cancel' style={{ marginLeft: '40px' }} onClick={this.onCancel}>
        {'取消'}
      </Button>
    </div>
  }

  getFileList = (props)=>{
    const { allFiles } = props.comment;
    return allFiles.map(f => {
      return {
        name: f.newsActivity.fileName,
        url: f.newsActivity.fileUrl,
      }
    });
  }

  render() {
    const { noteInfo, noteVisible } = this.props.comment;
    const { fileList } = this.state;
    const { getFieldDecorator } = this.props.form;

    return <Modal
      footer={this.renderFooter()}
      visible={noteVisible}
      title={<div style={{ fontWeight: 600 }}>{'学习心得'}</div>}
      destroyOnClose
      className={styles.noteContainer}
      width={'757px'}
      centered
      onCancel={this.onCancel}
    >
      <div>
        <Form layout='inline' className={styles.noteForm}>
          <Form.Item label="学习笔记" >
            {getFieldDecorator('content', {
              rules: [
                {
                  required: true,
                  message: '请填写学习心得!',
                },
              ],
              initialValue: noteInfo && noteInfo.notecontent,
            })(<TextArea
              onChange={this.onChange}
              placeholder="请填写学习心得"
              className={styles.textArea}
              style={{ minHeight: '150px', width: '100%' }}
            />)}
          </Form.Item>
          <Form.Item label="附件">
            {getFieldDecorator('taskAttach ', {
              initialValue: '',
              rules: [{ required: false, message: '附件' }],
            })(
              <div>
                <div>
                  <span style={{ color: '#BA621B' }}>{'最多添加五个附件 | 可以支持的类型：jpeg,jpg,png,bmp,gif,doc,docx,xls,xlsx,ppt,pptx,pdf'}</span>
                </div>
                <FileUpload
                  value={fileList}
                  attachLength={0}
                  disabled
                  remove={this.removeFile}
                  addTaskAttachList={this.addTaskAttachList}
                  setFileList={this.setFileList}
                />
              </div>
            )}
          </Form.Item>
        </Form>
      </div>

      {/* <div style={{ marginTop: '20px' }}>
        <span>{'附件：'}<span style={{ color: '#BA621B' }}>{'最多添加五个附件 | 可以支持的类型：jpeg,jpg,png,bmp,gif,doc,docx,xls,xlsx,ppt,pptx,pdf'}</span></span>
      </div>
      <div className={styles.noteList}>
        <FileUpload
          value={fileList}
          attachLength={0}
          disabled
          remove={this.removeFile}
          addTaskAttachList={this.addTaskAttachList}
          setFileList={this.setFileList}
        />

      </div> */}

    </Modal >
  }
}

export default NoteModal;
