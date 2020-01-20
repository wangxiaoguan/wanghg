import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Input, Select, Icon, Button, Dropdown, Menu, Modal, message, Divider, Upload, Tag } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import BraftEditor from "braft-editor";
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@Form.create()
class CreateForm extends PureComponent{
  state = {
    fileList: [],
    pictureChange: 0,
    pictureValid: true,
  };

  // 图片上传前验证
  beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('上传的图片不能大于2M!');
    }
    this.setState({
      pictureValid: isLt2M,
    })
  };

  handelUpload = ({fileList}) => {
    const { pictureValid }  = this.state;
    if (pictureValid) {
      this.setState({
        fileList,
        pictureChange: 1,
      })
    }
  };

  render() {
    const { modalVisible, current = {}, form, handleSubmit, handleModalVisible, category, tags } = this.props;
    let { fileList } = this.state;
    const { pictureChange } = this.state;
    const width = 900;
    const controls = ['undo', 'redo', 'separator', 'font-size', 'line-height', 'separator', 'bold', 'italic', 'underline', 'text-color',
      'remove-styles', 'separator', 'text-align', 'text-indent', 'separator', 'link', 'separator', 'media'];

    if (current.picture && pictureChange === 0) {
      fileList = [{
        uid: '-1',
        name: current.picture,
        status: 'done',
        url: `/geo/geo/images/article/${current.picture}`,
      }];
    }

    const selectCategory = [];
    if (category) {
      category.forEach((c) => {
        selectCategory.push(
          <Option value={c.categoryId}>{c.name}</Option>
        )
      } );
      selectCategory.reverse();
    }

    const selectTag = [];
    if (tags) {
      tags.forEach((t) => {
        selectTag.push(
          <Option value={t.tagId.toString()}>{t.name}</Option>
        )
      } );
      selectTag.reverse();
    }

    const okHandle = () => {
      const { pictureValid }  = this.state;
      if (!pictureValid) {
        message.error('上传的图片不能大于2M!');
        return
      }
      form.validateFields((err, fieldsValue) => {
        if (err) return;

        if (pictureChange === 1) {
          if (fieldsValue.picture.file.uid === '-1'){
            fieldsValue.picture = fieldsValue.picture.file.name;
          }else{
            fieldsValue.picture = fieldsValue.picture.file.response.message;
          }
        }

        fieldsValue.body = fieldsValue.body.toHTML();
        fieldsValue.tagId = fieldsValue.tagId.join(",");

        form.resetFields();
        this.setState({
          fileList: [],
          pictureChange: 0,
          pictureValid: true,
        });
        handleSubmit(fieldsValue);
      });
    };

    const cancelHandel = () => {
      this.setState({
        fileList: [],
        pictureChange: 0,
        pictureValid: true,
      });
      handleModalVisible();
    };

    return(
      <Modal
        width={width}
        destroyOnClose
        title={`${JSON.stringify(current) === "{}" ? "新增" : "编辑"}文章`}
        visible={modalVisible}
        okText="保存"
        onOk={okHandle}
        onCancel={cancelHandel}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
          {form.getFieldDecorator('title', {
            initialValue: current.title,
            rules: [{ required: true, message: '文章标题不能为空！' }],
          })(<Input placeholder="文章标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类别">
          {form.getFieldDecorator('categoryId',{
            initialValue: current.categoryId,
            rules: [{ required: true, message: '请选择文章所属类别！'}],
          })(
            <Select placeholder="所属分类" style={{ width: '100%' }}>
              {selectCategory}
            </Select>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="首图">
          {form.getFieldDecorator('picture', {
            initialValue: current.picture,
            rules: [{ required: true, message: '请选择首图！'}],
          })(
            <Upload
              action='/geo/article/upload'
              listType='picture'
              defaultFileList={fileList}
              beforeUpload={this.beforeUpload}
              onChange={this.handelUpload}
            >
              {fileList.length >= 1 ? null : <Button><Icon type="upload" />选择图片</Button>}
            </Upload>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签">
          {form.getFieldDecorator('tagId',{
            initialValue: current.tagId ? current.tagId.split(",") : current.tagId,
            getValueFromEvent: value => value.slice(0, 4),
            rules: [{ required: true, message: '请选择文章标签！' }],
          })(
            <Select mode="multiple" placeholder="文章标签" style={{ width: '100%' }}>
              {selectTag}
            </Select>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 20, offset: 2 }} label="内容">
          {form.getFieldDecorator('body', {
            initialValue: BraftEditor.createEditorState(current.body),
            validateTrigger: 'onBlur',
            rules: [{
              required: true,
              validator: (_, value, callback) => {
                if (value.isEmpty()) {
                  callback('请输入文章内容！')
                } else {
                  callback()
                }
              }
            }],
          })(
            <BraftEditor
              style={{ borderStyle: 'solid', borderRadius: 5, borderWidth: 1, borderColor: '#D9D9D9' }}
              className="my-editor"
              controls={controls}
              placeholder="文章内容"
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}

@connect(({ article, loading }) => ({
  article,
  loading: loading.models.article,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    current: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/queryData',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'article/queryData',
      payload: params,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'article/delete',
          payload: {
            id: selectedRows.map(row => row.articleId).join(","),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  handleSubmit = fields => {
    const { dispatch } = this.props;
    const { current = {} } = this.state;
    const currentId = JSON.stringify(current) === "{}" ? "" : current.articleId;
    dispatch({
      type: currentId === "" ? 'article/addOne' : 'article/updateOne',
      payload: {
        id: currentId,
        ...fields,
      },
    });

    message.success(`${currentId === "" ? '添加' : '更新'}成功`);
    this.handleModalVisible();
  };

  showEditModal = Item => {
    this.setState({
      modalVisible: true,
      current: Item,
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/delete',
      payload: {
        id,
      },
    });
  };

  handleDelete = (currentItem) => {
    Modal.confirm({
      title: '删除文章',
      content: '确定删除该文章吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(currentItem.articleId),
    });
  };

  render() {
    const {
      article: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, current = {} } = this.state;
    const { listArticle, tags, category } = data;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'articleId',
        sorter: (a, b) => a.articleId - b.articleId,
      },
      {
        title: '标题',
        dataIndex: 'title',
        width: "26%",
      },
      {
        title:'分类',
        render: val => {
          let cateName = '';
          for (const i in category) {
            if (category[i].categoryId === val.categoryId) {
              cateName = category[i].name;
              break;
            }
          }
          return(<span>{cateName}</span>)
        },
        width: "8%",
      },
      {
        title:'标签',
        render: val => {
          const tagBar = [];
          val.tagId.split(",").forEach((tid) => {
            for (const i in tags) {
              if (tags[i].tagId.toString() === tid) {
                tagBar.push(<Tag style={{margin:'3px 5px'}} color={tags[i].color}>{tags[i].name}</Tag>);
                break;
              }
            }
          });
          return(<Fragment>{tagBar}</Fragment>)
        },
        width: "14%",
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
      },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '修改人',
        dataIndex:'modifiedBy'
      },
      {
        title: '修改时间',
        dataIndex:'modificationTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },

      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showEditModal(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="文章管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={listArticle}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          current={current}
          tags={tags}
          category={category}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
