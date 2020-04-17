import { Button, Switch, Card, Col, Form } from 'antd';
import React, { Component } from 'react';
import FriendLinkEdit from './FriendLinkEdit';
import { renderAttatch } from '@/utils/AntdUtil';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import SearchTable from '@/components/SearchTable';
import { connect } from 'dva';
import DeleteLink from '@/components/DeleteLink';
import { createSearchString } from '@/utils/SystemUtil';
import LinkEnum from '@/Enums/LinkEnum';
import EditButton from '@/components/EditButton';
import HInput from '@/components/Antd/HInput';
import RegonEnum from '@/Enums/RegonEnum';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/systemManagement/memberManagement/memberEdit';

@connect(({ loading }) => ({
  loading,
  loadingUpdate: loading.effects['friendManagement/update'] === true,
  loadingDelete: loading.effects['friendManagement/remove'] === true,
}))
class MemberManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingData: null,
    };
    this.TABLE_COLUMNS = [
      {
        title: '登录名',
        dataIndex: 'userAccount',
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
      },
      {
        title: '所属区划',
        dataIndex: 'divisionCode',
        render:(text)=>(RegonEnum.toString(text))
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '是否锁定该用户',
        dataIndex: 'userStatus',
        render:(text)=>text === '2'?'锁定':'未锁定'
      },
      {
        title: '所属权限',
        dataIndex: 'roleName',
      },
      // {
      //   title: '是否启用',
      //   dataIndex: 'visible',
      //   render: (text, record) => {
      //     return record.visible === 1 ? '显示' : '隐藏';
      //   }
      // },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span className='controlsContainer'>
              <a href={`${EDIT_HASH}/${record.id}`}>
                编辑
              </a>
              {/* <a>删除</a> */}
              <DeleteLink target={this} record={record} />
              <a onClick={() => {
                // confirmDelete(() => target.remove(this.props.record.id));
                this.reset(record.id)
              }}>重置密码</a>
              {/* <a onClick={()=>{}}>
                角色分配
              </a> */}
            </span>
          );
        }
      },
    ];
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'memberManagement/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        },
      }
    );
  }

  reset = (id) => {
    this.props.dispatch(
      {
        type: 'memberManagement/reset',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        },
      }
    );
  }

  updateEnable = (id, enable) => {
    this.props.dispatch(
      {
        type: 'friendManagement/update',
        payLoad: {
          id,
          visible: enable ? 1 : 0
        },
        callBack: () => {
          this.table.refresh();
        },
      }
    );
  }

  searchCreater = (values, pageSize, current) => {
    // const data = { ...values, module: 'code', type: 'enter' }
    return `/services/code/fhcoderegisteruser/list/${current}/${pageSize}/${createSearchString({ ...values })}`;
  }


  render() {
    return (
      <Card title="人员后台管理">
        <div className='divAreaContainer'>
          <SearchTable
            getInstance={(target) => { this.table = target }}
            formItems={SearchForm}
            columns={this.TABLE_COLUMNS}
            searchCreater={this.searchCreater}
            formProps={{ layout: 'horizontal' }}
          />
          <FriendLinkEdit
            orgData={this.state.editingData}
            getInstance={(instance) => { this.editView = instance; }}
            successHandler={() => { this.table.refresh() }}
          />
        </div>
      </Card>
    );
  }
}

class SearchForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '登录名',
        content: getFieldDecorator('userAccount')(<HInput />),
      },
      // {
      //   label: '链接地址',
      //   content: getFieldDecorator('skipUrl')(<HInput />),
      // },

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
        <div className='divAreaContainer'>
          <EditButton hash={EDIT_HASH} />
          {/* <Button type="primary" onClick={() => this.editView.show()}>新增</Button> */}
          {/* <FriendLinkEdit getInstance={(target) => { this.editView = target }} successHandler={() => { this.props.refresh() }} /> */}
        </div>
      </div>
    );
  }
}

export default MemberManagement;