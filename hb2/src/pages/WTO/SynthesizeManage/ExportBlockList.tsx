import React, { Component } from 'react';
import { Card, Form, Col, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import { confirmDelete } from '@/utils/AntdUtil';
import FormRefreshButton from '@/components/FormRefreshButton';
import { createSearchString, hsCodeSearchStr } from '@/utils/SystemUtil';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';
import CountryWindow from '@/components/SelectedWindows/CountryWindow';

const TITLE = '出口遇阻信息管理';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/Order/ExportBlockList/ExportBlockEdit';
/**
 * 表格页面的模板
 */
@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['exportBlock/remove']),
  }
))
class ExportBlockList extends Component<any, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },

    {
      title: '主要出口国',
      dataIndex: 'exportCountry',
    },
    {
      title: '出口产品类别（HS码)',
      dataIndex: 'hsCode',
    },
    {
      title: '涉及具体产品',
      dataIndex: 'involvedProduct',
    }, {
      title: '操作',
      width: 150,
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
        type: 'exportBlock/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/obstruction/list/${current}/${pageSize}${createSearchString(values, (params, key) => {
      switch (key) {
        case 'exportCountry':
          return `Q=exportCountry_EQ=${params.exportCountry.map(item => item.countryName).join()}`
        case 'hsCode':
          return hsCodeSearchStr(params.hsCode);
        default:
          return '';
      }
    })}`;
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
        label: '企业名称',
        content: getFieldDecorator('companyName')(<HInput />),
      },
      {
        label: '涉及产品',
        content: getFieldDecorator('involvedProduct')(<HInput />),
      },
      {
        label: '主要出口国',
        content: getFieldDecorator('exportCountry')(<CountryWindow />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode')(<HSCodeWindow />),
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

export default ExportBlockList;