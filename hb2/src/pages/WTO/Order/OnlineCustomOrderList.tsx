import React, { Component } from 'react';
import { Card, Form, Button, Col } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import { confirmDelete, createSelectOptions } from '@/utils/AntdUtil';
import OnlineLawsOrderReplyStatus from '@/Enums/OnlineLawsOrderReplyStatus';
import OnlineCustomOrderEdit from './OnlineCustomOrderEdit';

const TITLE = '产品在线定制管理';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
/**
 * 产品在线定制管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['OnlineCustomOrder/remove']),
}))
class OnlineCustomOrderList extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '采用标准',
      dataIndex: 'productStandard',
    },
    {
      title: '出口国家',
      dataIndex: 'exportCountry',
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
    },
    {
      title: '定制时间',
      dataIndex: 'applyTime',
    },
    {
      title: '操作',
      width: 300,
      fixed: 'right',
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <Button disabled={record.replyContent} type="primary" ghost onClick={() => {
              this.setState({ currentRecord: record, disabledReply: false }, () => this.editView.show());
            }}>回复</Button>
            <Button disabled={!record.replyContent} type="primary" ghost
              onClick={() => {
                this.setState({ currentRecord: record, disabledReply: true }, () => this.editView.show());
              }}
            >
              查看回复
            </Button>
            <DeleteLink record={record} target={this} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;
  private editView: OnlineCustomOrderEdit;

  constructor(props) {
    super(props);
    this.state = {};
  }


  remove = (id) => {
    this.props.dispatch(
      {
        type: 'OnlineCustomOrder/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/customization/list/${current}/${pageSize}${createSearchString(values)}`;
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
        <OnlineCustomOrderEdit getInstance={target => this.editView = target} source={this.state.currentRecord} disabled={this.state.disabledReply} />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['OnlineCustomOrder/remove']),
}))
class SearchForm extends Component<any>  {
  remove = (id) => {
    this.props.dispatch(
      {
        type: 'OnlineCustomOrder/remove',
        payLoad: id,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '产品名称',
        content: getFieldDecorator('productName')(<HInput />),
      },
      {
        label: '出口国家',
        content: getFieldDecorator('exportCountry')(<HInput />),
      },
      {
        label: '起止时间',
        content: getFieldDecorator('applyTime')(<HRangePicker />),
      },
      {
        label: '回复状态',
        content: getFieldDecorator('status')(<HSelect>
          {
            createSelectOptions(OnlineLawsOrderReplyStatus.ALL_LIST, OnlineLawsOrderReplyStatus.toString)
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
          <Button
            type="danger"
            disabled={isEmptyArray(this.props.selectedRowKeys)}
            onClick={() => {
              confirmDelete(() => {
                this.remove(this.props.selectedRowKeys.join(','));
              });
            }}
          >
            批量删除
          </Button>
        </div>
      </div>
    );
  }
}

export default OnlineCustomOrderList;