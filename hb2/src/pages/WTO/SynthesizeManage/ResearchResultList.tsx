import React, { Component } from 'react';
import { Card, Form, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import EditButton from '@/components/EditButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import { createSearchString } from '@/utils/SystemUtil';
import { connect } from 'dva';
import { confirmDelete } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';

const TITLE = '研究成果管理';
const FormItem = Form.Item;

/**
 * 表格页面的模板
 */
@connect(({ loading, researchResult }) => (
  {
    researchResult,
    loading,
    loadingDelete: Boolean(loading.effects['researchResult/remove']),
  }
))
class ResearchResultList extends Component<any, any> {
  private table: SearchTableClass;
  private COLUMNS: any[] = [
    {
      title: '标题',
      dataIndex: 'researchTitle',
    },
    {
      title: '成果简介',
      dataIndex: 'briefIntroduction',
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`#/SynthesizeManage/ResearchResultList/ResearchResultEdit/${record.id}`}>修改</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>
          </span >
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'researchResult/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/researchresult/list/${current}/${pageSize}${createSearchString(values, null)}`;
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
        label: '关键字',
        content: getFieldDecorator('researchTitle')(<HInput />),
      },
      {
        label: '立项时间',
        content: getFieldDecorator('beginTime')(<HRangePicker />),
      },
      {
        label: '结项时间',
        content: getFieldDecorator('endTime')(<HRangePicker />),
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
          <EditButton hash='/SynthesizeManage/ResearchResultList/ResearchResultEdit' />
        </div>
      </div>
    );
  }
}

export default ResearchResultList;