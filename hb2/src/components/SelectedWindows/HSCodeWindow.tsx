import React, { Component } from 'react';
import SelectedWindow from './SelectedWindow';
import { Form } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import HInput from '../Antd/HInput';
import FormRefreshButton from '../FormRefreshButton';
import FormResetButton from '../FormResetButton';
import { createSearchString } from '@/utils/SystemUtil';

class HSCodeWindow extends SelectedWindow {

  /**
   * 
   * @param valueStr 逗号分隔的hscode编码,例如 01,02
   */
  public static valueStrToState(valueStr) {
    if (valueStr && valueStr.length > 0) {
      let data = valueStr.split(',');
      let result = {
        selectedRowKeys: data,
        selectedItems: data.map((item) => ({ hsCode: item }))
      };
      return result;
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: 'HS编号',
        dataIndex: 'hsCode',
      },
      {
        title: 'HS名称',
        render: (_, record) => {
          if (record.child) {
            return <a onClick={() => {
              this.addChain(record);
              this.refresh();
            }}>{record.hsName}</a>
          }
          return record.hsName;
        }
      },
    ];
  }

  labelItem(item) {
    return item.hsCode;
  }

  getSearchForm() {
    return SearchForm;
  }

  protected getRowKey() {
    return 'hsCode';
  }

  protected searchCreater = (values: any, pageSize: number, current: number): string => {
    let parentCode = '~';
    if (this.lastChainItem) {
      parentCode = this.lastChainItem.hsCode;
    }
    return `services/wto/wtohsinfo/list2/${current}/${pageSize}/${parentCode}${createSearchString(values)}`;
  }
}

class SearchForm extends Component<any>  {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode')(<HInput />),
      },
      {
        label: 'HS名称',
        content: getFieldDecorator('hsName')(<HInput />),
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

export default Form.create()(HSCodeWindow);

export {
  HSCodeWindow as HSCodeWindowClass
};