import React, { Component } from 'react';
import { Card, Form, Col } from 'antd';
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
import { Regon, CheckLevel, Industry } from '@/Enums/JsonEnum';
import DepartStatusEnum from '@/Enums/DepartStatusEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import HbCitysCerEnum from '@/Enums/HbCitysCerEnum'
const TITLE = '检测机构综合查询';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const INFO_HASH = '#/DepartmentSearch/DepartmentList/DepartInfo';
/**
 * 检测机构综合查询
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class DepartmentList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '检测机构名称',
      dataIndex: 'orgName',
    },
    {
      title: '行政区划',
      dataIndex: 'divideName',
    },
    {
      title: '授权签字人',
      dataIndex: 'signatioyName',
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
    },
    {
      title: '固定资产(万)',
      dataIndex: 'fixedAssets',
    },
    {
      title: '级别',
      dataIndex: 'rank',
    },
    {
      title: '检测机构状态',
      dataIndex: 'status',
      render: (text, record) => {
        return DepartStatusEnum.toString(record.status);
      }
    },
    {
      title: '更新时间',
      dataIndex: 'endTime',
    }, {
      title: '操作',
      width: 100,
      render: (_, record) => {
        return (
          <a href={`${INFO_HASH}/${record.id}`}>详情</a>
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
      url: `/services/exam/fhexamorg/listAll/`,
      data
    }
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          pageSize={15}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
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
        label: '检测机构名称',
        content: getFieldDecorator('orgName')(<HInput />),
      },
      {
        label: '所属行政区划', 
        content: getFieldDecorator('orgCode')(
          <HSelect>
            {
              createSelectOptions(HbCitysCerEnum.ALL_LIST, HbCitysCerEnum.toString)
            }
          </HSelect>
        ),
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
      {
        label: '固定资产（大等于）',
        content: getFieldDecorator('fixedAssets')(<HInput />),
      },
      {
        label: '授权签字人',
        content: getFieldDecorator('signatioyName')(<HInput />),
      },
      {
        label: '检测机构级别',
        content: getFieldDecorator('rank')(
          <HSelect>
            {
              createSelectOptions(CheckLevel)
            }
          </HSelect>
        ),
      },
      {
        label: '证书起时间',
        content: getFieldDecorator('issueTimes')(<HDatePicker />),
      },
      {
        label: '证书截止时间',
        content: getFieldDecorator('endTimes')(<HDatePicker />),
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
      </div>
    );
  }
}

export default DepartmentList;