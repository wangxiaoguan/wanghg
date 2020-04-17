
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Card } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import EditButton from '@/components/EditButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSearchString } from '@/utils/SystemUtil';
import DeleteLink from '@/components/DeleteLink';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const EDIT_HASH = '#/systemManagement/roleManage/roleEdit';

@connect(({ loading }) => ({ loadingDelete: Boolean(loading.effects['RoleManage/remove']) }))
/**
 * 角色管理
 */
class RoleManage extends Component<any, any> {
  private COLUMNS = [
    {
      title: '序号',
      dataIndex: 'index',
      render(text, record, index) {
        return `${index + 1}`
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      width: 380,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <DeleteLink record={record} target={this} />
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch({
      type: 'RoleManage/remove',
      payLoad: id,
      callBack: () => {
        this.table.refresh();
      }
    });
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/code/fhcoderole/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title='角色管理'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          searchCreater={this.searchCreater}
          selectedAble={false}
        />
      </Card>
    );
  }
}

class SearchForm extends Component<any, any> {

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '角色名称',
        content: getFieldDecorator('roleName')(<HInput />),
      },
    ];

    return (
      <div>
        <div className='divAreaContainer'>
          {FORM_ITEMS.map((item) => {
            return (
              <Col key={item.label} span={8}>
                <FormItem {...FormItemLayout} label={item.label}>{item.content}</FormItem>
              </Col>

            );
          })}
          <Col span={8}>
            <FormItem wrapperCol={{ offset: 7 }}>
              <FormRefreshButton />
              <FormResetButton />
            </FormItem>
          </Col>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
        </div>
      </div>
    );
  }
}

export default RoleManage;