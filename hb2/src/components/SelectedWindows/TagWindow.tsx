import SelectedWindow from './SelectedWindow';
import { createSearchString } from '@/utils/SystemUtil';
import { Form } from 'antd';
import React, { Component } from 'react';
import HInput from '../Antd/HInput';
import FormItem from 'antd/lib/form/FormItem';
import FormRefreshButton from '../FormRefreshButton';
import FormResetButton from '../FormResetButton';

class TagWindow extends SelectedWindow {
  /**
 * 
 * @param valueStr 逗号分隔的hscode编码,例如 01,02
 */
  public static valueStrToState(valueStr) {
    if (valueStr && valueStr.length > 0) {
      let data = valueStr.split(',');
      let result = {
        selectedRowKeys: data.map(item => Number(item)),
        selectedItems: data.map((item) => ({ labelId: item }))
      };
      return result;
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '标签编号',
        dataIndex: 'labelId',
      },
      {
        title: '标签名称',
        dataIndex: 'labelName',
      },
    ];
  }

  protected getRowKey() {
    return 'labelId';
  }

  labelItem(item) {
    return item.labelId;
  }

  protected getSearchForm() {
    return SearchForm;
  }

  protected searchCreater = (values: any, pageSize: number, current: number): string => {
    return `/services/wto/labelinfo/list/${current}/${pageSize}${createSearchString(values)}`;
  }
}

class SearchForm extends Component<any>  {
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
      </div>
    );
  }
}

export default Form.create()(TagWindow);

export {
  TagWindow as TagWindowClass
}