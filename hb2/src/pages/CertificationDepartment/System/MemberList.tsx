import React, { Component } from 'react';
import { Card, Form, Button, message } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import { isEmptyArray, createSearchString } from '@/utils/SystemUtil';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import ExamingStatusEnum from '@/Enums/ExamingStatusEnum';
import { confirmDelete } from '@/utils/AntdUtil';

const TITLE = '会员管理';
const FormItem = Form.Item;

// const EDIT_HASH = '－－－';
/**
 * 会员管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['CerMember/remove']),
}))
class MemberList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '登录名',
      dataIndex: 'userAccount',
    },
    {
      title: '真实姓名',
      dataIndex: 'userName',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
    },
    {
      title: '所属检测机构',
      dataIndex: 'companyName',
    },
    {
      title: '用户使用状态',
      dataIndex: 'status',
      render: (_, record) => {
        return ExamingStatusEnum.toString(record.status);
      }
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a onClick={() => this.resetPassword(record.id)}>密码重置</a>
            <DeleteLink target={this} record={record} />
          </span >
        );
      }
    },
  ];

  resetPassword(id) {
    const password = '123456';
    this.props.dispatch(
      {
        type: 'CerMember/update',
        payLoad: {
          id,
          userPwd: password,
        },
        callBack: () => {
          message.success(`密码已重置为${password}`);
        },
      }
    );
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'CerMember/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  private table: SearchTableClass;

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexamregisteruser/list/${current}/${pageSize}${createSearchString({ deleteStatus: '1', ...values })}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['CerMember/remove']),
}))
class SearchForm extends Component<any>  {
  remove = (id) => {
    this.props.dispatch(
      {
        type: 'CerMember/remove',
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
        label: '登录名',
        content: getFieldDecorator('userAccount')(<HInput />),
      },
      {
        label: '机构名称',
        content: getFieldDecorator('companyName')(<HInput />),
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
        <div className='divAreaContainer controlsContainer'>
          <Button type="danger" disabled={isEmptyArray(this.props.selectedRows)} onClick={() => {
            confirmDelete(() => {
              this.remove(this.props.selectedRowKeys);
            })
          }}>批量删除</Button>
        </div>
      </div>
    );
  }
}

export default MemberList;