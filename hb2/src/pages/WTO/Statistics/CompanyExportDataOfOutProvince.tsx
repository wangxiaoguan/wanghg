import React, { Component } from 'react';
import { Card, Form, Button, Col } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';
import CountryWindow from '@/components/SelectedWindows/CountryWindow';

const TITLE = '我省出口企业数据管理';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
/**
 * 表格页面的模板
 */
class CompanyExportDataOfOutProvince extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '产品代码',
      dataIndex: 'name',
    },
    {
      title: 'HS码',
      dataIndex: '',
    },
    {
      title: '产品名称',
      dataIndex: '',
    },
    {
      title: '公司名称',
      dataIndex: '',
    },
    {
      title: '公司代码',
      dataIndex: '',
    },
    {
      title: '出口额（美元）',
      dataIndex: '',
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
          formProps={{ layout: 'horizontal' }}
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
        label: '行政区划',
        content: getFieldDecorator('title')(<CountryWindow />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('title')(<HSCodeWindow />),
      },
      {
        label: '公司名称',
        content: getFieldDecorator('title')(<HInput />),
      },
      {
        label: '公司代码',
        content: getFieldDecorator('title')(<HInput />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <Col key={item.label} span={8}>
                  <FormItem  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
                </Col>
              );
            })
          }
          <Col span={8}>
            <FormItem wrapperCol={{ offset: 7 }}>
              <FormRefreshButton />
              <FormResetButton />
            </FormItem>
          </Col>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <Button type="primary">导入</Button>
          <a>下载导入模板</a>
        </div>
      </div>
    );
  }
}

export default CompanyExportDataOfOutProvince;