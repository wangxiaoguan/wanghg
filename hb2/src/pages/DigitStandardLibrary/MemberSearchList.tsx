import { Button, Card, Form } from 'antd';
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormRefreshButton from '@/components/FormRefreshButton';
import FormResetButton from '@/components/FormResetButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import handleSearchNewStatus from '@/Enums/handleSearchNewStatus';
import handleCheckStatus from '@/Enums/handleCheckStatus';
import HandleCompareTime from '@/Enums/HandleCompareTime';
import HSelect from '@/components/Antd/HSelect';
import HInput from '@/components/Antd/HInput';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { createSelectOptions } from '@/utils/AntdUtil';
import { createSearchString, exportFileFromBlob } from '@/utils/SystemUtil';
import { createSearchUrl } from './createSearchUrl';
const FormItem = Form.Item;
const EDIT_HASH = '#/DigitStandardLibrary/MemberDetail';

@connect(({ loading }) => ({ loadingDelete: Boolean(loading.effects['searchNew/remove']) }))
class MemberSearchList extends Component<IDispatchInterface, any> {
  private TABLE_COLUMNS = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '受理号',
      dataIndex: 'acceptanceNo',
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
    },
    {
      title: '标准名称',
      dataIndex: 'standardName',
    },
    {
      title: '提交时间',
      dataIndex: 'createDate',
    },
    {
      title: '受理时间',
      dataIndex: 'acceptanceTime',
    },
    {
      title: '完成时间',
      dataIndex: 'completeTime',
    },
    {
      title: '处理时长/天',
      dataIndex: 'dealTime',
    },
    {
      title: '企业下载报告时间',
      dataIndex: 'reportDownloadTime',
    },
    {
      title: '查新申请来源',
      dataIndex: 'noveltySearchSource',
      render: (_, record) => {
        if (record.noveltySearchSource === '1') {
          return <div>外部</div>;
        } else if (record.noveltySearchSource === '0') {
          return <div>内部</div>;
        }
      },
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      render: (_, record) => {
        return handleSearchNewStatus.toString(record.checkStatus);
      },
    },
    {
      title: '操作',
      dataIndex: '',
      width: 100,
      render: (_, record) => {
        return (
          <span className="controlsContainer">
            <a href={`${EDIT_HASH}/${record.id}`}>查看</a>
          </span>
        );
      },
    },
  ];

  private table: SearchTableClass;

  remove = id => {
    // this.props.dispatch({
    //   type: 'consumerProduct/remove',
    //   payLoad: id,
    //   callBack: () => {
    //     this.table.refresh();
    //   }
    // });
  };

  searchCreater = (values: any, pageSize: number, current: number) => {
    if (values.comparator) {
      values.dealTime = values.comparator;
      delete values.comparator;
    }
    return `/services/standard/fhstdnoveltysearch/list/${current}/${pageSize}${createSearchUrl({...values, deleteStatus: 1,})}`;
  };

  render() {
    return (
      <Card title="标准查新-查新员">
        <SearchTable
          getInstance={target => (this.table = target)}
          //selectedAble
          columns={this.TABLE_COLUMNS}
          formItems={MemberSearchForm}
          searchCreater={this.searchCreater}
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({}))
class MemberSearchForm extends Component<any, any> {
  exportExcel(key) {
    const filedValues: any = this.props.form.getFieldsValue();

    if (filedValues.createDate && filedValues.createDate.length >= 2) {
      filedValues.submitBeginTime = filedValues.createDate[0].format('YYYY-MM-DD HH:mm:ss');
      filedValues.submitEndTime = filedValues.createDate[1].format('YYYY-MM-DD HH:mm:ss');
      delete filedValues.createDate;
    }

    if (filedValues.acceptanceTime && filedValues.acceptanceTime.length >= 2) {
      filedValues.acceptBeginTime = filedValues.acceptanceTime[0].format('YYYY-MM-DD HH:mm:ss');
      filedValues.acceptEndTime = filedValues.acceptanceTime[1].format('YYYY-MM-DD HH:mm:ss');
      delete filedValues.acceptanceTime;
    }

    if (filedValues.comparator === 'G' || filedValues.comparator === 'L') {
      filedValues.compareTime = '5';
    }
    
    let type = null;
    let fileName = null;
    if (key === 'download') {
      type = 'searchNew/downExportExcel';
      fileName = '下载时间报表';
    } else {
      type = 'searchNew/handleExportExcel';
      fileName = '处理时间报表';
    }
    this.props.dispatch({
      type,
      payLoad: filedValues,
      callBack: res => {
        exportFileFromBlob(res, `${fileName}.xls`);
      },
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className="divAreaContainer">
          <FormItem label="企业名称">{getFieldDecorator('enterpriseName')(<HInput />)}</FormItem>
          <FormItem label="标准名称">{getFieldDecorator('standardName')(<HInput />)}</FormItem>
          <FormItem label="提交时间">{getFieldDecorator('createDate')(<HRangePicker />)}</FormItem>
          <FormItem label="受理时间">
            {getFieldDecorator('acceptanceTime')(<HRangePicker />)}
          </FormItem>
          <FormItem label="处理时间">
            {getFieldDecorator('comparator')(
              <HSelect>
                {createSelectOptions(HandleCompareTime.ALL_LIST, HandleCompareTime.toString)}
              </HSelect>
            )}
          </FormItem>
          <FormItem label="查看申请来源">
            {getFieldDecorator('noveltySearchSource')(
              <HSelect>
                {createSelectOptions(handleCheckStatus.ALL_LIST, handleCheckStatus.toString)}
              </HSelect>
            )}
          </FormItem>
          <FormItem label="审核状态">
            {getFieldDecorator('checkStatus')(
              <HSelect>
                {createSelectOptions(
                  handleSearchNewStatus.ALL_LIST,
                  handleSearchNewStatus.toString
                )}
              </HSelect>
            )}
          </FormItem>
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className="divAreaContainer controlsContainer">
          <Button type="primary" onClick={() => this.exportExcel('download')}>
            下载时间报表导出
          </Button>
          <Button type="primary" onClick={() => this.exportExcel('handle')}>
            处理时间报表导出
          </Button>
        </div>
      </div>
    );
  }
}

export default MemberSearchList;
