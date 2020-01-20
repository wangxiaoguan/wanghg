import {Select} from 'antd';

class HSelect extends Select {
  static defaultProps = Object.assign({}, Select.defaultProps, {
    allowClear: true,
  });
}

export default HSelect;