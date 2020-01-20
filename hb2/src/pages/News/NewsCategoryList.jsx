import {Button, Form, Input, Modal, Switch, message, Spin, Card} from 'antd';
import React, {Component} from 'react';

import TreeControl from '@/utils/TreeControl';
import classNames from './NewsCategoryList.less';
import {createTree, createFormRules, createDefaultUploadFile, getAttatchStr} from '@/utils/AntdUtil';
import {connect} from 'dva';
import HInput from '@/components/Antd/HInput';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';

const FormItem = Form.Item;
const {confirm} = Modal;

const FORM_ITEM_LAYOUT = {
  labelCol: {span: 5},
  wrapperCol: {span: 19},
};

@connect(({newsCategory, loading}) => ({
  newsCategory,
  loading: loading.models.newsCategory,
}))
@Form.create()
class NewsCategoryList extends Component {
  constructor(props) {
    super(props);

    this.treeControl = new TreeControl((item) => item, 'childItem');

    this.state = {
      // 所有栏目列表
      treeData: null,
      // 当前选中的栏目
      selectedNode: null,
    };
  }

  componentDidMount() {
    this.requestList();
  }

  requestList = () => {
    this.props.dispatch(
      {
        type: 'newsCategory/searchAll',
        callBack: (res) => {
          this.setState({treeData: res.data});
        }
      }
    );
  }

  requestDeleteNode = () => {
    if (this.state.selectedNode) {
      this.props.dispatch(
        {
          type: 'newsCategory/remove',
          payLoad: this.state.selectedNode.id,
          callBack: () => this.requestList(),
        }
      );
    }
  }

  requestSaveNode = () => {
    if (this.state.selectedNode) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let data = {...values};
          data.visible = data.visible ? '1' : '0';
          if (data.fileInfo) {
            data.fileInfo = getAttatchStr(data.fileInfo);
          }
          this.props.dispatch(
            {
              type: 'newsCategory/update',
              payLoad: data,
              callBack: () => {
                message.success('保存成功');
                this.requestList();
              }
            }
          );
        }
      });
    }
  }

  requestAddCategory() {
    if (this.state.selectedNode) {
      this.props.dispatch(
        {
          type: 'newsCategory/add',
          payLoad: {
            parentId: this.state.selectedNode.id,
            name: '新栏目',
            itemDesc: '栏目描述',
            visible: '1',
          },
          callBack: () => {
            this.requestList();
          }
        }
      );
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const selectedNode = this.state.selectedNode || {};

    // 选中节点的层级，根结点是第1级
    let levelIndex = 0;
    if (this.state.treeData && selectedNode) {
      const chain = this.treeControl.searchChain(this.state.treeData, (node) => node.id === selectedNode.id);
      levelIndex = chain ? chain.length : 0;
    }

    const FORM_ITEMS = [
      {
        label: '节点编号',
        content: getFieldDecorator('id', {initialValue: selectedNode.id})(<HInput />),
      },
      {
        label: '节点名称',
        content: getFieldDecorator('name', {initialValue: selectedNode.name, rules: createFormRules(true)})(<HInput />),

      },
      {
        label: '节点说明',
        content: getFieldDecorator('itemDesc', {initialValue: selectedNode.itemDesc})(<Input.TextArea />),
      },
      {
        label: '栏目默认图片',
        content: getFieldDecorator('fileInfo', { initialValue: createDefaultUploadFile(selectedNode.fileInfo) })(<LimitUpload type={LimiteTypeEnum.IMAGE} />),
      },
      {
        label: '状态',
        content: getFieldDecorator('visible', {initialValue: selectedNode.visible === '1', valuePropName: 'checked'})(<Switch checkedChildren='启用' unCheckedChildren='禁用' />),
      }
    ];

    return (
      <Card title='栏目管理'>
        <Spin spinning={this.props.loading}>
          <div className="divAreaContainer controlsContainer">
            {/*  大于等于3级，不能增加栏目 */}
            <Button
              disabled={!selectedNode.id || levelIndex >= 3}
              onClick={() => {
                this.requestAddCategory();
              }}
            >
              增加栏目
            </Button>
            <Button
              type="primary"
              disabled={!selectedNode.id}
              onClick={() => {
                this.requestSaveNode();
              }}
            >
              保存
            </Button>
            {/* 第一级不可删除 */}
            <Button
              disabled={!selectedNode.id || levelIndex <= 1}
              type="danger"
              onClick={() => {
                confirm({
                  title: '操作不可恢复',
                  content: '确认要删除选中的类别吗?',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {
                    this.requestDeleteNode();
                  },
                  onCancel: () => {
                    message.info('操作已取消');
                  },
                });
              }}
            >
              删除
            </Button>
          </div>
          <div className={`divAreaContainer ${classNames.contentContainer}`}>
            {
              createTree(
                this.state.treeData,
                (node) => {
                  return {
                    title: node.name,
                    key: node.id,
                    style: {}
                  };
                },
                (node) => {
                  return node.childItem;
                },
                {
                  selectedKeys: this.state.selectedTreeKeys,
                  onSelect: (selectedTreeKeys) => {
                    const newSelectedNode = this.treeControl.search(this.state.treeData, (item) => item.id.toString() === selectedTreeKeys[0]);
                    this.setState({selectedTreeKeys, selectedNode: newSelectedNode}, this.props.form.resetFields);
                  },
                })
            }
            <Form>
              {
                FORM_ITEMS.map((item) => {
                  return <FormItem key={item.label} {...FORM_ITEM_LAYOUT} label={item.label}>{item.content}</FormItem>
                })
              }
            </Form>
          </div>
        </Spin>
      </Card>
    );
  }
}

export default NewsCategoryList;