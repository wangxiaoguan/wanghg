import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Card, Spin } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import EditButton from '@/components/EditButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { confirmDelete } from '@/utils/AntdUtil';
import { createSearchString } from '@/utils/SystemUtil';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['discussion/remove']),
}))
class DiscussionList extends Component<IDispatchInterface, any> {
  private COLUMNS = [
    {
      title: '评议标题',
      dataIndex: 'activityTitle',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '是否已添加官方评议',
      dataIndex: 'isOfficial',
      render: (_, record) => {
        return record.isOfficial === 1 ? '√' : ''
      },
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`#/tbt/DiscussionList/DiscussionEdit/${record.id}`}>修改</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>
            <a href={`#/tbt/DiscussionList/DiscussionCheckList/${record.id}`}>查看评议</a>
            {
              record.isOfficial ? <a href={`#/tbt/DiscussionList/OfficialDiscussionEdit/${record.id}/1`}>查看官方评议</a> : <a href={`#/tbt/DiscussionList/OfficialDiscussionEdit/${record.id}`}>编辑官方评议</a>
            }
          </span >
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'discussion/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtocommentactivity/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title='评议活动管理'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
        />
      </Card>
    );
  }
}

class SearchForm extends Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '评议标题',
        content: getFieldDecorator('activityTitle')(<HInput />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem key={item.label} {...FormItemLayout} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem >
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash='/tbt/DiscussionList/DiscussionEdit' />
        </div>
      </div>
    );
  }
}

export default DiscussionList;