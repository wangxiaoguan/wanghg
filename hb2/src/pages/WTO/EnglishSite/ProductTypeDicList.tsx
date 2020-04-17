import React, { Component } from 'react';
import { Card, Form, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import { createSearchString } from '@/utils/SystemUtil';
import EditButton from '@/components/EditButton';
import { connect } from 'dva';
import { confirmDelete } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';

const TITLE = 'ProductTypeDic';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/EnglishSite/ProductTypeDicList/ProductTypeDicEdit';

/**
 * 
 */
@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['productTypeDic/remove']),
  }
))
class ProductTypeDicList extends Component<any, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '类别名称',
      dataIndex: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
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
        type: 'productTypeDic/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtoproducttypedic/list/${current}/${pageSize}${createSearchString(values)}`;
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
        label: '类别名称',
        content: getFieldDecorator('name')(<HInput />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem key={item.label}  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
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

export default ProductTypeDicList;