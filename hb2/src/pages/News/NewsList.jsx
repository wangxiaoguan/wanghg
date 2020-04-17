import {Button, Card, Col, Form, Select, Switch, Modal, Cascader} from 'antd';
import React, {Component} from 'react';

import SearchTable from '@/components/SearchTable';
import NewsStatusEnum from '@/Enums/NewsStatusEnum';
import {connect} from 'dva';
import {createSearchString, isEmptyArray} from '@/utils/SystemUtil';
import FormRefreshButton from '@/components/FormRefreshButton';
import FormResetButton from '@/components/FormResetButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import {confirmDelete} from '@/utils/AntdUtil';
import EditButton from '@/components/EditButton';
import HCascader from '@/components/Antd/HCascader';

const moment = require('moment');

const FormItem = Form.Item;
const {confirm} = Modal;
const {Option} = Select;
const FormItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 19},
};

/**
 * 新闻列表
 */
@connect(({news, loading}) => ({
  news,
  loading,
}))
@Form.create()
class NewsList extends Component {
  constructor(props) {
    super(props);
    this.TABLE_COLUMNS = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '作者',
        dataIndex: 'author',
      },
      {
        title: '所属类别',
        dataIndex: 'typeName',
      },
      {
        title: '所属栏目',
        dataIndex: 'itemName',
      },
      {
        title: '发布时间',
        dataIndex: 'createTime',
      },
      {
        title: '审核状态',
        render: (text, record) => {
          return NewsStatusEnum.toString(record.auditStatus);
        }
      },
      {
        title: '操作',
        dataIndex: '',
        width: 300,
        render: (text, record) => {
          return (
            <span className='controlsContainer'>
              <a onClick={() => {window.location.hash = `news/list/edit/${record.id}`}}>修改</a>
              <a onClick={() => {
                confirmDelete(() => {
                  this.remove(record.id);
                })
              }}
              >
                删除
              </a>
              <a onClick={() => {window.location.hash = `news/list/edit/${record.id}/true`}}>预览</a>
              <Switch
                unCheckedChildren='未置顶'
                checkedChildren='置顶'
                checked={record.isStick === 1}
                onChange={(enable) => {
                  this.updateStick(record.id, enable);
                }}
              />
            </span>
          );
        },
      },
    ];
  }

  remove(id) {
    this.props.dispatch(
      {
        type: 'news/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  updateStick(id, isStick) {
    this.props.dispatch(
      {
        type: 'news/update',
        payLoad: {
          id,
          isStick: isStick ? '1' : '0',
        },
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


  searchCreater(formValues, pageSize, current) {
    const category = formValues.category || [];
    const params = {
      ...formValues,

      // 根据接口调整参数
      'module': 'index',
      'type': category[0],
      'item': category[1],
      'itemProperties': category[2],
    }
    return `/services/indexManage/news/list/${current}/${pageSize}${createSearchString(params, (params, key) => {
      if (key === 'module') {
        return 'Q=module_EQ=index';
      }
    })}`;
  }

  transData(response) {
    return {
      data: response.data.data,
      total: response.data.length,
    };
  }

  render() {
    return (
      <Card title='内容管理'>
        <SearchTable
          getInstance={(target) => {this.table = target}}
          formItems={SearchForm}
          columns={this.TABLE_COLUMNS}
          searchCreater={this.searchCreater}
          transData={this.transData}
          formProps={
            {
              layout: 'horizontal'
            }
          }
        />
      </Card>
    );
  }
}

@connect(({news, loading}) => ({
  news,
  loading,
}))
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryData: null,
    };
  }

  componentDidMount() {
    this.requestCategoryData();
  }

  requestCategoryData() {
    this.props.dispatch(
      {
        type: 'newsCategory/searchAllEnable',
        callBack: (res) => {
          this.setState({categoryData: res.data});
        }
      }
    );
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const FORM_ITEMS = [
      {
        label: '标题',
        content: getFieldDecorator('title')(<HInput />),
      },
      {
        label: '所属栏目',
        content: getFieldDecorator('category')(<HCascader changeOnSelect={true} options={this.state.categoryData} fieldNames={{label: 'name', value: 'id', children: 'childItem'}} />),
      },
      {
        label: '审核状态',
        content: getFieldDecorator('auditStatus')(
          <Select allowClear>
            {
              [NewsStatusEnum.UNCHECKED, NewsStatusEnum.CHECKING, NewsStatusEnum.CHECKED].map((item) => <Option key={item} value={Number(item)}>{NewsStatusEnum.toString(item)}</Option>)
            }
          </Select>
        ),
      },
      {
        label: '发布时间',
        content: getFieldDecorator('createTime')(
          <HRangePicker
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }}
          />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item, i) => {
              return (
                <Col span={8} key={i}>
                  <FormItem {...FormItemLayout} label={item.label}>{item.content}</FormItem>
                </Col>
              );
            })
          }
          <Col span={8}>
            <FormItem {...FormItemLayout} wrapperCol={{offset: 5}}>
              <FormRefreshButton />
              <FormResetButton />
            </FormItem>
          </Col>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash='/news/list/edit' />
          {/* <Button type="primary" disabled={isEmptyArray(this.props.selectedRowKeys)}>提交审核</Button> */}
        </div>
      </div>
    );
  }
}

export default NewsList;