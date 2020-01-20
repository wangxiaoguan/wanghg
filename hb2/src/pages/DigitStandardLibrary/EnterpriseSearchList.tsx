import { Button, Card, Form } from 'antd';
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormRefreshButton from '@/components/FormRefreshButton';
import FormResetButton from '@/components/FormResetButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HSelect from '@/components/Antd/HSelect';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import { createSelectOptions } from '@/utils/AntdUtil';
import { createSearchString, exportFileFromBlob } from '@/utils/SystemUtil';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HandleStatusEnum from './HandleStatusEnum';
import { DOWNLOAD_API } from '@/services/api';

const FormItem = Form.Item;

const EDIT_HASH = '#/DigitStandardLibrary/EnterpriseEdit';
const Detail_HASH = '#/DigitStandardLibrary/EnterpriseDetail';

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['consumerProduct/remove']),
}))
class EnterpriseSearchList extends Component<IDispatchInterface, any> {

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
      title: '审核状态',
      dataIndex: 'checkStatus',
      render: (_, record) => {
        return HandleStatusEnum.toString(record.checkStatus);
      },
    },
    {
      title: '操作',
      dataIndex: '',
      width: 250,
      render: (_, record) => {
        return (
          <span className="controlsContainer">
            {record.checkStatus === '1' && record.reportUploadInfo ? (
              <a onClick={() => {this.downloadReport(record);}}>下载报告</a>
            ) : (
              <span>下载报告</span>
            )}
            <a href={`${Detail_HASH}/${record.id}`}>查看详情</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      },
    },
  ];

  private table: SearchTableClass;

  remove = id => {
    this.props.dispatch({
      type: 'searchNew/removeApply',
      payLoad: id,
      callBack: () => {
        this.table.refresh();
      }
    });
  };

  downloadReport = record => {
    if(record){
      if(record.reportUploadInfo){
        let fileList = JSON.parse(record.reportUploadInfo);
        if(fileList.length){
          fileList.forEach(item => {
            window.location.href = DOWNLOAD_API(item.id);
            // this.props.dispatch({
            //   type: 'searchNew/download',
            //   payLoad: item.id,
            //   callBack: res => {
            //     exportFileFromBlob(res, item.name)
            //   },
            // })
          });
        }
      }
    }
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/standard/fhstdnoveltysearch/list/${current}/${pageSize}${createSearchString(
      { ...values, deleteStatus: 1 }
    )}`;
  };

  render() {
    return (
      <div>
        <Card title="标准查新-外网企业">
          <SearchTable
            getInstance={target => (this.table = target)}
            //selectedAble
            columns={this.TABLE_COLUMNS}
            formItems={EnterpriseSearchForm}
            searchCreater={this.searchCreater}
            pageSize={10}
          />
        </Card>
      </div>
    );
  }
}

@connect(({ loading }) => ({}))
class EnterpriseSearchForm extends Component<any, any> {
  add() {
    window.location.hash = EDIT_HASH;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card>
        <div className="divAreaContainer">
          <FormItem label="提交时间">{getFieldDecorator('createDate')(<HRangePicker />)}</FormItem>
          <FormItem label="审核状态">
            {getFieldDecorator('checkStatus')(
              <HSelect>
                {createSelectOptions(HandleStatusEnum.ALL_LIST, HandleStatusEnum.toString)}
              </HSelect>
            )}
          </FormItem>
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className="divAreaContainer controlsContainer">
          <Button type="primary" onClick={() => this.add()}>
            新增
          </Button>
        </div>
      </Card>
    );
  }
}

export default EnterpriseSearchList;
