import React from 'react';
import SelectedWindow from './SelectedWindow';
import ContinentEnum from '@/Enums/ContinentEnum';

class CountryWindow extends SelectedWindow {
  /**
   * 
   * @param valueStr 逗号分隔的hscode编码,例如 01,02
   */
  public static valueStrToState(valueStr) {
    if (valueStr && valueStr.length > 0) {
      let data = valueStr.split(',');
      let result = {
        selectedRowKeys: data.map(item => item),
        selectedItems: data.map((item) => ({ countryName: item }))
      };
      return result;
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '国家编码',
        dataIndex: 'countryCode',
      },
      {
        title: '国家名称',
        dataIndex: 'countryName',
        render: (_, record) => {
          return (
            <a onClick={() => {
              record.id || this.addChain(record);
            }}>
              {record.countryName}
            </a>
          );
        }
      }
    ];
  }

  protected searchCreater = (values: any, pageSize: number, current: number): string => {
    const lastChainItem = this.lastChainItem;
    if (lastChainItem) {
      return `/services/wto/countryinfo/list/${current}/${pageSize}/${lastChainItem.countryCode}`;
    }
    return '';
  }

  protected labelItem(item) {
    return item.countryName;
  }

  protected getSearchForm() {
    return null;
  }

  protected getRowKey = () => {
    return "countryName";
  }


  protected transData = (response) => {
    //因为第一层是本地写死的枚举的，所以如果在第一层，则返回本地创建的数据
    const lastChainItem = this.lastChainItem;
    if (lastChainItem) {
      return super.transData(response);
    }
    return {
      total: ContinentEnum.ALL.length,
      data: ContinentEnum.ALL.map((item) => (
        {
          countryCode: item,
          countryName: ContinentEnum.toString(item),
        }
      ))
    }
  }
}

export default CountryWindow;

export {
  CountryWindow as CountryWindowClass
};