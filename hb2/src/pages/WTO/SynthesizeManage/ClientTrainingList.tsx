import React, { Component } from 'react';
import { Card, Form, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import { createSearchString } from '@/utils/SystemUtil';
import { confirmDelete } from '@/utils/AntdUtil';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';

const TITLE = '客户提交培训需求';
const FormItem = Form.Item;
 
const EDIT_HASH = `#/Order/ClientTrainingList/ClientTrainingEdit`;
/**
 * 表格页面的模板
 */
@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['clientTraining/remove']),
  }
))
class ClientTrainingList extends Component<any, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '需求标题',
      dataIndex: 'requireTitle',
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
    },
    {
      title: '电话',
      dataIndex: 'contactPhone',
    },
    {
      title: '申报时间',
      dataIndex: 'applyTime',
    },
    {
      title: '操作',
      width: 130,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}/1`}>查看</a>
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
        type: 'clientTraining/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/trainrequirement/list/${current}/${pageSize}${createSearchString(values)}`;
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
        label: '需求标题',
        content: getFieldDecorator('requireTitle')(<HInput />),
      },
      {
        label: '申报时间',
        content: getFieldDecorator('applyTime')(<HRangePicker />),
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
      </div>
    );
  }
}

export default ClientTrainingList;