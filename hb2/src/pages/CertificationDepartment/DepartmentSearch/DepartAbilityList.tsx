import React, { Component } from 'react';
import { Card, Form, Col, Table, Checkbox } from 'antd';
import HRangePicker from '@/components/Antd/HRangePicker';
import HDatePicker from '@/components/Antd/HDatePicker';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HSelect from '@/components/Antd/HSelect';
import { splitTimes, filterOb } from '@/utils/utils';
import { Regon, Industry } from '@/Enums/JsonEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import CertificateValidityEnum from '@/Enums/CertificateValidityEnum';
import CertificateStatusEnum from '@/Enums/CertificateStatusEnum';
import RegonEnum from '@/Enums/RegonEnum';


const TITLE = '检测机构能力查询';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const INFO_HASH = '#/DepartmentAbilityFormList/DepartmentAbilityFormListDetail';
/**
 * 检测机构能力查询
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class DepartAbilityList extends Component<IDispatchInterface, any> {
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
        render: (text, record) => {
          return CertificateStatusEnum.toString(record.certificateStatus);
        }
      },
      {
        title: '是否到期',
        render: (text, record) => {
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
          return <a href={`${INFO_HASH}/${record.id}`}>查看能力表</a>;
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
    let possessCertificate = false;
    console.log('values', values);
    const { endTimesEnd, endTimesBegin, ...others } = values
    if (endTimesEnd || endTimesBegin) {
      possessCertificate = true
    }


    const data = filterOb({
      ...others, endTimesEnd, endTimesBegin,
      possessCertificate,
      page: current,
      pageSize,
    })

    data.disabled = data.disabled ? true : false;

    console.log('data', data);

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
          formProps={{ layout: 'horizontal' }}
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
      },
      {
        label: '所属行政区划',
        content: getFieldDecorator('orgDivide')(
          <HSelect>
            {
              createSelectOptions(RegonEnum.ALL_LIST, RegonEnum.toString)
            }
          </HSelect>
        ),
      },
      {
        label: '检测产品',
        content: getFieldDecorator('preName')(<HInput />),
      },
      {
        label: '检测参数',
        content: getFieldDecorator('parName')(<HInput />),
      },
      {
        label: '检测标准名称',
        content: getFieldDecorator('standardName')(<HInput />),
      },
      {
        label: '检测标准编号',
        content: getFieldDecorator('standardNum')(<HInput />),
      },
      {
        label: '证书起始时间',
        content: getFieldDecorator('endTimesBegin')(<HDatePicker />),
      },
      {
        label: '证书截止时间',
        content: getFieldDecorator('endTimesEnd')(<HDatePicker />),
      },
      {
        label: '显示过期证书',
        content: getFieldDecorator('disabled')(<Checkbox />),
      },
      {
        label: '所属行业',
        content: getFieldDecorator('industry')
          (<HInput />),
        // (
        //   <HSelect>
        //     {
        //       createSelectOptions(Industry)
        //     }
        //   </HSelect>
        // ),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <Col key={item.label} span={8}>
                  <FormItem  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
                </Col>
              );
            })
          }
          <Col span={8}>
            <FormItem wrapperCol={{ offset: 7 }}>
              <FormRefreshButton />
              <FormResetButton />
            </FormItem>
          </Col>
        </div>
        {/* <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
        </div> */}
      </div>
    );
  }
}

export default DepartAbilityList;