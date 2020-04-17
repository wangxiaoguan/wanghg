import { Form, Input, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { SwatchesPicker } from 'react-color';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
class CreateForm extends PureComponent {
  state = {
    selectdColor: '',
  };

  handleSelectColor = (color) => {
    this.setState({
      selectedColor: color.hex,
    })
  };

  render() {
    const { selectedColor } = this.state;
    const { modalVisible, current = {}, form, handleSubmit , handleModalVisible } = this.props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) {
          // 如果验证不通过，将color fields重置，否则获取不到所选color的hex值
          form.resetFields('color', []);
          return;
        }
        form.resetFields();
        handleSubmit(fieldsValue);
      });
      this.setState({
        selectedColor: '',
      })
    };

    const cancelHandle = () => {
      handleModalVisible();
      this.setState({
        selectedColor: '',
      })
    };
    return (
      <Modal
        destroyOnClose
        title={`${JSON.stringify(current) === "{}" ? "新增" : "编辑"}标签`}
        visible={modalVisible}
        okText="保存"
        onOk={okHandle}
        onCancel={cancelHandle}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
          {form.getFieldDecorator('name', {
            initialValue: current.name,
            rules: [{ required: true, message: '标签标题不能为空！'},{message: '标签最多五个字！', max: 5}],
          })(<Input placeholder="标签标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="颜色">
          {form.getFieldDecorator('color', {
            initialValue: selectedColor === '' ? current.color : selectedColor,
            rules: [{ required: true, message: '标签颜色必选！' }],
          })(<Input className={styles.disabledInput} placeholder="标签颜色" disabled='true' />)}
          <SwatchesPicker
            width='292px'
            onChange={this.handleSelectColor}
          />
        </FormItem>
      </Modal>
    );
  }
}

export default CreateForm;
