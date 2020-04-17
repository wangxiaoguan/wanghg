import React, { Component } from 'react';
import { Card, Form, } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';
import CountryWindow from '@/components/SelectedWindows/CountryWindow';

const TITLE = '国家及产品通报影响';
const FormItem = Form.Item;

/**
 * 表格页面的模板
 */
class CountryAndProductNotification extends Component<any, any> {
  private COLUMNS: any[] = [

    {
      title: '通报号',
      dataIndex: 'name',
    },
    {
      title: '通报标题',
      dataIndex: '',
    },
    {
      title: '产品',
      dataIndex: '',
    },
    {
      title: '产品出口额(美元)',
      dataIndex: '',
    },
    {
      title: '通报时间',
      dataIndex: '',
    },
    {
      title: '通报类型',
      dataIndex: '',
    },
  ];

  searchCreater = (values: any, pageSize: number, current: number) => {
    return '';
  }

  transData = (response: any) => {
    return {
      data: [
        // {
        //   id: 1,
        //   name: 'a'
        // }
      ],
      total: 100,
    }
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
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
        label: '国家',
        content: getFieldDecorator('title')(<CountryWindow />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('title')(<HSCodeWindow />),
      },
      {
        label: '通报号',
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
      </div >
    );
  }
}

export default CountryAndProductNotification;