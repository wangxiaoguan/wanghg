import React, { Component } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import styles from './taskReceipt.less';
import { storage, debounce } from '@/utils/utils';
import FileUpload from '@/components/FileUpload';
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ partyTask }) => ({
  partyTask,
}))
@Form.create()
class TaskReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // imageUrl: '',
      loading: false,
      fileList: [],
      taskAttachList: [],
      submitLoading: false,
    };
  }

  complete = () => {
    const {
      form,
      refresh,
      location: { query },
    } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { taskAttachList } = this.state;
        const taskInfoContent = {
          content: values.taskContent,
          msgId: 'TASK_RECEIPT_TX',
          taskId: query.taskId,
          taskAttachList,
          userId: userInfo.id,
          isSign: false,
        };
        this.setState({ submitLoading: true });
        dispatch({
          type: 'partyTask/sendReceipt',
          payload: { text: JSON.stringify(taskInfoContent) },
          callBack: () => {
            this.setState({ submitLoading: false });
            this.cancel();
            refresh();
          },
        });
      }
    });
  };

  cancel = () => {
    const { cancelModal } = this.props;
    cancelModal();
  };

  getForItemLayout = (x, y) => ({
    labelCol: {
      span: x,
    },
    wrapperCol: {
      span: y,
    },
  });

  addTaskAttachList = param => {
    const { taskAttachList } = this.state;
    taskAttachList.push(param);
    // console.log('taskAttachList===', taskAttachList);
    this.setState({ taskAttachList });
  };

  setFileList = (param, index) => {
    const { fileList } = this.state;
    fileList.push(param);
    this.setState({ fileList });
    // console.log('setFileList===', param, index);
  };

  removeFile = file => {
    const { fileList, taskAttachList } = this.state;
    const newAttachList = taskAttachList.filter(item => item.url !== file.url);
    const newFileList = fileList.filter(item => item.url !== file.url);
    this.setState({ taskAttachList: newAttachList, fileList: newFileList });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { submitLoading, fileList } = this.state;
    return (
      <div className={styles.InfromationPage}>
        <div className={styles.InformationContent}>
          <Form layout="horizontal" className={styles.stepForm} onSubmit={this.handleSubmit}>
            <FormItem {...this.getForItemLayout(3, 21)} label="回执内容">
              {getFieldDecorator('taskContent', {
                initialValue: '',
                rules: [{ required: true, message: '请在此输入回执内容' }],
              })(<TextArea rows={8} placeholder="请在此输入你的内容" />)}
            </FormItem>
            {/* <FormItem {...this.getForItemLayout(4, 16)} label="附件">
              {getFieldDecorator('attachment', {
                initialValue: 'checkedList',
                rules: [{ required: false, message: '请关联上级工作部署' }],
              })(
                <Upload
                  name="file"
                  action={filePath}
                  beforeUpload={this.beforeUpload}
                  onRemove={this.onRemoveFile}
                  // onChange={this.handleChange}
                  listType="picture-card"
                  fileList={fileList}
                  showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                >
                  {uploadButton}
                </Upload>
              )}
            </FormItem> */}
            <FormItem {...this.getForItemLayout(3, 21)} label="任务附件">
              {getFieldDecorator('taskAttach ', {
                initialValue: '',
                rules: [{ required: false, message: '上传任务附件' }],
              })(
                <div className={styles.taskFile}>
                  <div className={styles.fileType}>
                    最多添加五个附件 |
                    可以支持的类型：jpg,jpeg,bmp,png,gif,doc,docx,xls,xlsx,ppt,pptx,pdf,mp4
                  </div>
                  {/* <Button onClick={() => this.add('fileList')}>添加文件</Button> */}
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
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem style={{ textAlign: 'right' }}>
                  <div className={styles.buttonSure}>
                    <Button
                      onClick={debounce(this.complete, 1000)}
                      type="primary"
                      loading={submitLoading}
                    >
                      提交
                    </Button>
                  </div>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem style={{ textAlign: 'left' }}>
                  <div className={styles.buttonCancel}>
                    <Button onClick={() => this.cancel()}>取消</Button>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default TaskReceipt;
