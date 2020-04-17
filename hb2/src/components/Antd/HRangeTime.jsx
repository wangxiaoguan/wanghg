import {DatePicker} from 'antd';

const moment = require('moment');

// const defaultValue = [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')];

class HRangeTime extends DatePicker.RangePicker {
  static defaultProps = Object.assign({}, DatePicker.RangePicker.defaultProps, {
    // showTime: {
    //   defaultValue,
    // },
    // format: 'YYYY-MM-DD HH:mm:ss',
    format: 'YYYY-MM-DD',
  });
}

export default HRangeTime;