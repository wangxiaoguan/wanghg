import SelectedWindow from './SelectedWindow';
import { createSearchString } from '@/utils/SystemUtil';
import { Form } from 'antd';

class LawDepartmentWindow extends SelectedWindow {
/**
 * 
 * @param valueStr 逗号分隔的hscode编码,例如 01,02
 */
  public static valueStrToState(valueStr) {
    if (valueStr && valueStr.length > 0) {
      let data = valueStr.split(',');
      let result = {
        selectedRowKeys: data.map(item => Number(item)),
        selectedItems: data.map((item) => ({ id: item }))
      };
      return result;
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '机构名称',
        dataIndex: 'lawPublishOrg',
      },
    ];
  }

  protected getRowKey() {
    return 'id';
  }

  labelItem(item) {
    return item.id;
  }

  protected searchCreater = (values: any, pageSize: number, current: number): string => {
    return `/services/wto/lawpublishorg/list/${current}/${pageSize}${createSearchString(values)}`;
  }
}

export default Form.create()(LawDepartmentWindow);

export {
  LawDepartmentWindow as LawDepartmentWindowClass
}