import { Button, Card, Form } from 'antd';
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormRefreshButton from '@/components/FormRefreshButton';
import FormResetButton from '@/components/FormResetButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HandleStatusEnum from '@/Enums/HandleStatusEnum';
import HSelect from '@/components/Antd/HSelect';
import HInput from '@/components/Antd/HInput';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { createSelectOptions } from '@/utils/AntdUtil';
import { createSearchString, exportFileFromBlob, createExportParams } from '@/utils/SystemUtil';

const FormItem = Form.Item;

/**
 * 消费品
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['consumerProduct/remove']),
}))
class Consumer extends Component<IDispatchInterface, any> {

  constructor(props){
    super(props)
    this.state={
      searchData:null
    }
  }

  private TABLE_COLUMNS = [
    {
      title: '投诉人姓名',
      dataIndex: 'cname',
    },
    {
      title: '投诉人电话',
      dataIndex: 'telephone',
    },
    {
      title: '使用者姓名',
      dataIndex: 'userName',
    },
    {
      title: '使用者年龄',
      dataIndex: 'userAge',
    },
    {
      title: '投诉时间',
      dataIndex: 'createDate',
    },
    {
      title: '生产企业',
      dataIndex: 'produceEnterprise',
    },
    {
      title: '处理状态',
      dataIndex: 'examineStatus',
      render: (_, record) => {
        return HandleStatusEnum.toString(record.examineStatus);
      }
    },
    {
      title: '操作',
      dataIndex: '',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`#/defectProduct/Consumer/ConsumerDetail/${record.id}`}>查看</a>
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
        type: 'consumerProduct/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    this.setState({searchData:values})
    return `/services/dpac/fhdefectdefectreport/selectAll2/0/${current}/${pageSize}${createSearchString({ ...values, deleteStatus: 1 })}`;
  }


  render() {
    return (
      <Card title='消费品'>
        <SearchTable
          getInstance={(target) => this.table = target}
          selectedAble
          columns={this.TABLE_COLUMNS}
          formItems={ConsumerForm}
          searchCreater={this.searchCreater}
          formItemsProps={{searchData:this.state.searchData}}
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
}))
class ConsumerForm extends Component<any, any> {

  exportExcel() {
    this.props.dispatch({
      type: 'consumerProduct/exportExcel',
      payLoad: createExportParams(this.props.searchData),
      callBack: (res) => {
        exportFileFromBlob(res, '消费品.xlsx')
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className='divAreaContainer'>
          <FormItem label='投诉人姓名'>
            {
              getFieldDecorator('cname')(<HInput />)
            }
          </FormItem>
          <FormItem label='投诉时间'>
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
    )
  }
}

export default Consumer;