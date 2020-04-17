import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Popconfirm, message, Tree, Row, Col, Card } from 'antd';

import router from 'umi/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateForm from './AddModal';
import styles from './Setting.less';

const FormItem = Form.Item;
const { TreeNode } = Tree;

@connect(({ xaec, loading }) => ({
  xaec,
  loading: loading.models.xaec,
}))
@Form.create()
class Setting extends PureComponent {
  state = {
    selectedKeys: [],
    item: undefined,
    curItem: undefined,
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;

    if (location.state) {
      this.setState({ item: location.state.item });
      dispatch({
        type: 'xaec/fetchGroup',
        payload: { 'Q=groupCode_EQ': location.state.item.groupCode },
      });
    }
  }

  onSelect = selectedKeys => {
    const {
      xaec: { groupMap },
    } = this.props;
    this.setState({ selectedKeys, curItem: groupMap[selectedKeys[0]] });
  };

  handleUpdate = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    let { curItem } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        id: curItem.id,
        parentId: curItem.parentId,
        groupCode: curItem.groupCode,
      };

      curItem = { ...curItem, ...fieldsValue };
      dispatch({
        type: 'xaec/update',
        payload: values,
        callback: id => {
          if (id === undefined) {
            message.success(`编码重复，请重新输入`);
            return;
          }
          this.setState({ curItem });
          form.resetFields();
          dispatch({
            type: 'xaec/updateLocal',
            payload: { type: 2, item: curItem },
          });
          message.success(`修改成功`);
        },
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { curItem } = this.state;
    const payload = fields;
    payload.groupCode = curItem.groupCode;
    payload.parentId = curItem.id;
    dispatch({
      type: 'xaec/add',
      payload,
      callback: id => {
        if (id === undefined) {
          message.error(`编码重复，请重新输入`);
          return;
        }
        payload.id = id;
        dispatch({
          type: 'xaec/updateLocal',
          payload: { type: 1, item: payload },
        });
        message.success(`添加成功`);
      },
    });
    this.setState({
      modalVisible: false,
    });
  };

  checkCodeFunc = (curItem, callback) => {
    const { dispatch } = this.props;

    const payload = { 'Q=code_EQ': curItem.code, 'Q=groupCode_EQ': curItem.groupCode };
    if (curItem.id) {
      payload['Q=id_L_NE'] = curItem.id;
    }
    dispatch({
      type: 'xaec/check',
      payload,
      callback,
    });
  };

  renderHeader() {
    const { dispatch } = this.props;
    const { curItem, item } = this.state;
    let disabledAdd = true;
    if (item && curItem) {
      if ((item.type === '0' && curItem.parentId === 0) || item.type === '1') {
        disabledAdd = false;
      }
    }
    const disabledDel = !(curItem && curItem.parentId !== 0);
    return (
      <div>
        <Button.Group>
          <Button
            type="primary"
            disabled={disabledAdd}
            onClick={() => {
              this.setState({
                modalVisible: true,
              });
            }}
          >
            新增
          </Button>
          <Popconfirm
            title="确定删除？"
            onConfirm={() => {
              dispatch({
                type: 'xaec/remove',
                payload: { id: curItem.id },
                callback: () => {
                  this.setState({ selectedKeys: [], curItem: undefined });
                  message.success('删除成功');
                  dispatch({
                    type: 'xaec/updateLocal',
                    payload: { type: 3, item: curItem },
                  });
                },
              });
            }}
          >
            <Button disabled={disabledDel}>删除</Button>
          </Popconfirm>
          <Button
            onClick={() => {
              router.goBack();
            }}
          >
            返回
          </Button>
        </Button.Group>
      </div>
    );
  }

  renderSider() {
    const { selectedKeys } = this.state;
    const {
      xaec: { group },
    } = this.props;
    const loop = data =>
      data.map(item => {
        if (!item) {
          return null;
        }
        if (item.children) {
          return (
            <TreeNode key={item.id} title={item.desp}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={item.desp} />;
      });
    return (
      <Tree showLine autoExpandParent={false} onSelect={this.onSelect} selectedKeys={selectedKeys}>
        {loop(group)}
      </Tree>
    );
  }

  renderContent() {
    const { curItem } = this.state;
    const {
      form,
      xaec: { group },
    } = this.props;
    if (!curItem) {
      return false;
    }
    if (curItem && curItem.parentId === 0) {
      return false;
    }
    let rootData;
    for (let i = 0; i < group.length; ) {
      if (group[i].groupCode === curItem.groupCode) {
        rootData = group[i];
        break;
      }
      i += 1;
    }
    const dataType = rootData && rootData.desp;
    const codeValidate = (rule, value, cab) => {
      // console.log(curItem);
      const regAccount = /^[A-Za-z0-9-]+$/;
      if (!regAccount.test(value)) {
        cab('编码只能由英文字母和数字组成。');
      } else if (value.length > 100) {
        cab('编码必须填写，且不能超过100个字符');
      } else {
        // 校验编码 test
        // this.checkCodeFunc(curItem, has => {
        //   if (has) {
        //     console.log(has)
        //     cab('抱歉，编码已存在，请重新填写。');
        //   } else {
        //     cab();
        //   }
        // });
      }
    };
    return (
      <Form onSubmit={this.handleUpdate} className={styles.form}>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="数据类型：">
          {form.getFieldDecorator('rootDesc', {
            initialValue: dataType,
          })(<Input placeholder="数据类型" disabled />)}
        </FormItem>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="数据名称：">
          {form.getFieldDecorator('desp', {
            initialValue: curItem && curItem.desp,
            rules: [
              { required: true, message: '请输入数据类型名称.' },
              {
                pattern: /^([a-zA-Z]|[\u4E00-\u9FA5])[\u4E00-\u9FA5a-zA-Z0-9_]*$/,
                message: '名称由中文、数字、字母、下划线组成，必须以中文或字母开头!',
              },
            ],
          })(<Input placeholder="请输入数据类型名称（必填）" />)}
        </FormItem>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="数据编码：">
          {form.getFieldDecorator('code', {
            initialValue: curItem && curItem.code,
            rules: [
              { required: true, message: '请输入数据类型编码.' },
              { validator: codeValidate },
            ],
          })(<Input placeholder="请输入数据类型编码（必填）" />)}
        </FormItem>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form>
    );
  }

  render() {
    const { location } = this.props;
    const { modalVisible } = this.state;

    const parentMethods = {
      handle: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      isAdd: true,
    };

    return (
      <PageHeaderWrapper routerLocation={location}>
        <Card bordered={false}>
          {this.renderHeader()}
          <div style={{ marginTop: '16px' }}>
            <Row gutter={24}>
              <Col span={12}>
                <Card className={styles.cardContent}>{this.renderSider()}</Card>
              </Col>
              <Col span={12}>
                <Card className={styles.cardContent}>{this.renderContent()}</Card>
              </Col>
            </Row>
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
export default Setting;
