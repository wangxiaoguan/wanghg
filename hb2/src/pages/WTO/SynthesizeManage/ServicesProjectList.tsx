import React, { Component } from 'react';
import { Card, Form, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import EditButton from '@/components/EditButton';
import { createSearchString } from '@/utils/SystemUtil';
import { confirmDelete, renderAttatch } from '@/utils/AntdUtil';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';

const TITLE = '服务项目管理';
const FormItem = Form.Item;

const EDIT_HASH = '#/SynthesizeManage/ServicesProjectList/ServicesProjectEdit';
/**
 * 服务项目管理
 */

@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['servicesProject/remove']),
  }
))
class ServicesProjectList extends Component<any, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },

    {
      title: '项目名称',
      dataIndex: 'itemName',
    },
    {
      title: '项目简述',
      dataIndex: 'itemIntroduction',
    },
    {
      title: '合作方式',
      dataIndex: 'cooperationMode',
    },
    {
      title: '联系方式',
      dataIndex: 'contactInformation',
    },
    {
      title: '图片',
      dataIndex: 'attachInfo',
      render: (text) => {
        return renderAttatch(text);
      }
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'servicesProject/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/serviceitem/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    };
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
        />
      </Card>
    );
  }
}

class SearchForm extends Component<any>  {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '项目名称',
        content: getFieldDecorator('itemName')(<HInput />),
      },
      {
        label: '标题',
        content: getFieldDecorator('title')(<HInput />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem key={item.label} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
        </div>
      </div>
    );
  }
}

export default ServicesProjectList;