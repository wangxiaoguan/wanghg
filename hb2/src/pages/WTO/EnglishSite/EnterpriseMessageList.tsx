import React, { Component } from 'react';
import { Card, Form, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import { createSearchString } from '@/utils/SystemUtil';
import { connect } from 'dva';
import { confirmDelete, createSelectOptions } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import HSelect from '@/components/Antd/HSelect';
import PublishStatusEnum from '@/Enums/PublishStatusEnum';

const TITLE = 'EnterpriseMessage';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/EnglishSite/EnterpriseMessageList/EnterpriseMessageEdit';
/**
 * EnterpriseMessageList
 */
@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['enterpriseMessage/remove']),
  }
))
class EnterpriseMessageList extends Component<any, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '所属企业',
      dataIndex: 'enterprise',
    },
    {
      title: '留言内容',
      dataIndex: 'msgContent',
    },
    {
      title: '留言时间',
      dataIndex: 'createDate',
    },
    {
      title: '查看状态',
      dataIndex: 'checkStatus',
      render: (_, record) => {
        return record.checkStatus === '1' ? '已发布' : '未发布';
      }
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}/1`}>详情</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'enterpriseMessage/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/wtosuppliermessage/list/${current}/${pageSize}${createSearchString(values)}`;
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
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
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
        label: '所属企业',
        content: getFieldDecorator('enterprise')(<HInput />),
      },
      {
        label: '查看状态',
        content: getFieldDecorator('checkStatus')(<HSelect>
          {
            createSelectOptions(PublishStatusEnum.ALL_LIST, PublishStatusEnum.toString)
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
                <FormItem key={item.label}  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
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

export default EnterpriseMessageList;