import React, { Component } from 'react';
import { Card, Form } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { filterOb } from '@/utils/utils';
import { createSearchString } from '@/utils/SystemUtil';
const TITLE = '黑名单查询';
const FormItem = Form.Item;

const EDIT_HASH = '#/DepartmentSearch/DepartmentList/DepartInfo';
/**
 * 黑名单查询
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class SearchViewTemplete extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [

    {
      title: '检测机构名称',
      dataIndex: 'orgName',
    },
    {
      title: '行政区划',
      dataIndex: 'orgDivide',
    },
    {
      title: '负责人',
      dataIndex: 'principal',
    },
    {
      title: '联络人',
      dataIndex: 'contact',
    },
    {
      title: '单位名称',
      dataIndex: 'unitName',
    },
    {
      title: '固定资产(万)',
      dataIndex: 'fixedAssets',
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateDate',
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a onClick={() => {
              this.update({ id: record.id, isBlack: '0' })
            }}>撤销黑名单 </a>
            <a href={`${EDIT_HASH}/${record.id}`}>查看</a>
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: '－－－/remove',
        payLoad: id,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  private table: SearchTableClass;

  searchCreater = (values: any, pageSize: number, current: number) => {
    const data = { ...filterOb(values), isBlack: '1' }
    return `/services/exam/fhexamorg/selectAll/${current}/${pageSize}/${createSearchString(data)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    }
  }

  update = (payLoad) => {
    this.props.dispatch(
      {
        type: 'Department/update',
        payLoad,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
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
        label: '检测机构名称',
        content: getFieldDecorator('orgName')(<HInput />),
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

export default SearchViewTemplete;