import React, { Component } from 'react';
import { Card, Form, Button, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { connect } from 'dva';
import { isEmptyArray, createSearchString } from '@/utils/SystemUtil';
import { confirmDelete, htmlToText } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';

const TITLE = '知识库管理';
const FormItem = Form.Item;

/**
 * 知识库管理
 */
@connect(({ loading, repository }) => (
  {
    repository,
    loading,
    loadingDelete: Boolean(loading.effects['repository/remove']),
  }
))
class RepositoryList extends Component<IDispatchInterface, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '知识标题',
      dataIndex: 'title',
    },
    {
      title: '知识内容',
      dataIndex: 'content',
      render: (text) => {
        return htmlToText(text);
      }
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`#/SynthesizeManage/RepositoryList/RepositoryEdit/${record.id}`}>修改</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => confirmDelete(() => this.remove(record.id))}>删除</a>
            </Spin>
          </span>
        );
      }
    },
  ];

  remove(id) {
    this.props.dispatch({
      type: 'repository/remove',
      payLoad: id,
      callBack: () => {
        this.table.refresh();
      },
    });
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/knowledgebase/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    }
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
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['repository/remove']),
  }
))
class SearchForm extends Component<any>  {
  remove(id) {
    this.props.dispatch({
      type: 'repository/remove',
      payLoad: id,
      callBack: () => {
        this.props.refresh();
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '知识标题',
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
          <EditButton hash='/SynthesizeManage/RepositoryList/RepositoryEdit' />
          <Button loading={this.props.loadingDelete} type="danger" disabled={isEmptyArray(this.props.selectedRowKeys)} onClick={() => {
            confirmDelete(() => {
              this.remove(this.props.selectedRowKeys.join());
            });
          }}>批量删除</Button>
        </div>
      </div>
    );
  }
}

export default RepositoryList;