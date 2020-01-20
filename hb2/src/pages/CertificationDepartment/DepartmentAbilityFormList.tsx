import React, { Component } from 'react';
import { Card, Form, Table, Checkbox } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { splitTimes, filterOb } from '@/utils/utils';
import CertificateValidityEnum from '@/Enums/CertificateValidityEnum';
import CertificateStatusEnum from '@/Enums/CertificateStatusEnum';


const TITLE = '检测机构能力表';
const FormItem = Form.Item;

const INFO_HASH = '#/DepartmentAbilityFormList/DepartmentAbilityFormListDetail';

const BATCH_INPUT_HASH = '#/DepartmentAbilityFormList/BatchInput'
const EXTENSION_HASH = '#/DepartmentAbilityFormList/DepartmentAbilityFormExtension'
const Maintance_Hash = '#/DepartmentAbilityFormList/MaintancePower'
/**
 * 检测机构能力查询
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class DepartmentAbilityFormList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      dataIndex: 'orgName',
      render: (text) => {
        return <div style={{ fontWeight: 'bold', fontSize: 18 }}>检测机构名称：{text}</div>;
      }
    },
  ];

  private expandedRowRender(record, index, indent, expanded) {
    const expandedColumns = [
      {
        title: '证书编号',
        dataIndex: 'certificateNumber',
      },
      {
        title: '证书名称',
        dataIndex: 'certificateName',
      },
      {
        title: '证书类型',
        dataIndex: 'certificateClass',
      },
      {
        title: '产品数量',
        dataIndex: 'productCount',
      },
      {
        title: '参数数量',
        dataIndex: 'parameterCount',
      },
      {
        title: '证书状态',
        dataIndex: 'certificateStatus',
        render: (text, record) => {
          return CertificateStatusEnum.toString(record.certificateStatus);
        }
      },
      {
        title: '是否到期',
        dataIndex: 'isPastDue',
        render: (text, record: any) => {
          return CertificateValidityEnum.toString(record.isPastDue);
        }
      },
      {
        title: '有效截止时间',
        dataIndex: 'endTimes',
      },
      {
        title: '操作',
        dataIndex: '',
        render: (_, record) => {
          return (
            <div className="controlsContainer">
              <a href={`${EXTENSION_HASH}/${record.id}`}>录入</a>
              <a href={`${BATCH_INPUT_HASH}/${record.id}`}>批量导入</a>
              <a href={`${Maintance_Hash}/${record.id}`}>维护能力表</a>
              <a href={`${INFO_HASH}/${record.id}`}>查看能力表</a>
            </div>
          )
        }
      }
    ];

    return <Table rowKey="id" dataSource={record.certificates} columns={expandedColumns} />;
  }
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

  constructor(props) {
    super(props);
    this.state = {
      tableExpandKeys: [],
    };
  }

  //post
  searchCreater = (values: any, pageSize: number, current: number) => {
    let possessCertificate = false
    const { issueTimes, endTimes, ...others } = values
    if (issueTimes || endTimes) {
      possessCertificate = true
    }
    const issues = splitTimes(issueTimes, 'issueTimeBegin', 'issueTimeEnd')
    const ends = splitTimes(endTimes, 'endTimesBegin', 'endTimesEnd')
    const data = filterOb({
      ...others, ...issues, ...ends,
      possessCertificate,
      page: current,
      pageSize,
    })
    return {
      method: 'post',
      url: `/services/exam/fhexamorg/showAll/`,
      data
    }
  }

  transData = (response: any) => {
    const data = response.data.data
    const tableExpandKeys = data.map((item) => item.id);
    for (let key of tableExpandKeys) {
      if (this.state.tableExpandKeys.indexOf(key) < 0) {
        this.state.tableExpandKeys.push(key);
      }
    }
    this.forceUpdate();
    return {
      data,
      total: response.data.length,
    }
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          formProps={{ layout: 'inline' }}
          transData={this.transData}
          tableProps={{
            expandedRowRender: this.expandedRowRender,
            expandedRowKeys: this.state.tableExpandKeys,
            onExpand: (expanded, record) => {
              let index = this.state.tableExpandKeys.indexOf(record.id);
              if (expanded) {
                if (index < 0) {
                  this.state.tableExpandKeys.push(record.id);
                }
              }
              else {
                if (index >= 0) {
                  this.state.tableExpandKeys.splice(index, 1);
                }
              }
              this.forceUpdate();
            }
          }}
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
        span: 8
      },
      {
        label: '显示过期证书',
        content: getFieldDecorator('disabled')(<Checkbox defaultChecked />),
        span: 4
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return <FormItem key={item.label} label={item.label}>{item.content}</FormItem>
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        {/* <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
        </div> */}
      </div>
    );
  }
}

export default DepartmentAbilityFormList;