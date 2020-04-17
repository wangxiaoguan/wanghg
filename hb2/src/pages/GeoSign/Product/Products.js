import PageHeaderWrapper from "@/components/PageHeaderWrapper"
import StandardTable from "@/components/StandardTable"
import React, { Fragment, PureComponent } from 'react';
import { Button, Card, Dropdown, Select, Form, Icon, Menu, Input, Modal, Divider, message, Upload, Tag } from 'antd';
import styles from './Products.less';
import { connect } from 'dva';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const geo = [{name:"武汉"}, {name:"黄石"}, {name:"十堰"}, {name:"宜昌"}, {name:"襄阳"}, {name:"鄂州"}, {name:"荆门"},
             {name:"孝感"}, {name:"荆州"}, {name:"黄冈"}, {name:"咸宁"}, {name:"随州"}, {name:"恩施"}, {name:"仙桃"},
             {name:"潜江"}, {name:"天门"}, {name:"神农架"}];

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
    const width = 900;
    const { modalVisible, current = {}, form, handleSubmit, showModal, kinds, tags } = this.props;
    let { fileList } = this.state;
    const { pictureChange } = this.state;
    const controls = ['undo', 'redo', 'separator', 'font-size', 'line-height', 'separator', 'bold', 'italic', 'underline', 'text-color',
      'remove-styles', 'separator', 'text-align', 'text-indent', 'separator', 'link', 'separator', 'media'];
    const geoSelect = [];
    geo.forEach((g) => {
      geoSelect.push(<Option value={g.name}>{g.name}</Option>)
    } );

    if (current.picture && pictureChange === 0) {
      fileList = [{
        uid: '-1',
        name: current.picture,
        status: 'done',
        url: `/geo/geo/images/product/${current.picture}`,
      }];
    }

    const selectKinds = [];
    if (kinds) {
      kinds.forEach((k) => {
        selectKinds.push(
          <Option value={k.kindId}>{k.name}</Option>
        )
      } );
      selectKinds.reverse();
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
      showModal();
    };

    return(
      <Modal
        width={width}
        destroyOnClose
        title={`${JSON.stringify(current) === '{}' ? "新增" : "编辑"}产品`}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={cancelHandel}
      >
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="产品名">
          {form.getFieldDecorator('name', {
            initialValue: current.name,
            rules: [{ required: true, message: '产品名至少两个字！', min: 2 }],
          })(<Input placeholder="产品名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="类目">
          {form.getFieldDecorator('kindId', {
            initialValue: current.kindId,
            rules: [{ required: true, message: '请选择产品所属类目！'}],
          })(
            <Select placeholder="所属类目" style={{ width: '100%' }}>
              {selectKinds}
            </Select>)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="首图">
          {form.getFieldDecorator('picture', {
            initialValue: current.picture,
            rules: [{ required: true, message: '请选择首图！'}],
          })(
            <Upload
              action='/geo/product/upload'
              listType='picture'
              defaultFileList={fileList}
              beforeUpload={this.beforeUpload}
              onChange={this.handelUpload}
            >
              {fileList.length >= 1 ? null : <Button><Icon type="upload" />选择图片</Button>}
            </Upload>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="标签">
          {form.getFieldDecorator('tagId',{
            initialValue: current.tagId ? current.tagId.split(",") : current.tagId,
            getValueFromEvent: value => value.slice(0, 4),
            rules: [{ required: true, message: '请选择文章标签！' }],
          })(
            <Select mode="multiple" placeholder="产品标签" style={{ width: '100%' }}>
              {selectTag}
            </Select>)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="产地">
          {form.getFieldDecorator('geoLocation', {
            initialValue: current.geoLocation,
            rules: [{ required: true, message: '产地名至少两个字！', min: 2 }],
          })(
            <Select placeholder="产品产地" style={{ width: '100%' }}>
              {geoSelect}
            </Select>)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="产品保护公告号">
          {form.getFieldDecorator('protectNum', {
            initialValue: current.protectNum,
            rules: [{ required: true, message: '产品保护公告号必填！', min: 1 }],
          })(<Input placeholder="产品保护公告号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="核准/变更公告号">
          {form.getFieldDecorator('confirmNum', {
            initialValue: current.confirmNum,
            rules: [{ required: true, message: '核准/变更公告号必填！', min: 1 }],
          })(<Input placeholder="核准/变更公告号" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 20, offset: 2 }} label="产品介绍">
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
              placeholder="产品介绍"
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}

@connect(({ products, loading }) => ({
  products,
  loading: loading.models.products,
}))
@Form.create()
class ProductsTable extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    current: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'products/queryData',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'products/queryData',
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
          type: 'products/delete',
          payload: {
            id: selectedRows.map(row => row.productId).join(","),
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

  showModal = flag => {
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  showEditModal = Item => {
    this.setState({
      modalVisible: true,
      current: Item,
    });
  };

  handleSubmit = fields => {
    const { dispatch } = this.props;
    const { current = {} } = this.state;
    const currentId = JSON.stringify(current) === "{}" ? "" : current.productId;
    dispatch({
      type: currentId === "" ? 'products/addOne' : 'products/updateOne',
      payload: {
        id: currentId,
        ...fields,
      },
    });

    message.success(`${currentId === "" ? '添加' : '更新'}成功`);
    this.showModal();
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'products/delete',
      payload: {
        id,
      },
    });
  };

  handleDelete = (currentItem) => {
    Modal.confirm({
      title: '删除产品',
      content: '确定删除该产品吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(currentItem.productId),
    });
  };

  render() {
    const {
      products: {data},
      loading,
    } = this.props;
    const { selectedRows, modalVisible, current = {} } = this.state;
    const { listProduct, tags, kinds } = data;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      showModal: this.showModal,
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'productId',
        sorter: (a, b) => a.productId - b.productId,
      },
      {
        title: '产品名称',
        dataIndex: 'name',
      },
      {
        title: '类目',
        render: val => {
          let kindName = '';
          for (const i in kinds) {
            if (kinds[i].kindId === val.kindId) {
              kindName = kinds[i].name;
              break;
            }
          }
          return(<span>{kindName}</span>)
        },
      },
      {
        title: '产地',
        dataIndex: 'geoLocation',
      },
      {
        title: '产品保护公告号',
        dataIndex: 'protectNum',
      },
      {
        title: '核准/变更公告号',
        dataIndex: 'confirmNum',
      },
      {
        title:'产品标签',
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
        dataIndex: 'modifiedBy',
      },
      {
        title: '修改时间',
        dataIndex: 'modificationTime',
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
      <PageHeaderWrapper title="产品管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showModal(true)}>
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
              data={listProduct}
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
          kinds={kinds}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ProductsTable;




