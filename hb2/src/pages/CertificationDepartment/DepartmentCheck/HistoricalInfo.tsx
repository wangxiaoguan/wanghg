import React, { Component } from 'react';
import { Card } from 'antd';
import SearchTable from '@/components/SearchTable';
import BackButton from '@/components/BackButton'
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import HistoryTypeEnum from '@/Enums/HistoryTypeEnum';
import ExamingStatusOthersEnum from '@/Enums/ExamingStatusOthersEnum';

// const EDIT_HASH = '#/DepartmentCheck/AuhorizedSignatureList/AuhorizedSignatureInfo';
/**
 * 历史信息
 */
@connect(({ loading }) => ({ loading }))
class HistoricalInfo extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '机构名称',
      dataIndex: 'orgName',
    },
    {
      title: '操作类型',
      dataIndex: '',
    },
    {
      title: '操作对象',
      dataIndex: 'type',
      render: ((text) => {
        return HistoryTypeEnum.toString(text)
      })
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      render: ((text) => {
        return ExamingStatusOthersEnum.toString(text)
      })
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateDate',
    },
    {
      title: '操作',
      render: (_, record) => {
        return <a>详情</a>;
      },
    },
  ]

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexamhistory/list/${current}/${pageSize}`
  }

  render() {
    return (
      <Card title="历史信息">
        <SearchTable
          searchCreater={this.searchCreater}
          columns={this.COLUMNS}
        />
        <div className="divAreaContainer controlsContainer">
          <BackButton />
        </div>
      </Card>
    );
  }
}

export default HistoricalInfo;