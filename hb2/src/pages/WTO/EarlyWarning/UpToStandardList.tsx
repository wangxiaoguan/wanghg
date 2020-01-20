import React, { Component } from 'react';
import { Card, Form } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { createSearchString } from '@/utils/SystemUtil';
import { connect } from 'dva';
import DeleteLink from '@/components/DeleteLink';
import EditButton from '@/components/EditButton';

const TITLE = '合格评定程序管理';
const FormItem = Form.Item;

const EDIT_HASH = '#/earlyWarning/upToStandard/UpToStandardEdit';
/**
 * 合格评定程序管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['UpToStandard/remove']),
}))
class UpToStandardList extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '认证名称',
      dataIndex: 'auName',
    },

    {
      title: '认证简介',
      dataIndex: 'auBriefIntroduction',
    },
    {
      title: '国家',
      dataIndex: 'countryName',
    },
    {
      title: '认证机构',
      dataIndex: 'auOrg',
    },
    {
      title: '认证性质',
      dataIndex: 'auNature',
    },
    {
      title: '录入时间',
      dataIndex: 'noteDate',
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            <DeleteLink record={record} target={this} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'UpToStandard/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/authentication/list/${current}/${pageSize}${createSearchString(values)}`;
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
        label: '认证名称',
        content: getFieldDecorator('auName')(<HInput />),
      },
      {
        label: '认证产品范围',
        content: getFieldDecorator('auProductArea')(<HInput />),
      },
      {
        label: '完整国家名称',
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
        </div>
      </div>
    );
  }
}

export default UpToStandardList;