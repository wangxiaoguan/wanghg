import {InputNumber} from 'antd';

class HInputNumber extends InputNumber {
  static defaultProps = Object.assign({}, InputNumber.defaultProps, {
    max: 100,
    min: 0,
  });
}

export default HInputNumber;