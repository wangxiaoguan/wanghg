//政策背景管理
import React, { Component } from 'react';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { Form, Col, Button, Card } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import { confirmDelete, createSelectOptions } from '@/utils/AntdUtil';
import FormRefreshButton from '@/components/FormRefreshButton';
import HSelect from '@/components/Antd/HSelect';
import EditButton from '@/components/EditButton';
import HRangePicker from '@/components/Antd/HRangePicker';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import DeleteLink from '@/components/DeleteLink';
import PublishStatusEnum from '@/Enums/PublishStatusEnum';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const EDIT_HASH = '#/systemManagement/policyManagement/policyManagementEdit';
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['policyManagement/remove']),
}))
class PolicyManagement extends Component<any, any> {
  private COLUMNS: any[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
    },
    {
      title: '发布状态',
      dataIndex: 'publishStatus',
      render: (text, record) => {
        return PublishStatusEnum.toString(record.publishStatus);
      }
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        let links = {
          label: '上线',
          publishStatus: '1',
        }
        if (record.publishStatus === '1') {
          links.label = '下线'
          links.publishStatus = '0'
        }
        const { label, publishStatus } = links
        return (
          <span className='controlsContainer'>
            {/* <a href={`${EDIT_HASH}/${record.id}`}>浏览</a> */}
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <DeleteLink target={this} record={record} />
            <a onClick={() => {
              this.update({ id: record.id, publishStatus })
            }}>{`${label}`}</a>
          </span >
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'policyManagement/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  update = (payLoad) => {
    this.props.dispatch(
      {
        type: 'policyManagement/update',
        payLoad,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/code/policycontext/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title='政策背景管理'>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          formProps={{ layout: 'horizontal' }}
          searchCreater={this.searchCreater}
          selectedAble
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
}))
class SearchForm extends Component<any>  {
  batchUpdate = (selectedRowKeys, status) => {
    let arr = []
    for (const id of selectedRowKeys) {
      arr.push({ id, ...status })
    }
    this.props.dispatch(
      {
        type: 'policyManagement/updateBatchStatus',
        payLoad: arr,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }
  batchRemove = (selectedRowKeys) => {
    let ids = ''
    for (const id of selectedRowKeys) {
      ids += `${id},`
    }
    this.props.dispatch(
      {
        type: 'policyManagement/remove',
        payLoad: ids.substring(0, ids.length - 1),
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
        label: '标题',
        content: getFieldDecorator('title')(<HInput />),
      },
      {
        label: '发布时间',
        content: getFieldDecorator('publishTime')(<HRangePicker />),
      },
      {
        label: '发布状态',
        content: getFieldDecorator('publishStatus')(<HSelect>
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
          <EditButton hash={EDIT_HASH} />
          <Button type="primary" disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.batchUpdate(this.props.selectedRowKeys, { publishStatus: '1' });
            }}>批量上线</Button>
          <Button type="primary" disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.batchUpdate(this.props.selectedRowKeys, { publishStatus: '0' });
            }}>批量下线</Button>
          <Button type="danger" disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              confirmDelete(() => {
                this.batchRemove(this.props.selectedRowKeys);
              })
            }}>批量删除</Button>
        </div>
      </div>
    );
  }
}

export default PolicyManagement;