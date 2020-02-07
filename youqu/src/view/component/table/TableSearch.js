import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import TableAndSearch from './TableAndSearch';
const Search = Input.Search;
class TableSearch extends Component{
  constructor(props) {
    super(props);
    this.state={
    };
  }
  render(){
    const {columns,url,onSearch,qfilter}=this.props;
    return(
        <TableAndSearch
            columns={columns}
            url={url}
            type="radio"
            urlfilter={qfilter}
        >
          <Search
              placeholder="请输入关键字查询"
              onChange={(value)=>onSearch(value)}
              // style={{ width: 400 }}
          />
        </TableAndSearch>
    );
  }

}
export default TableSearch;