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
import HInput from '@/components/Antd/HInput';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

@connect(({ loading }) => ({
  loading,
  loadingUpdate: loading.effects['friendManagement/update'] === true,
  loadingDelete: loading.effects['friendManagement/remove'] === true,
}))
class FriendManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingData: null,
    };
    this.TABLE_COLUMNS = [
      {
        title: '链接名称',
        dataIndex: 'name',
      },
      {
        title: '链接地址',
        dataIndex: 'skipUrl',
      },
      {
        title: '显示顺序',
        dataIndex: 'priority',
      },
      {
        title: '是否启用',
        dataIndex: 'visible',
        render: (text, record) => {
          return record.visible === 1 ? '显示' : '隐藏';
        }
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span className='controlsContainer'>
              <a onClick={() => {
                this.editView.show();
                this.setState({ editingData: record });
              }}
              >
                编辑
              </a>
              {/* <a>删除</a> */}
              <DeleteLink target={this} record={record} />
            </span>
          );
        }
      },
    ];
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'friendManagement/remove',
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
    const data = { ...values, module: 'code', type: 'enter' }
    return `/services/indexManage/menu/list/${current}/${pageSize}/${createSearchString({ ...data })}`;
  }


  render() {
    return (
      <Card title="友情链接">
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
        label: '链接名称',
        content: getFieldDecorator('name')(<HInput />),
      },
      {
        label: '链接地址',
        content: getFieldDecorator('skipUrl')(<HInput />),
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
        <div className='divAreaContainer'>
          <Button type="primary" onClick={() => this.editView.show()}>新增</Button>
          <FriendLinkEdit getInstance={(target) => { this.editView = target }} successHandler={() => { this.props.refresh() }} />
        </div>
      </div>
    );
  }
}

export default FriendManagement;