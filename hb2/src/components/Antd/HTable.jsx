import {Table} from "antd";


class HTable extends Table {
  static defaultProps = Object.assign({}, Table.defaultProps, {
    scroll: {x: 800},
  });
}

export default HTable;