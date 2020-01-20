import { Button, Card, Form, Select } from 'antd';
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormRefreshButton from '@/components/FormRefreshButton';
import FormResetButton from '@/components/FormResetButton';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { createSearchString, exportFileFromBlob, createExportParams } from '@/utils/SystemUtil';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HandleStatusEnum from '@/Enums/HandleStatusEnum';
import SexEnum from '@/Enums/SexEnum';
import CarTypeEnum from '@/Enums/CarTypeEnum';
import { createSelectOptions } from '@/utils/AntdUtil';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['carProduct/remove']),
}))
class Car extends Component<IDispatchInterface, any> {

  constructor(props) {
    super(props)
    this.state = {
      searchData: null
    }
  }

  private TABLE_COLUMNS = [
    {
      title: '车主姓名',
      dataIndex: 'userName',
    },
    {
      title: '性别',
      dataIndex: 'userSex',
      render: (_, record) => {
        return SexEnum.toString(record.userSex);
      }
    },
    {
      title: '联系人姓名',
      dataIndex: 'cname',
    },
    {
      title: '联系方式',
      dataIndex: 'telephone',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'carModel',
    },
    {
      title: '自主/合资/进口',
      dataIndex: 'carType',
      render: (_, record) => {
        return CarTypeEnum.toString(record.carType);
      }
    },
    {
      title: '购买店铺',
      dataIndex: 'buyShop',
    },
    {
      title: '处理状态',
      dataIndex: 'examineStatus',
      render: (_, record) => {
        return HandleStatusEnum.toString(record.examineStatus);
      }

    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
    {
      title: '操作',
      dataIndex: '',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`#/defectProduct/Car/CarDetail/${record.id}`}>查看</a>
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
        type: 'carProduct/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    this.setState({ searchData: values })
    return `/services/dpac/fhdefectdefectreport/selectAll2/1/${current}/${pageSize}${createSearchString({ ...values, deleteStatus: 1 })}`;
  }

  render() {
    return (
      <Card title='汽车'>
        <SearchTable
          getInstance={(target) => this.table = target}
          formItems={CarForm}
          columns={this.TABLE_COLUMNS}
          searchCreater={this.searchCreater}
          formItemsProps={{ searchData: this.state.searchData }}
          selectedAble
        />
      </Card>
    );
  }
}
@connect(({ loading }) => ({
}))
class CarForm extends Component<any, any> {
  exportExcel() {
    const filedValues: any = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'carProduct/exportExcel',
      payLoad: createExportParams(filedValues),
      callBack: (res) => {
        exportFileFromBlob(res, '汽车信息.xlsx')
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className='divAreaContainer'>
          <FormItem label='联系人姓名'>
            {
              getFieldDecorator('cname')(<HInput />)
            }
          </FormItem>
          <FormItem label='创建时间'>
            {
              getFieldDecorator('createDate')(<HRangePicker />)
            }
          </FormItem>
          <FormItem label='处理状态'>
            {
              getFieldDecorator('examineStatus')(
                <HSelect>
                  {
                    createSelectOptions(HandleStatusEnum.ALL_LIST, HandleStatusEnum.toString)
                  }
                </HSelect>
              )
            }
          </FormItem>
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <Button type="primary" onClick={() => this.exportExcel()}>导出</Button>
        </div>
      </div>
    );
  }
}

export default Car;