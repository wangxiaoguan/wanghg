import SelectedWindow from './SelectedWindow';
import { createSearchString } from '@/utils/SystemUtil';
import { Form } from 'antd';

class NewsWindow extends SelectedWindow {
 /**
  * 
  * @param valueStr 逗号分隔的hscode编码,例如 01,02
  */
  public static valueStrToState(valueStr) {
    if (valueStr && valueStr.length > 0) {
      let data = valueStr.split(',');
      let result = {
        selectedRowKeys: data,
        selectedItems: data.map((item) => ({ id: item })),
      };
      return result;
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '标题',
        dataIndex: 'title',
      }
    ];
  }

  protected labelItem(item) {
    return item.id;
  }

  protected getRowKey() {
    return 'id';
  }

  protected searchCreater = (values: any, pageSize: number, current: number): string => {
    return `/services/indexManage/news/list/${current}/${pageSize}${createSearchString(values)}`;
  }
}

export default Form.create()(NewsWindow);

export {
  NewsWindow as NewsWindow
}