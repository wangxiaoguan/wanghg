import React, { Component } from 'react';
import { Card, Form } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import HSCodeWindow from '@/components/SelectedWindows/HSCodeWindow';
import ICSCodeWindow from '@/components/SelectedWindows/ICSCodeWindow';
import { isEmptyArray } from '@/utils/SystemUtil';

const TITLE = 'ICS-HS码关联管理';
const FormItem = Form.Item;

const EDIT_HASH = '#/wtoDictionary/HSAndISCRelationList/HSAndISCRelationEdit';
/**
 * ICS-HS码关联管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['HSAndISCRelation/remove']),
}))
class HSAndISCRelationList extends Component<IDispatchInterface, any> {
  private table: SearchTableClass;
  private COLUMNS: any[] = [
    {
      title: 'ICS编码',
      dataIndex: 'icsCode',
    },
    {
      title: 'ICS名称',
      dataIndex: 'icsName',
    },
    {
      title: 'HS编码',
      dataIndex: 'hsCode',
    },
    {
      title: 'HS名称',
      dataIndex: 'hsName',
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/detail/${record.id}/true`}>查看</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'HSAndISCRelation/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


  searchCreater = (values: any, pageSize: number, current: number) => {
    const hsCode = isEmptyArray(values.hsCode) ? '~' : values.hsCode.map((item) => item.hsCode).join();
    const icsCode = isEmptyArray(values.icsCode) ? '~' : values.icsCode.map((item) => item.icsCode).join();
    return `services/wto/wtohsics/list/${current}/${pageSize}/${hsCode}/${icsCode}`;
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
        label: 'HS码',
        content: getFieldDecorator('hsCode')(<HSCodeWindow />),
      },
      {
        label: 'ICS码',
        content: getFieldDecorator('icsCode')(<ICSCodeWindow />),
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
          <EditButton hash={`${EDIT_HASH}/add`} />
        </div>
      </div>
    );
  }
}

export default HSAndISCRelationList;