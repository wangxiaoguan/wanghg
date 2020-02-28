export function GetQueryString(_URL, names) {
    let URL = _URL.split('?')[1];
    let queryResult = {};
    if (URL && names instanceof Array) {
      names.map(function (v, k) {
        let reg = new RegExp('(^|&)' + v + '=([^&]*)(&|$)');
        let r = URL.match(reg);
        if (r != null) {
          queryResult[v] = r[2];
        }
      });
    } else {
    }
    return queryResult;
  }