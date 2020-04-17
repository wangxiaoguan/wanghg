import React, { Component } from 'react';
import { Card, Form, Col, Button, DatePicker } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import HSelect from '@/components/Antd/HSelect';
import BusineseScopeEnum from '@/Enums/BusineseScopeEnum'
// import BlackEnum from '@/Enums/BlackEnum'
import { createSelectOptions } from '@/utils/AntdUtil';

import HRangePicker from '@/components/Antd/HRangePicker';
import { createSearchString, exportFileFromBlob, createExportParams } from '@/utils/SystemUtil';

const TITLE = '企业备案管理';
const FormItem = Form.Item;

const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/CompanyRecordList/CompanyRecordEdit';
const DETAIL_HASH = '#/CompanyRecordList/CompanyRecordDetail/1';
/**
 * 企业备案管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['companyRecord/remove']),
}))
class CompanyRecordList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '企业名称',
      dataIndex: 'name',
    },
    {
      title: '所属区域',
      dataIndex: 'addrCity',
    },
    {
      title: '地址',
      dataIndex: 'addr',
    },
    {
      title: '经济行业',
      dataIndex: 'busineseScope',
      render: (_, record) => {
        return BusineseScopeEnum.toString(record.busineseScope);
      }
    },
    {
      title: '经营产品种类',
      dataIndex: 'productCategory',
    },
    {
      title: '联系人',
      dataIndex: 'representative',
    },
    {
      title: '联系方式',
      dataIndex: 'telephone',
    },
    {
      title: '备案时间',
      dataIndex: 'createDate',
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${DETAIL_HASH}/${record.id}`}>查看</a>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'companyRecord/remove',
        payLoad: [{ id }],
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


  searchCreater = (values: any, pageSize: number, current: number) => {
    if (values.busineseScope) {
      values.busineseScope = Number(values.busineseScope);
    }
    return `/services/dpac/defectenterprise/list/${current}/${pageSize}${createSearchString({ ...values, deleteStatus: 1 })}`;
  }


  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          formProps={{ layout: 'horizontal' }}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
}))
class SearchForm extends Component<any>  {
  exportExcel() {
    const filedValues: any = this.props.form.getFieldsValue();
    // if (filedValues.createDate && filedValues.createDate.length >= 2) {
    //   filedValues.startDate = filedValues.createDate[0].format('YYYY-MM-DD HH:mm:ss');
    //   filedValues.endDate = filedValues.createDate[1].format('YYYY-MM-DD HH:mm:ss');
    // }
    this.props.dispatch(
      {
        type: 'companyRecord/exportExcel',
        payLoad:createExportParams(filedValues),
        callBack: (res) => {
          exportFileFromBlob(res, '缺陷产品.xlsx');
        }
      }
    );
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '企业名称',
        content: getFieldDecorator('name')(<HInput />),
      },
      {
        label: '经营产品种类',
        content: getFieldDecorator('productCategory')(<HInput />),
      },
      {
        label: '经济行业',
        content: getFieldDecorator('busineseScope')(
          <HSelect>
            {
              createSelectOptions(BusineseScopeEnum.ALL_LIST, BusineseScopeEnum.toString)
            }
          </HSelect>),
      },
      {
        label: '备案时间',
        content: getFieldDecorator('createDate')(<HRangePicker />),
      },
      {
        label: '联系人',
        content: getFieldDecorator('representative')(<HInput />),
      },
      {
        label: '联系方式',
        content: getFieldDecorator('telephone')(<HInput />),
      },
      {
        label: '市区',
        content: getFieldDecorator('addrCity')(<HInput />),
      },
      {
        label: '县区',
        content: getFieldDecorator('addrCounty')(<HInput />),
      },
      {
        label: '详细地址',
        content: getFieldDecorator('addr')(<HInput />),
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
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
        </div>
      </div>
    );
  }
}

export default CompanyRecordList;