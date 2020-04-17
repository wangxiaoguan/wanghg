import React, { Component } from 'react';
import { Card, Form, Col } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';

const TITLE = '－－－';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '－－－';
/**
 * －－－
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class SearchViewTemplete extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '－－－',
      dataIndex: 'name',
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>查看</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: '－－－/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


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
        label: '－－－',
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
          <EditButton hash={EDIT_HASH} />
        </div>
      </div>
    );
  }
}

export default SearchViewTemplete;