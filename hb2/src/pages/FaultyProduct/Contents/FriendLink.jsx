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
  loadingUpdate: loading.effects['faultyFriend/update'] === true,
  loadingDelete: loading.effects['faultyFriend/remove'] === true,
}))
class FriendLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingData: null,
    };
    this.TABLE_COLUMNS = [
      {
        title: '链接名称',
        dataIndex: 'linkName',
      },
      {
        title: '链接地址',
        dataIndex: 'linkAddress',
      },
      {
        title: '链接类型',
        dataIndex: 'linkType',
        render: (text, record) => {
          return LinkEnum.toString(record.linkType);
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
                修改
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
        type: 'faultyFriend/remove',
        payLoad: [{ id }],
        callBack: () => {
          this.table.refresh();
        },
      }
    );
  }

  updateEnable = (id, enable) => {
    this.props.dispatch(
      {
        type: 'faultyFriend/update',
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
    return `/services/dpac/defectlink/list/${current}/${pageSize}/${createSearchString({ ...values, deleteStatus: '1' })}`;
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
        content: getFieldDecorator('linkName')(<HInput />),
      },
      {
        label: '链接地址',
        content: getFieldDecorator('linkAddress')(<HInput />),
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

export default FriendLink;