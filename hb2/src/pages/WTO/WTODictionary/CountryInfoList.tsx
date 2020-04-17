import React, { Component } from 'react';
import { Card, Form, Checkbox } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import DeleteLink from '@/components/DeleteLink';
import ContinentEnum from '@/Enums/ContinentEnum';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import { createFormRules } from '@/utils/AntdUtil';

const TITLE = '国家及地区信息管理';
const FormItem = Form.Item;

const EDIT_HASH = '#/wtoDictionary/CountryInfoList/CountryInfoEdit';
/**
 * 国家及地区信息管理
 */
@connect(({ loading }) => ({
  loadingDelete: Boolean(loading.effects['CountryInfo/remove']),
}))
class CountryInfoList extends Component<IDispatchInterface, any> {
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '国家编号',
      dataIndex: 'countryCode',
    },
    {
      title: '国家名称',
      dataIndex: 'countryName',
    },
    {
      title: '所属区域',
      dataIndex: '',
      render: (_, record) => {
        //国家编号的第一位表示区域
        return ContinentEnum.toString(ContinentEnum.getValueByCountryCode(record.countryCode));
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
          </span>
        );
      }
    },
  ];

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'CountryInfo/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `services/wto/countryinfo/list/${current}/${pageSize}/${values.continent.join(',')}`;
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
        label: '所属国家',
        content: getFieldDecorator('continent', { rules: createFormRules(true, null, null, '至少选择一个地区'), initialValue: ContinentEnum.ALL })(<CheckboxGroup>
          {
            ContinentEnum.ALL.map((item) => {
              return <Checkbox key={item} value={item}>{ContinentEnum.toString(item)}</Checkbox>
            })
          }
        </CheckboxGroup>),
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

export default CountryInfoList;