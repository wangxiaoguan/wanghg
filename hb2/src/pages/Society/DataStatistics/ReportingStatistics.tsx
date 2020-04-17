//数据上报统计
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Card } from 'antd';
import EditButton from '@/components/EditButton';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import DeleteLink from '@/components/DeleteLink';

const EDIT_HASH = '#/dataStatistics/reportingStatistics/reportingStatisticsInfo';
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['reportingStatistics/remove']),
}))
class ReportingStatistics extends Component<any, any> {
  private COLUMNS = [
    {
      title: '主编号',
      dataIndex: 'code',
    },
    {
      title: '父编号',
      dataIndex: 'parentCode',
    },
    {
      title: '问题说明',
      dataIndex: 'name',
    },
    {
      title: '校验规则',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.code}`}>修改</a>
            <DeleteLink record={{ id: record.code, ...record }} target={this} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'reportingStatistics/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log('notic');
    return `/services/code/codedic/list/${current}/${pageSize}${createSearchString({ type: 14, ...values })}`;
  }

  render() {
    return (
      <Card title='数据核查规则'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          searchCreater={this.searchCreater}
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
}))
class SearchForm extends Component<any, any> {


  render() {

    return (
      <div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
        </div>
      </div>
    );
  }
}

export default ReportingStatistics;