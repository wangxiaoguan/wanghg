import React, { Component } from 'react';
import { Card, Form } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import { createSearchString } from '@/utils/SystemUtil';
import HInput from '@/components/Antd/HInput';

const TITLE = '技术法规发布机构管理';
const FormItem = Form.Item;

const EDIT_HASH = '#/wtoDictionary/LawDepartmentList/LawDepartmentEdit';
/**
 * 法规分类
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['LawDepartment/remove']),
}))
class LawDepartmentList extends Component<IDispatchInterface, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '法规发布机构',
      dataIndex: 'lawPublishOrg',
    },
    {
      title: '所属国家',
      dataIndex: 'lawPublishCountry',
    },
    {
      title: '网站',
      dataIndex: 'lawVisitUrl',
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
        type: 'LawDepartment/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    console.log(values);
    return `services/wto/lawpublishorg/list/${current}/${pageSize}/${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
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
        label: '名称',
        content: getFieldDecorator('lawPublishOrg')(<HInput />),
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
        </div>
      </div>
    );
  }
}

export default LawDepartmentList;