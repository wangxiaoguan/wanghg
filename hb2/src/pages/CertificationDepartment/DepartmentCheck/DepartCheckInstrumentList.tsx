import React, { Component } from 'react';
import { Card, Form, Col, Button, message } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HSelect from '@/components/Antd/HSelect';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import BusinessTypeEnum from '@/Enums/BusinessTypeEnum';
import DepartStatusEnum from '@/Enums/DepartStatusEnum';
import ExamingStatusEnum from '@/Enums/ExamingStatusEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import CheckModal from './CheckModal';
import { getPropsParams } from '@/utils/SystemUtil';


const TITLE = '设备仪器信息';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/DepartmentCheck/DepartCheckInstrumentList/DepartCheckInstrumentInfo';
/**
 * 设备仪器信息
 */
@connect(({ loading }) => ({
  loading
}))
class DepartCheckInstrumentList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [

    {
      title: '检测机构名称',
      dataIndex: 'orgName',
    },
    {
      title: '仪器设备名称',
      dataIndex: 'apparatusName',
    },
    {
      title: '型号/规格',
      dataIndex: 'model',
    },
    {
      title: '有效截止日期',
      dataIndex: 'validTime',

    },
    {
      title: '状态',
      dataIndex: 'checkStatus',
      render: (_, record) => {
        return ExamingStatusEnum.toString(record.checkStatus);
      }
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      render: (_, record) => {
        return BusinessTypeEnum.toString(record.businessType);
      }
    },
    {
      title: '操作',
      dataIndex: '',
      render: (_, record) => {
        return <a href={`${EDIT_HASH}/${record.id}`}>详情</a>
      }
    }];

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexamapparatus/selectAll2/${current}/${pageSize}${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          formProps={{ layout: 'horizontal' }}
          selectedAble
          formItemsProps={{ params: getPropsParams(this.props) }}
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loading,
}))
class SearchForm extends Component<any, any>  {

  constructor(props) {
    super(props);
    this.state = {
      status: '1',
    }
  }

  onOk = (comments) => {
    if (!comments || comments.length === 0) {
      message.error('请填写审核意见')
      return
    }
    this.batchUpdate(this.props.selectedRowKeys, this.state.status, comments);
  }

  private modal: CheckModal;


  batchUpdate = (selectedRowKeys, checkStatus, comments) => {
    let str = ''
    for (const id of selectedRowKeys) {
      str += `${id},`
    }
    const params = str.substring(0, str.length - 1) + `/${checkStatus}${comments ? `/${comments}` : ''}`
    this.props.dispatch(
      {
        type: 'DepartCheckInstrument/updateCheckStatus',
        payLoad: params,
        callBack: () => {
          this.props.refresh();
          this.modal.close();
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { params: { title } } = this.props

    const FORM_ITEMS = [
      {
        label: '检测机构名称',
        content: getFieldDecorator('orgName', { initialValue: title })(<HInput />),
      },
      {
        label: '设备名称',
        content: getFieldDecorator('apparatusName')(<HInput />),
      },
      {
        label: '审核状态',
        content: getFieldDecorator('checkStatus')(<HSelect>
          {
            createSelectOptions(ExamingStatusEnum.ALL_LIST, ExamingStatusEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '业务类型',
        content: getFieldDecorator('businessType')(<HSelect>
          {
            createSelectOptions(BusinessTypeEnum.ALL_LIST, BusinessTypeEnum.toString)
          }
        </HSelect>),
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
          <Button disabled={isEmptyArray(this.props.selectedRows)} type="primary" onClick={() => {
            this.setState({ status: '1' }, () => {
              this.modal.show()
            })
          }}>审核通过</Button>
          <Button disabled={isEmptyArray(this.props.selectedRows)} type="danger" onClick={() => {
            this.setState({ status: '2' }, () => {
              this.modal.show()
            })
          }}>审核不通过</Button>
        </div>
        <CheckModal getInstance={(target) => this.modal = target} onOk={this.onOk} />
      </div>
    );
  }
}

export default DepartCheckInstrumentList;