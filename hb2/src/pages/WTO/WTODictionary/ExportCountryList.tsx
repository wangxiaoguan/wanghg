import React, { Component } from 'react';
import { Card, Form, Button } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import { confirmDelete } from '@/utils/AntdUtil';

const TITLE = '我省出口国家';
const FormItem = Form.Item;

const EDIT_HASH = '#/wtoDictionary/ExportCountryList/ExportCountryEdit';
/**
 * 我省出口国家
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['ExportCountry/remove']),
}))
class ExportCountryList extends Component<IDispatchInterface, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '所属国家',
      dataIndex: 'countryName',
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
        type: 'ExportCountry/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `services/wto/wtoprovinceexportcountry/list/${current}/${pageSize}/${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['ExportCountry/remove']),
}))
class SearchForm extends Component<any>  {
  remove = (id) => {
    this.props.dispatch(
      {
        type: 'ExportCountry/remove',
        payLoad: id,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '所属国家',
        content: getFieldDecorator('countryName')(<HInput />),
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
          <Button loading={this.props.loadingDelete} type="danger" disabled={isEmptyArray(this.props.selectedRows)} onClick={() => {
            confirmDelete(() => {
              this.remove(this.props.selectedRowKeys);
            })
          }}>批量删除</Button>
        </div>
      </div>
    );
  }
}

export default ExportCountryList;