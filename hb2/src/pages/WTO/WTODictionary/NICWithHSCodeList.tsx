import React, { Component } from 'react';
import { Card, Form } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import { createSearchString } from '@/utils/SystemUtil';

const TITLE = 'HS码管理';
const FormItem = Form.Item;

const EDIT_HASH = '#/wtoDictionary/NICWithHSCodeList/NICWithHSCodeEdit';
/**
 * HS码管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['NICWithHSCode/remove']),
}))
class NICWithHSCodeList extends Component<IDispatchInterface, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: 'NIC编码',
      dataIndex: 'industryCode',
    },
    {
      title: 'NIC名称',
      dataIndex: 'industryName',
    },
    {
      title: 'NIC相关HS码',
      dataIndex: 'hsCode',
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'NICWithHSCode/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


  searchCreater = (values: any, pageSize: number, current: number) => {
    return `services/wto/industryhs/list/${current}/${pageSize}/${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
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
        label: 'NIC编码',
        content: getFieldDecorator('industryCode')(<HInput />),
      },
      {
        label: 'NIC名称',
        content: getFieldDecorator('industryName')(<HInput />),
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
          <EditButton hash={EDIT_HASH} />
        </div>
      </div>
    );
  }
}

export default NICWithHSCodeList;