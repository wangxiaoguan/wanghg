import React, { Component } from 'react';
import { Card, Form, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import { createSearchString } from '@/utils/SystemUtil';
import EditButton from '@/components/EditButton';
import { connect } from 'dva';
import { confirmDelete } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';

const TITLE = '技术贸易措施专题';
const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const EDIT_HASH = '#/SynthesizeManage/TechnologyTradeList/TechnologyTradeEdit';

/**
 * 技术贸易措施专题
 */

@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['technologyTrade/remove']),
  }
))
class TechnologyTradeList extends Component<any, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '专题号',
      dataIndex: 'subjectNo',
    },
    {
      title: '专题名称',
      dataIndex: 'subjectName',
    },
    {
      title: '专题简介',
      dataIndex: 'subjectContent',
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`#/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaList/${record.id}`}>栏目设置</a>
            <a href={`#/SynthesizeManage/InfoRelation/${record.id}`}>信息关联</a>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>

          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'technologyTrade/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/tradesubject/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    }
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
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
        label: '专题名称',
        content: getFieldDecorator('subjectName')(<HInput />),
      },
      {
        label: '专题号',
        content: getFieldDecorator('subjectNo')(<HInput />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem key={item.label}  {...FormItemLayout} label={item.label}>{item.content}</FormItem>
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

export default TechnologyTradeList;