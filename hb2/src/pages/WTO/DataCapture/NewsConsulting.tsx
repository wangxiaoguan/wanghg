import React, { Component } from 'react';
import { Card, Form } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';

const TITLE = '新闻咨询';
const FormItem = Form.Item;

/**
 * 表格页面的模板
 */
class NewsConsulting extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '新闻编号',
      dataIndex: 'name',
    },
    {
      title: '标题',
      dataIndex: '',
    },
    {
      title: '作者',
      dataIndex: '',
    },
    {
      title: '发布时间',
      dataIndex: '',
    },
    {
      title: '点击率',
      dataIndex: '',
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a>修改</a>
            <a>删除</a>
            <a>审核</a>
          </span>
        );
      }
    },
  ];

  searchCreater = (values: any, pageSize: number, current: number) => {
    return '';
  }

  transData = (response: any) => {
    return {
      data: [
        {
          id: 1,
          name: 'a'
        }
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
        label: '标题',
        content: getFieldDecorator('title')(<HInput />),
      },
      {
        label: '来源',
        content: getFieldDecorator('title')(<HInput />),
      },
      {
        label: '发布日期',
        content: getFieldDecorator('title')(<HRangePicker />),
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

export default NewsConsulting;