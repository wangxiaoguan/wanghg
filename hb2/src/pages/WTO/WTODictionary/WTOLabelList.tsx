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
import { createSearchString, isEmptyArray } from '@/utils/SystemUtil';
import { confirmDelete } from '@/utils/AntdUtil';

const TITLE = '标签管理';
const FormItem = Form.Item;

const EDIT_HASH = '#/wtoDictionary/WTOLabelList/WTOLabelEdit';
/**
 * 标签管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['WTOLabel/remove']),
}))
class WTOLabelList extends Component<IDispatchInterface, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '标签编码',
      dataIndex: 'labelId',
    },
    {
      title: '标签名称',
      dataIndex: 'labelName',
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>编辑</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'WTOLabel/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `services/wto/labelinfo/list/${current}/${pageSize}/${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          selectedAble
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
        />
      </Card>
    );
  }
}

@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['WTOLabel/remove']),
}))
class SearchForm extends Component<any>  {
  remove = (id) => {
    this.props.dispatch(
      {
        type: 'WTOLabel/remove',
        payLoad: id,
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
        label: '标签名称',
        content: getFieldDecorator('labelName')(<HInput />),
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
          <Button loading={this.props.loadingDelete} type="danger" disabled={isEmptyArray(this.props.selectedRows)} onClick={() => {
            confirmDelete(() => {
              this.remove(this.props.selectedRowKeys);
            })
          }}>批量删除</Button>
        </div>
      </div>
    );
  }
}

export default WTOLabelList;