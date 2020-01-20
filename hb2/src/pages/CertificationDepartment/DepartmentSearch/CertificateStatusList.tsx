import React, { Component } from 'react';
import { Card, Form, Col, Radio } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
// import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import RadioGroup from 'antd/lib/radio/group';
import CertificateValidityEnum from '@/Enums/CertificateValidityEnum';
import CertificateStatusEnum from '@/Enums/CertificateStatusEnum';
import RegonEnum from '@/Enums/RegonEnum'
import ZsztEnum from '@/Enums/ZsztEnum';
import { Regon } from '@/Enums/JsonEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import { createSearchString } from '@/utils/SystemUtil';

const TITLE = '证书状态查询';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/DepartmentSearch/CertificateStatusList/CertificateInfo';
/**
 * CertificateStatusList
 */
@connect(({ loading }) => ({
  // loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class CertificateStatusList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '证书编号',
      dataIndex: 'certificateNumber',
    },
    {
      title: '证书名称',
      dataIndex: 'certificateName',
    },
    {
      title: '所属检测机构',
      dataIndex: 'orgName',
    },
    {
      title: '证书类型',
      dataIndex: 'certificateClass',
    },
    {
      title: '证书状态',
      // dataIndex: 'certificateStatus',
      render: (text, record) => {
        return ZsztEnum.toString(record.certificateStatus);
      }
    },
    {
      title: '是否到期',
      // dataIndex: 'isPastDue',
      render: (text, record) => {
        return CertificateValidityEnum.toString(record.isPastDue);
      }
    },
    {
      title: '有效时间',
      dataIndex: 'endTimes',
    },
    {
      title: '颁发时间',
      dataIndex: 'issueTime',
    }, {
      title: '操作',
      width: 100,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>详情</a>
          </span>
        );
      }
    },
  ];

  // remove = (id) => {
  //   this.props.dispatch(
  //     {
  //       type: '－－－/remove',
  //       payLoad: id,
  //       callBack: () => {
  //         this.props.refresh();
  //       }
  //     }
  //   );
  // }

  searchCreater = (values: any, pageSize: number, current: number) => {
    const { isPastDue = 3, ...others } = values
    return `/services/exam/fhexamcertificate/list/${current}/${pageSize}/${isPastDue}${createSearchString(others)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
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
          transData={this.transData}
          formProps={{ layout: 'horizontal' }}
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
        label: '证书状态',
        content: getFieldDecorator('certificateStatus')
          (
            <HSelect>
              {
                createSelectOptions(ZsztEnum.ALL_LIST, ZsztEnum.toString)
              }
            </HSelect>
          ),
      },
      {
        label: '是否到期',
        content: getFieldDecorator('isPastDue')(<RadioGroup>
          {
            CertificateValidityEnum.ALL_STATUS.map((item) => {
              return <Radio key={item} value={item}>{CertificateValidityEnum.toString(item)}</Radio>
            })
          }
        </RadioGroup>),
      },
      {
        label: '有效起止时间',
        content: getFieldDecorator('endTimes')(<HRangePicker />),
      },
      {
        label: '颁发起止时间',
        content: getFieldDecorator('issueTime')(<HRangePicker />),
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
        label: '所属检测机构',
        content: getFieldDecorator('orgName')(<HInput />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <Col key={item.label} span={12}>
                  <FormItem  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
                </Col>
              );
            })
          }
          <Col span={12}>
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

export default CertificateStatusList;