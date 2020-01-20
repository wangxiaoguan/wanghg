import React, { Component } from 'react';
import { Card, Form, Col, Button, message } from 'antd';
import SearchTable from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import HSelect from '@/components/Antd/HSelect';
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import BusinessTypeEnum from '@/Enums/BusinessTypeEnum';
import DepartStatusEnum from '@/Enums/DepartStatusEnum';
import ExamingStatusEnum from '@/Enums/ExamingStatusEnum';
import CheckModal from './CheckModal';
import { getPropsParams } from '@/utils/SystemUtil';


import { createSelectOptions } from '@/utils/AntdUtil';

const TITLE = '资质证书信息';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/DepartmentCheck/DepartCheckCertificateList/DepartCheckCertificateInfo';
/**
 * 资质证书信息
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['－－－/remove']),
}))
class DepartCheckCertificateList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [

    {
      title: '检测机构名称',
      dataIndex: 'orgName',
    },
    {
      title: '证书编号',
      dataIndex: 'certificateNumber',
    },
    {
      title: '证书名称',
      dataIndex: 'certificateName',
    },
    {
      title: '有效时间',
      dataIndex: 'endTimes',
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      render: (text, record) => {
        return ExamingStatusEnum.toString(record.checkStatus);
      }
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      render: (text, record) => {
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
  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexamcertificate/getAll/${current}/${pageSize}${createSearchString(values)}`;
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
  loading
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
    let arr = []
    for (const id of selectedRowKeys) {
      arr.push({ id, checkStatus, comments })
    }
    this.props.dispatch(
      {
        type: 'DepartCheckCertificateList/updateCheckStatus',
        payLoad: arr,
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
        label: '证书编号',
        content: getFieldDecorator('certificateNumber')(<HInput />),
      },
      {
        label: '审核状态',
        content: getFieldDecorator('checkStatus')(
          <HSelect>
            {
              createSelectOptions(ExamingStatusEnum.ALL_LIST, ExamingStatusEnum.toString)
            }
          </HSelect>
        ),
      },
      {
        label: '业务类型',
        content: getFieldDecorator('businessType')(
          <HSelect>
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
          <Button type="primary"
            disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.setState({ status: '1' }, () => {
                this.modal.show()
              })
            }}
          >审核通过</Button>
          <Button type="danger"
            disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.setState({ status: '2' }, () => {
                this.modal.show()
              })
            }}
          >审核不通过</Button>
        </div>
        <CheckModal getInstance={(target) => this.modal = target} onOk={this.onOk} />
      </div>
    );
  }
}

export default DepartCheckCertificateList;