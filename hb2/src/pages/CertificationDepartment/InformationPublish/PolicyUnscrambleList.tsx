import React, { Component } from 'react';
import { Card, Form, Button } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import { isEmptyArray } from '@/utils/SystemUtil';
import HSelect from '@/components/Antd/HSelect';
import { filterOb } from '@/utils/utils';
import { createSearchString } from '@/utils/SystemUtil';
import CheckStatusEnum from '@/Enums/CheckStatusEnum';
import ExamingStatusOthersEnum from '@/Enums/ExamingStatusOthersEnum';
import PublishStatusEnum from '@/Enums/PublishStatusEnum';
import { createSelectOptions } from '@/utils/AntdUtil';
import { confirmDelete } from '@/utils/AntdUtil';

const TITLE = '政策解读';
const FormItem = Form.Item;
const publishStatus = {
  online:'1', //上线
  offline:'0',  //下线
}
const isTop = {
  top:1,
  down:0
}

const EDIT_HASH = '#/CerInformationPublish/PolicyUnscrambleList/PolicyUnscrambleEdit';
/**
 * 政策解读
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['InfoList/remove']),
}))
class SearchViewTemplete extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '政策解读主题',
      dataIndex: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
    },
    {
      title: '发布作者',
      dataIndex: 'author',
    },
    // {
    //   title: '审核状态',
    //   dataIndex: 'checkStatus',
    //   render: (_, record) => {
    //     return ExamingStatusOthersEnum.toString(record.checkStatus);
    //   }
    // },
    {
      title: '发布状态',
      dataIndex: 'publishStatus',
      render: (_, record) => {
        return PublishStatusEnum.toString(record.publishStatus);
      }
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <DeleteLink target={this} record={record} />
            {
              record.isStick === isTop.top ? //置顶状态
              <a onClick={() => {this.update({ id: record.id, isStick: '0' })}} style={{color:'#666'}}>取消置顶</a>
              :
              <a onClick={() => {this.update({ id: record.id, isStick: '1' })}}>置顶</a>
            }
            
            {
              record.publishStatus === publishStatus.online 
              ? //上线状态
              <a onClick={() => { this.update({ id: record.id, publishStatus: '0' })}} style={{color:'#666'}}>下线</a>
              : //下线状态
              <a onClick={() => {this.update({ id: record.id, publishStatus: '1' })}}>上线</a>
            }
          </span>
        );
      }
    },
  ];

  private table: SearchTableClass;

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'InfoList/remove',
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
        type: 'InfoList/update',
        payLoad,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    const data = filterOb({ publishColumn: 2, ...values })
    return `/services/exam/messageissue/list/${current}/${pageSize}/${createSearchString(data)}`;
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
}))
class SearchForm extends Component<any>  {
  batchUpdate = (selectedRowKeys, status) => {
    let arr = []
    for (const id of selectedRowKeys) {
      arr.push({ id, ...status })
    }
    this.props.dispatch(
      {
        type: 'InfoList/updateBatchCheckStatus',
        payLoad: arr,
        callBack: () => {
          this.props.refresh();
        }
      }
    );
  }

  remove = (selectedRowKeys) => {
    let ids = ''
    for (const id of selectedRowKeys) {
      ids += `${id},`
    }
    this.props.dispatch(
      {
        type: 'InfoList/remove',
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
        label: '政策解读主题',
        content: getFieldDecorator('title')(<HInput />),
      },
      // {
      //   label: '审核状态',
      //   content: getFieldDecorator('checkStatus')(<HSelect>
      //     {
      //       createSelectOptions(ExamingStatusOthersEnum.ALL_LIST, ExamingStatusOthersEnum.toString)
      //     }
      //   </HSelect>),
      // },
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
                this.remove(this.props.selectedRowKeys);
              })
            }}>批量删除</Button>
          {/* <Button type="primary" disabled={isEmptyArray(this.props.selectedRows)}
            onClick={() => {
              this.batchUpdate(this.props.selectedRowKeys, { checkStatus: '1' });
            }}>提交审核</Button> */}
        </div>
      </div>
    );
  }
}

export default SearchViewTemplete;