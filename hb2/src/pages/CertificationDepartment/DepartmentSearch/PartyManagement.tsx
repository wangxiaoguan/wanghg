import { message, Card, Form } from 'antd';
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormRefreshButton from '@/components/FormRefreshButton';
import FormResetButton from '@/components/FormResetButton';
import HandleUserStatus from '@/Enums/HandleUserStatus';
import HSelect from '@/components/Antd/HSelect';
import HInput from '@/components/Antd/HInput';
import DeleteLink from '@/components/DeleteLink';
import { connect } from 'dva';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { createSelectOptions } from '@/utils/AntdUtil';
import { createSearchString, exportFileFromBlob } from '@/utils/SystemUtil';
import { confirmPwdreset } from '@/utils/AntdUtil';
import ModifyModal from '@/components/ModifyModal/index';
import { createFormRules } from '@/utils/AntdUtil';

const FormItem = Form.Item;

@connect(({ standardUser, loading }) => ({ standardUser, loadingDelete: Boolean(loading.effects['standardUser/remove']) }))
class PartyManagement extends Component<IDispatchInterface, any> {
  constructor(props){
    super(props);
    this.state= {
      visible:false,
      userData:{},
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
      dataIndex: 'contactPhone',
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
    },
    {
      title: '账户状态',
      dataIndex: 'status',
      render: (_, record) => {
        return HandleUserStatus.toString(record.status);
      },
    },
    {
      title: '操作',
      dataIndex: '',
      width: 250,
      render: (_, record) => {
        if (record.status === '0') {
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
                密码重置
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
      type: 'PartyManagement/remove',
      payLoad: {id},
      callBack: () => {
        this.table.refresh();
      },
    });
  };

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexamregisteruser/list/${current}/${pageSize}${createSearchString({
      ...values,
    })}`;
  };

  pwdreset = (id) => {
    this.props.dispatch({
      type: 'PartyManagement/pwdreset',
      payLoad: {id},
      callBack:res => {
        if(res.code === '10001'){
          message.success('密码重置成功')
        }
      }
    })
  }

  modify=(id) => {
    this.props.dispatch({
      type: 'PartyManagement/search',
      payLoad: id,
      callBack: res => {
        if(res.code === '10001'){
          this.setState({visible:true})
          this.setState({userData:res.data})
        }
      }
    });
  }

  submit = () => {

    this.props.form.validateFields((errors, values) => {
      if (!errors) {
          console.log('values', values);
          values.id = this.state.userData.id;
          this.props.dispatch({
            type: 'PartyManagement/update',
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
    });
  }

  createFormItemList = () => {
    const { userData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const phoneReg = /^1[3-9]\d{9}$/;
    const emaiReg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return [
      {
        label: '企业名称',
        content: getFieldDecorator('companyName', {
          rules: createFormRules(true),
          initialValue: userData ? userData.companyName : '',
        })(<HInput />),
      },
      {
        label: '手机号码',
        content: getFieldDecorator('phone', {
          rules: createFormRules(true, null, phoneReg),
          initialValue: userData ? userData.contactPhone : '',
        })(<HInput />),
      },
      // {
      //   label: '邮箱',
      //   content: getFieldDecorator('email', {
      //     rules: createFormRules(true, null, emaiReg),
      //     initialValue: userData ? userData.email : '',
      //   })(<HInput />),
      // },
      {
        label: '用户账户',
        content: getFieldDecorator('userAccount', {
          rules: createFormRules(true),
          initialValue: userData ? userData.userAccount : '',
        })(<HInput />),
      },
    ];
  }

  clearModal = () => {
    this.setState({visible:false})
  }

  render() {
    return (
      <Card title="检验检测-用户管理">
        <SearchTable
          getInstance={target => (this.table = target)}
          //selectedAble
          columns={this.TABLE_COLUMNS}
          formItems={EnterpriseSearchForm}
          searchCreater={this.searchCreater}
        />
        <ModifyModal visible={this.state.visible} clear={this.clearModal} userData={this.state.userData} submit={this.submit} createFormItemList={this.createFormItemList} />
      </Card>
    );
  }
}

@connect(({ loading }) => ({}))
class EnterpriseSearchForm extends Component<any, any> {

  handleChange = e => {
    let { value } = e.target;
    value = value.replace(/\s*/g,"");
    this.props.form.setFieldsValue({
      userAccount:value
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className="divAreaContainer">
          <FormItem label="用户账户">{getFieldDecorator('userAccount')(<HInput onBlur={this.handleChange} />)}</FormItem>
          <FormItem label="账户状态">
            {getFieldDecorator('status')(
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

export default Form.create()(PartyManagement);
