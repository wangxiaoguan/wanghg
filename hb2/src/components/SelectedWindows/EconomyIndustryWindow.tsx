import React, { Component } from 'react';
import SelectedWindow from './SelectedWindow';
import { Form } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import HInput from '../Antd/HInput';
import FormRefreshButton from '../FormRefreshButton';
import FormResetButton from '../FormResetButton';

class EconomyIndustryWindow extends SelectedWindow {

  /**
   * 
   * @param valueStr 逗号分隔的industryCode编码,例如 01,02
   */
  public static valueStrToState(valueStr) {
    if (valueStr && valueStr.length > 0) {
      let data = valueStr.split(',');
      let result = {
        selectedRowKeys: data,
        selectedItems: data.map((item) => ({ industryCode: item })),
      };
      return result;
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '国民经济编号',
        dataIndex: 'industryCode',
      },
      {
        title: '国民经济名称',
        render: (_, record) => {
          if (record.count) {
            return <a onClick={() => {
              this.addChain(record);
              this.refresh();
            }}>{record.industryName}</a>
          }
          return record.industryName;
        }
      },
    ];
  }

  labelItem(item) {
    return item.industryCode;
  }

  getSearchForm() {
    return SearchForm;
  }

  protected getRowKey() {
    return 'industryCode';
  }

  protected searchCreater = (values: any, pageSize: number, current: number): any => {
    let parentCode = '';
    if (this.lastChainItem) {
      parentCode = this.lastChainItem.industryCode;
    }
    return {
      method: 'post',
      url: `services/wto/industryhs/listcategory/${current}/${pageSize}`,
      data: {
        industryCode: parentCode,
      }
    };
  }
}

class SearchForm extends Component<any>  {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '国民经济代码',
        content: getFieldDecorator('industryCode')(<HInput />),
      },
      {
        label: '国民经济名称',
        content: getFieldDecorator('industryName')(<HInput />),
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

export default Form.create()(EconomyIndustryWindow);

export {
  EconomyIndustryWindow as EconomyIndustryWindowClass
};