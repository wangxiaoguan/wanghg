import SelectedWindow from './SelectedWindow';
import { createSearchString } from '@/utils/SystemUtil';
import { Form } from 'antd';

class NoticeWindow extends SelectedWindow {
  /**
* 
* @param valueStr 逗号分隔的hscode编码,例如 01,02
*/
  public static valueStrToState(valueStr) {
    if (valueStr && valueStr.length > 0) {
      let data = valueStr.split(',');
      let result = {
        selectedRowKeys: data,
        selectedItems: data.map((item) => ({ bulletinCode: item }))
      };
      return result;
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '通报号',
        dataIndex: 'bulletinCode',
      },
      {
        title: '通报标题',
        dataIndex: 'bulletinTitle',
      },
    ];
  }

  protected labelItem(item) {
    return item.bulletinCode;
  }

  protected getRowKey() {
    return 'bulletinCode';
  }

  protected searchCreater = (values: any, pageSize: number, current: number): string => {
    return `/services/wto/wtobulletin/list/${current}/${pageSize}${createSearchString(values)}`;
  }
}

export default Form.create()(NoticeWindow);

export {
  NoticeWindow as NoticeWindowClass
}