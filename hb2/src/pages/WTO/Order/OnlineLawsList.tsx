import React, { Component } from 'react';
import { Card, Form, Button } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { createSearchString } from '@/utils/SystemUtil';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import { createSelectOptions } from '@/utils/AntdUtil';
import OnlineLawsOrderReplyStatus from '@/Enums/OnlineLawsOrderReplyStatus';
import OnlineLawsEdit from './OnlineLawsEdit';

const TITLE = '法规在线需求订购';
const FormItem = Form.Item;

/**
 * 法规在线需求订购
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['OnlineLaws/remove']),
}))
class OnlineLawsList extends Component<any, any> {

  private COLUMNS: any[] = [
    {
      title: '法规名称',
      dataIndex: 'lawTitle',
    },
    {
      title: '需求提交人',
      dataIndex: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
    },
    {
      title: '提交时间',
      dataIndex: 'applyTime',
    },
    {
      title: '操作',
      width: 280,
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
  private editView: OnlineLawsEdit;

  constructor(props) {
    super(props);
    this.state = {};
  }


  remove = (id) => {
    this.props.dispatch(
      {
        type: 'OnlineLaws/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/requirement/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
        />
        <OnlineLawsEdit
          getInstance={target => this.editView = target}
          source={this.state.currentRecord}
          disabled={this.state.disabledReply}
          successHandler={() => this.table.refresh()}
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
        label: '法规名称',
        content: getFieldDecorator('lawTitle')(<HInput />),
      },
      {
        label: '提交时间',
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
                <FormItem key={item.label} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
      </div>
    );
  }
}

export default OnlineLawsList;