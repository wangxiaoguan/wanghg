import React, { Component } from 'react';
import { Card, Form, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import EditButton from '@/components/EditButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import { confirmDelete, renderAttatch } from '@/utils/AntdUtil';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import HInput from '@/components/Antd/HInput';

const TITLE = '期刊管理';
const FormItem = Form.Item;
const EDIT_HASH = '/SynthesizeManage/PeriodicalList/PeriodicalEdit/';
/**
 * 表格页面的模板
 */
@connect(({ loading, periodical }) => (
  {
    periodical,
    loading,
    loadingDelete: Boolean(loading.effects['periodical/remove']),
  }
))
class PeriodicalList extends Component<any, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '期刊标题',
      dataIndex: 'journalTitle'
    },
    {
      title: '期刊号',
      dataIndex: 'journalNo'
    },
    {
      title: '期刊封面',
      dataIndex: 'journalCover',
      render: (text) => {
        return renderAttatch(text);
      }
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime'
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`#${EDIT_HASH}${record.id}`}>修改</a>
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
      type: 'periodical/remove',
      payLoad: id,
      callBack: () => {
        this.table.refresh();
      },
    });
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/journalmanage/list/${current}/${pageSize}${createSearchString(values)}`;
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
        label: '期刊标题',
        content: getFieldDecorator('journalTitle')(<HInput />),
      },
      {
        label: '期刊号',
        content: getFieldDecorator('journalNo')(<HInput />),
      },
      {
        label: '发布时间',
        content: getFieldDecorator('publishTime')(<HRangePicker />),
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

export default PeriodicalList;