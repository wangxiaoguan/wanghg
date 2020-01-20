import { message, Card, Form } from 'antd';
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormRefreshButton from '@/components/FormRefreshButton';
import FormResetButton from '@/components/FormResetButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HandleUserStatus from '@/Enums/HandleUserStatus';
import HSelect from '@/components/Antd/HSelect';
import HInput from '@/components/Antd/HInput';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { createSelectOptions } from '@/utils/AntdUtil';
import { createSearchString, exportFileFromBlob } from '@/utils/SystemUtil';
import { confirmPwdreset } from '@/utils/AntdUtil';
import ModifyModal from './ModifyModal';

const FormItem = Form.Item;

@connect(({ standardUser, loading }) => ({ standardUser, loadingDelete: Boolean(loading.effects['standardUser/remove']) }))
class UserManagement extends Component<IDispatchInterface, any> {
  constructor(props){
    super(props);
    this.state= {
      visible:false,
    }
  }
  private TABLE_COLUMNS = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '用户账户',
      dataIndex: 'userAccount',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
    {
      title: '账户状态',
      dataIndex: 'userStatus',
      render: (_, record) => {
        return HandleUserStatus.toString(record.userStatus);
      },
    },
    {
      title: '操作',
      dataIndex: '',
      width: 250,
      render: (_, record) => {
        if (record.userStatus === '0') {
          return '';
        } else {
          return (
            <span className="controlsContainer">
              <a onClick={() => {this.modify(record.id)}}>编辑</a>
              <a
                onClick={() => {
                  confirmPwdreset(() => {this.pwdreset(record.id);});
                }}
              >
                密码初始化
              </a>
              <DeleteLink target={this} record={record} />
            </span>
          );
        }
      },
    },
  ];

  private table: SearchTableClass;

  remove = id => {
    this.props.dispatch({
      type: 'standardUser/remove',
      payLoad: id,
      callBack: () => {
        this.table.refresh();
      },
    });
  };

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/standard/fhstdregisteruser/list/${current}/${pageSize}${createSearchString({
      ...values,
    })}`;
  };

  pwdreset = (id) => {
    this.props.dispatch({
      type: 'searchNew/pwdreset',
      payLoad: id,
    })
  }

  modify=(id) => {
    this.props.dispatch({
      type: 'standardUser/search',
      payLoad: id,
      callBack: res => {
        if(res.code === '10001'){
          this.setState({visible:true})
        }
      }
    });
  }

  submit = values => {
    this.props.dispatch({
      type: 'standardUser/update',
      payLoad: values,
      callBack: res => {
        this.table.refresh();
        if(res.code === '10001'){
            message.success('修改成功');
            this.clearModal();
            this.table.refresh();
        }else{
            message.success('修改失败，请联系系统管理员');
        }
      },
    });
  }

  clearModal = () => {
    this.setState({visible:false})
  }

  render() {
    return (
      <Card title="标准查新-用户管理">
        <SearchTable
          getInstance={target => (this.table = target)}
          //selectedAble
          columns={this.TABLE_COLUMNS}
          formItems={EnterpriseSearchForm}
          searchCreater={this.searchCreater}
        />
        <ModifyModal visible={this.state.visible} clear={this.clearModal} userData={this.props.standardUser.userData} submit={this.submit} />
      </Card>
    );
  }
}

@connect(({ loading }) => ({}))
class EnterpriseSearchForm extends Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className="divAreaContainer">
          <FormItem label="用户名">{getFieldDecorator('userName')(<HInput />)}</FormItem>
          <FormItem label="账户状态">
            {getFieldDecorator('userStatus')(
              <HSelect>
                {createSelectOptions(HandleUserStatus.ALL_LIST, HandleUserStatus.toString)}
              </HSelect>
            )}
          </FormItem>
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
      </div>
    );
  }
}

export default UserManagement;
