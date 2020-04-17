const Moment = require("moment");

export function createSearchUrl(params) {
    const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
    let paramsList = [];
    for (let key in params) {
      let value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        let currentStr = null;
        // 如果未自定义规则，则使用通用规则 
        if (!currentStr) {
          switch (true) {
              case key === 'dealTime' && value === 'L' : // G 大于等于  L小于
              currentStr = `Q=${key}_LE=5`;
              break;

              case key === 'dealTime' && value === 'G' :
              currentStr = `Q=${key}_GT=5`;
              break;

            // 数字使用EQ
            case typeof (value) === 'number':
              currentStr = `Q=${key}_EQ=${value}`;
              break;

            // 字符串使用LK
            case typeof (value) === 'string':
              // FIX:这里单独区分大写使用EQ
              const reg = /^[A-Z]+$/;
              if (reg.test(value)) {
                currentStr = `Q=${key}_EQ=${value}`;
              } else {
                currentStr = `Q=${key}_LK=${value}`;
              }
              break;

            // 多日期使用D_GE
            case value instanceof Array && value.length >= 2:
              if (value[0] instanceof Moment) {
                currentStr = `Q=${key}_D_GE=${value[0].format(TIME_FORMAT)}&&Q=${key}_D_LE=${value[1].format(TIME_FORMAT)}`;
              }
              break;
            default:
              break;
          }
        }
        if (currentStr) {
          paramsList.push(currentStr);
        }
      }
    }
  
    if (paramsList.length) {
      return `?${paramsList.join('&&')}`;
    }
    return '';
  }