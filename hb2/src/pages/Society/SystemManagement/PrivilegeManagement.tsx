//权限管理
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card, DatePicker, Spin } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import EditButton from '@/components/EditButton';
import { connect } from 'dva';
import DeleteLink from '@/components/DeleteLink';
import { createSearchString, exportFileFromBlob } from '@/utils/SystemUtil';
const moment = require('moment');

const { MonthPicker } = DatePicker;

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const EDIT_HASH = '#/systemManagement/privilegeManagement/privilegeManagementInfo';
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['privilegeManagement/remove']),
  loadingExport: Boolean(loading.effects['privilegeManagement/downFile']),
}))
class PrivilegeManagement extends Component<any, any> {
  private COLUMNS = [
    {
      title: '核查月份',
      dataIndex: 'statisticsDate',
    },
    {
      title: '数据总量',
      dataIndex: 'receiveTotal',
    },
    {
      title: '问题数据量',
      dataIndex: 'problemCount',
    },
    {
      title: '核查错误率',
      dataIndex: '---',
      render: (_, record) => {
        const result = (record.problemCount / record.receiveTotal) * 100;
        return `${result.toFixed(2)}%`;
      },
    },
    {
      title: '操作',
      width: 380,
      render: (_, record) => {
        return (
          <span className="controlsContainer">
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            {/* <Switch unCheckedChildren="隐藏" checkedChildren="显示" checked={record.hidden === '0'} onChange={(checked) => {
              this.updateHide(record.id, !checked)
            }} /> */}
            <a onClick={this.downFile}>下载</a>
            <DeleteLink record={record} target={this} />
          </span>
        );
      },
    },
  ];

  updateHide = (id, isHidden: boolean) => {
    this.props.dispatch({
      type: 'privilegeManagement/update',
      payLoad: {
        id,
        hidden: isHidden ? '1' : '0',
      },
      callBack: () => {
        this.table.refresh();
      },
    });
  };

  private table: SearchTableClass;

  remove = id => {
    this.props.dispatch({
      type: 'privilegeManagement/remove',
      payLoad: id,
      callBack: () => {
        this.table.refresh();
      },
    });
  };

  downFile = () => {
    this.props.dispatch({
      type: 'privilegeManagement/downFile',
      callBack: res => {
        exportFileFromBlob(res,`核查数据`)
      },
    });
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/code/bulletininfo/list/${current}/${pageSize}${createSearchString(
      values,
      (params, key) => {
        if (key === 'statisticsDate') {
          return `Q=${key}_EQ=${moment(params[key]).format('YYYY-MM')}`;
        }
      }
    )}`;
  };

  render() {
    return (
      <Card title="通报管理">
        <Spin spinning={this.props.loadingExport}>
          <SearchTable
            getInstance={target => (this.table = target)}
            columns={this.COLUMNS}
            formItems={SearchForm}
            formProps={{ layout: 'horizontal' }}
            searchCreater={this.searchCreater}
            selectedAble
          />
        </Spin>
      </Card>
    );
  }
}

@connect(() => ({}))
class SearchForm extends Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '核查月份',
        content: getFieldDecorator('statisticsDate')(
          <MonthPicker placeholder="请选择月份" format="YYYY-MM" />
        ),
      },
    ];

    return (
      <div>
        <div className="divAreaContainer">
          {FORM_ITEMS.map(item => {
            return (
              <Col key={item.label} span={8}>
                <FormItem {...FormItemLayout} label={item.label}>
                  {item.content}
                </FormItem>
              </Col>
            );
          })}
          <Col span={8}>
            <FormItem wrapperCol={{ offset: 7 }}>
              <FormRefreshButton />
              <FormResetButton />
            </FormItem>
          </Col>
        </div>
        <div className="divAreaContainer controlsContainer">
          <EditButton hash={EDIT_HASH} />
        </div>
      </div>
    );
  }
}

export default PrivilegeManagement;
