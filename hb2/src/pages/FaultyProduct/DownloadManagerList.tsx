import React, { Component } from 'react';
import { Card, Form, Col, Button } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import HSelect from '@/components/Antd/HSelect';
import PublishStatusEnum from '@/Enums/PublishStatusEnum'
import StickEnum from '@/Enums/StickEnum'
import { createSelectOptions } from '@/utils/AntdUtil';

import { createSearchString } from '@/utils/SystemUtil';

const TITLE = '下载管理';
const FormItem = Form.Item;


const EDIT_HASH = '#/DownloadManagerList/DownloadManagerEdit';
/**
 * 企业备案管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['downloadManager/remove']),
}))
class DownloadManagerList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '发布人',
      dataIndex: 'createUserId',
    },
    {
      title: '发布时间',
      dataIndex: 'createDate',
    },
    {
      title: '发布状态',
      dataIndex: 'isLine',
      render: (_, record) => {
        return PublishStatusEnum.toString(record.isLine);
      }
    },
    {
      title: '置顶状态',
      dataIndex: 'isStick',
      render: (_, record) => {
        return StickEnum.toString(record.isStick);
      }
    },
    {
      title: '操作',
      width: 320,
      render: (_, record) => {
        let links = {
          stickLabel: '置顶',
          label: '上线',
          isStick: 1,
          isLine: '1',
        }
        if (record.isStick === 1) {
          links.stickLabel = '取消置顶'
          links.isStick = 0
        }
        if (record.isLine === '1') {
          links.label = '取消上线'
          links.isLine = '0'
        }

        const { stickLabel, label, isStick, isLine } = links
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>浏览</a>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <DeleteLink target={this} record={record} />
            <a onClick={() => {
              this.update({ id: record.id, isStick })
            }}>{`${stickLabel}`}</a>
            <a onClick={() => {
              this.update({ id: record.id, isLine })
            }}>{`${label}`}</a>
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'downloadManager/remove',
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
        type: 'downloadManager/update',
        payLoad,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/dpac/fhdefectdownload/list/${current}/${pageSize}${createSearchString({ ...values, deleteStatus: 1 })}`;
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


class SearchForm extends Component<any>  {

  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '标题',
        content: getFieldDecorator('title')(<HInput />),
      },
      {
        label: '发布状态',
        content: getFieldDecorator('isLine')(
          <HSelect>
            {
              createSelectOptions(PublishStatusEnum.ALL_LIST, PublishStatusEnum.toString)
            }
          </HSelect>),
      },
      {
        label: '置顶状态',
        content: getFieldDecorator('isStick')(
          <HSelect>
            {
              createSelectOptions(StickEnum.ALL_LIST, StickEnum.toString)
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
                <FormItem label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
        </div>
      </div>
    );
  }
}

export default DownloadManagerList;