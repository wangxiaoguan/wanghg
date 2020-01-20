import React, { Component } from 'react';
import { Card, Form, Col, Button } from 'antd';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import { isEmptyArray, createSearchString } from '@/utils/SystemUtil';
import HSelect from '@/components/Antd/HSelect';
import HRangePicker from '@/components/Antd/HRangePicker';
import DynamicNewsEnum from '@/Enums/DynamicNewsEnum';
import StickEnum from '@/Enums/StickEnum';
import PublishStatusEnum from '@/Enums/PublishStatusEnum';
import { createSelectOptions, confirmDelete } from '@/utils/AntdUtil';

const TITLE = '消费预警';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/defectProductContent/ConsumptionWarning/ConsumptionWarningEdit';
/**
 * 动态新闻
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['faultyConsumption/remove']),
}))
class SearchViewTemplete extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '点击量',
      dataIndex: 'clicks',
    },
    {
      title: '发布人',
      dataIndex: 'author',
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
      title: '置顶状态',
      dataIndex: 'isStick',
      render: (text, record) => {
        return StickEnum.toString(record.isStick);
      }
    },
    // {
    //   title: '审核状态',
    //   dataIndex: 'checkStatus',
    //   render: (text, record) => {
    //     return CheckStatusEnum.toString(record.checkStatus);
    //   }
    // },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        let links = {
          label: '上线',
          stickLabel: '置顶',
          isStick: 1,
          publishStatus: '1',
        }
        if (record.isStick === 1) {
          links.stickLabel = '取消置顶'
          links.isStick = 0
        }
        if (record.publishStatus === '1') {
          links.label = '下线'
          links.publishStatus = '0'
        }
        const { stickLabel, label, isStick, publishStatus } = links
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}/1`}>浏览</a>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <DeleteLink target={this} record={record} />
            <a onClick={() => {
              this.update({ id: record.id, isStick })
            }}>{`${stickLabel}`}</a>
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
        type: 'faultyConsumption/remove',
        payLoad: [{ id }],
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  update = (payLoad) => {
    this.props.dispatch(
      {
        type: 'faultyConsumption/update',
        payLoad,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    const data = { publishColumn: 3, deleteStatus: 1, ...values }
    return `/services/dpac/defectmessageissue/getAll/${current}/${pageSize}/${createSearchString(data)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          formProps={{ layout: 'horizontal' }}
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
        type: 'faultyConsumption/updateBatchCheckStatus',
        payLoad: arr,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  batchRemove = (selectedRowKeys) => {
    let arr = []
    for (const id of selectedRowKeys) {
      arr.push({ id })
    }
    this.props.dispatch(
      {
        type: 'faultyConsumption/remove',
        payLoad: arr,
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
      // {
      //   label: '类别',
      //   content: getFieldDecorator('type')(<HSelect>
      //     {
      //       createSelectOptions(DynamicNewsEnum.ALL_LIST, DynamicNewsEnum.toString)
      //     }
      //   </HSelect>),
      // },
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
      {
        label: '置顶状态',
        content: getFieldDecorator('isStick')(<HSelect>
          {
            createSelectOptions(StickEnum.ALL_LIST, StickEnum.toString)
          }
        </HSelect>),
      },
      // {
      //   label: '审核状态',
      //   content: getFieldDecorator('checkStatus')(<HSelect>
      //     {
      //       createSelectOptions(CheckStatusEnum.ALL_LIST, CheckStatusEnum.toString)
      //     }
      //   </HSelect>),
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
          {/* <Button type="primary" disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.batchUpdate(this.props.selectedRowKeys, { checkStatus: '1' });
            }}>提交审核</Button> */}
          {/* <span>新闻点击总量：----</span> */}
        </div>
      </div>
    );
  }
}

export default SearchViewTemplete;