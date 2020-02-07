import React from 'react';
import { Input, Modal, Radio, Tooltip, Form, message } from 'antd';
import styles from './index.less';
import { connect } from 'dva';

const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

@connect(({applyActivityModel,activityDetailModel, loading}) => ({
  applyActivityModel,
  activityDetailModel,
  loading,
}))
@Form.create()
class ApplyModal extends React.Component {

  handleCancel = () => {
    // this.setState({
    //   showModal: false,
    //   editModal: false,
    // });
    const { dispatch } = this.props;
    dispatch({
      type: 'applyActivityModel/saveState',
      payload: {
        editModal: false,
        visible: false,
      },
    });
  };

  handleOk = () => {
    const { form, dispatch } = this.props;
    const { activityNewsId, userInfo } = this.props.activityDetailModel;
    const { editModal } = this.props.applyActivityModel;
    form.validateFields((err, values) => {
      if (!err) {
        const userDetail = {
          activityId: activityNewsId,
          msgId: editModal ? 'APP044' : 'APP018',
          userId: userInfo.id,
          userInfoList: [values],
        };
        dispatch({
          type: editModal ? 'applyActivityModel/joinActivity' : 'applyActivityModel/updateActivityInfo',
          payload: {
            text: JSON.stringify(userDetail),
          },
        });
      }
    });
  };

  render() {
    const {activityDetail, activityInfo,  } = this.props.activityDetailModel;
    const {userInfoList, visible, editModal } = this.props.applyActivityModel;

    // 从 'onlineExam/getonlineExam' 中获取的
    const { fieldList } = activityDetail;
    // const { userinfolist, activityInfo } = this.state;

    const { form } = this.props;
    const { getFieldDecorator, setFieldsValue } = form;

    // 自定义校验方法， 输入框不能输入汉字
    const checkData = (rule, value, callback) => {
      if (value) {
        if (!/^\d+$|^\d+\.\d+$/g.test(value)) {
          callback(new Error('只可输入数字!'));
        } else {
          callback(
            setFieldsValue({
              // 自动转成大写
              refTable: `${Number(value)}`,
            }),
          );
        }
      }
      callback();
    };

    const checkData2 = (rule, value, callback) => {
      callback(
        setFieldsValue({
          // 自动转成大写
          refTable: value,
        }),
      );
    };

    return (<Modal
        title={editModal ? '修改信息' : '报名信息'}
        visible={visible || editModal}
        onOk={this.handleOk}
        width={600}
        destroyOnClose
        onCancel={this.handleCancel}
      >
        <Form
          layout="horizontal"
          className={styles.stepForm}
          onSubmit={this.handleSubmit}
          hideRequiredMark
        >
          {fieldList &&
          fieldList.map((item, index) => (
            <Form.FormItem
              key={index}
              {...this.getForItemLayout(7, 15)}
              label={
                <Tooltip title={item.name}>
                  <span className={styles.toolTip}>{item.name}</span>
                </Tooltip>
              }
            >
              {getFieldDecorator(item.name, {
                initialValue:
                  editModal && userInfoList.length
                    ? this.getInitValue(userInfoList, item)
                    : null,
                rules:
                  item.type !== '选项'
                    ? [
                      {
                        required: item.isrequired,
                        message: '请输入',
                      },
                      {
                        max: item.length,
                        message: `字数不要超过${item.length}`,
                      },
                      {
                        validator: item.type === '数字' ? checkData : checkData2,
                        trigger: 'blur',
                      },
                    ]
                    : [
                      {
                        required: item.isrequired,
                        message: '请选择',
                      },
                    ],
              })(
                item.type === '选项' ? (
                  <RadioGroup>
                    {item.options.map((itemOpt, index) => (
                      <Radio key={index} value={itemOpt}>
                        {itemOpt}
                      </Radio>
                    ))}
                  </RadioGroup>
                ) : (
                  <Input placeholder={item.type === '数字' ? '请输入数字' : ''}/>
                ),
              )}
            </Form.FormItem>
          ))}
          {activityInfo && activityInfo.attention && (
            <div>
              <span className={styles.attention}>报名须知：</span>
              <TextArea
                disabled
                className={styles.attentionContent}
                defaultValue={activityInfo.attention}
                autosize={{ minRows: 1, maxRows: 10 }}
              />
            </div>
          )}
        </Form>
      </Modal>
    );
  }
}

export default ApplyModal;
