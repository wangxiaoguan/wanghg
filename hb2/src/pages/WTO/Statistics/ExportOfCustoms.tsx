import React, { Component } from 'react';
import { Card, Form, Button } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import HInput from '@/components/Antd/HInput';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';

const TITLE = '海关出口数据';
const FormItem = Form.Item;
/**
 * 表格页面的模板
 */
class ExportOfCustoms extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      title: 'HS码',
      dataIndex: '',
    },
    {
      title: '出口企业数量',
      dataIndex: '',
    },
    {
      title: '出口总额',
      dataIndex: '',
    },
    {
      title: '年份',
      dataIndex: '',
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a>编辑</a>
            <a>删除</a>
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
        label: '产品名称',
        content: getFieldDecorator('title')(<HInput />),
      },
      {
        label: '所属年份',
        content: getFieldDecorator('title')(<HSelect />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('title')(<HSCodeWindow />),
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
          <Button type="primary">新增</Button>
          <Button type="primary">导入</Button>
          <a>下载导入模板</a>
        </div>
      </div>
    );
  }
}

export default ExportOfCustoms;