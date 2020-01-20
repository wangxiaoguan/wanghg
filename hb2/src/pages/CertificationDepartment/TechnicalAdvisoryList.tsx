import React, { Component } from 'react';
import { Card, Form, Button, Select } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import { isEmptyArray, createSearchString } from '@/utils/SystemUtil';
import { htmlToText, confirmDelete } from '@/utils/AntdUtil';

const TITLE = '技术咨询';
const FormItem = Form.Item;

const EDIT_HASH = '#/TechnicalAdvisoryList/TechnicalAdvisoryEdit';
/**
 * 技术咨询
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['TechnicalAdvisory/remove']),
}))
class TechnicalAdvisoryList extends Component<IDispatchInterface, any> {
  private COLUMNS: any[] = [
    {
      title: '检测机构名称',
      dataIndex: 'orgName',
    },
    {
      title: '问题',
      dataIndex: 'question',
      render: (text) => {
        return htmlToText(text,20);
      }
    },
    {
      title: '回复状态',
      dataIndex: 'checkStatus',
      render:(text)=>{
        return text === '0'?'待回复':text === '1'?'已回复':''
      }
    },
    {
      title: '是否删除',
      dataIndex: 'deleteStatus',
      render:(text)=>{
        return text === '0'?'已删除':text === '1'?'未删除':''
      }
    },
    {
      title: '提问时间',
      dataIndex: 'createDate',
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}`}>回复</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'TechnicalAdvisory/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  private table: SearchTableClass;

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/exam/fhexamtechnologyconsult/list/${current}/${pageSize}${createSearchString({  ...values })}`;
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
  remove = (selectedRowKeys) => {
    let ids = ''
    for (const id of selectedRowKeys) {
      ids += `${id},`
    }
    this.props.dispatch(
      {
        type: 'TechnicalAdvisory/remove',
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
        label: '是否删除',
        content: getFieldDecorator('deleteStatus')(
          <Select defaultValue="lucy" style={{ width: 120 }}>
            <Select.Option value="0">已删除</Select.Option>
            <Select.Option value="1">未删除</Select.Option>
          </Select>
        ),
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
          {/* <EditButton hash={EDIT_HASH} /> */}
          <Button type="danger" disabled={isEmptyArray(this.props.selectedRows)} onClick={() => {
            confirmDelete(() => {
              this.remove(this.props.selectedRowKeys);
            })
          }}>批量删除</Button>
        </div>
      </div>
    );
  }
}

export default TechnicalAdvisoryList;