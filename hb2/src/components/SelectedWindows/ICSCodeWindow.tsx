import React, { Component } from 'react';
import SelectedWindow from './SelectedWindow';
import { Form } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import HInput from '../Antd/HInput';
import FormRefreshButton from '../FormRefreshButton';
import FormResetButton from '../FormResetButton';
import { createSearchString } from '@/utils/SystemUtil';

class ICSCodeWindow extends SelectedWindow {
  public static valueStrToState(valueStr) {
    if (valueStr && valueStr.length > 0) {
      let data = valueStr.split(',');
      let result = {
        selectedRowKeys: data,
        selectedItems: data.map((item) => ({ icsCode: item }))
      };
      return result;
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: 'ICS编号',
        dataIndex: 'icsCode',
      },
      {
        title: 'ICS名称',
        render: (_, record) => {
          if (record.child) {
            return <a onClick={() => {
              this.addChain(record);
              this.refresh();
            }}>{record.icsName}</a>
          }
          return record.icsName;
        }
      },
    ];
  }

  labelItem(item) {
    return item.icsCode;
  }

  getSearchForm() {
    return SearchForm;
  }

  protected getRowKey() {
    return 'icsCode';
  }

  protected searchCreater = (values: any, pageSize: number, current: number): string => {
    let parentCode = '~';
    if (this.lastChainItem) {
      parentCode = this.lastChainItem.icsCode;
    }
    return `services/wto/wtoicsinfo/list2/${current}/${pageSize}/${parentCode}${createSearchString(values)}`;
  }
}

class SearchForm extends Component<any>  {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: 'ICS码',
        content: getFieldDecorator('icsCode')(<HInput />),
      },
      {
        label: 'ICS名称',
        content: getFieldDecorator('icsName')(<HInput />),
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
      </div>
    );
  }
}

export default Form.create()(ICSCodeWindow);

export {
  ICSCodeWindow as ICSCodeWindowClass
};