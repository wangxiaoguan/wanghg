import React, { Component } from 'react';
import { Card, Form, Col, Select } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';

const TITLE = '一般预警';
const FormItem = Form.Item;
const { Option } = Select;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
/**
 * 表格页面的模板
 */
class GeneralWarning extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '标识',
      dataIndex: '',
    },
    {
      title: '标题',
      dataIndex: '',
    },
    {
      title: '发布时间',
      dataIndex: '',
    },
    {
      title: '审核状态',
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
    console.log(values);
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
        label: '发布人',
        content: getFieldDecorator('a')(<HInput />),
      },
      {
        label: '通报国',
        content: getFieldDecorator('b')(
          <HSelect>
            <Option value='1'>aa</Option>
            <Option value='2'>b</Option>
          </HSelect>
        ),
      },
      {
        label: '发布日期',
        content: getFieldDecorator('c')(<HRangePicker />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('d')(<HSCodeWindow />),
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
      </div>
    );
  }
}

export default GeneralWarning;