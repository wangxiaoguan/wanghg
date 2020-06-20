import { Form, Spin, Table } from 'antd';
import { getToken } from "../../utils/ProjectUtils";
const Authorization = `Bearer: ${getToken()}`;

import Axios from 'axios';
import React, { Component } from 'react';

const styles = require('./index.less');

const Context = React.createContext({ reset: null, refresh: null });

import {getService,postService} from '../../common/fetch'
class SearchTable extends Component {
  static defaultProps = {
    pageSize: 10,
    isNotPagination: false,
    clearSelectedAfterRequest: true,
    clearParentSelectKeys: true,
    rowSelection: false,
    rowKey: 'id',
    transData: response => {
        if(response && response.data ){

            return {
                data: response.data.data.tbPrjProjectReports, // dataSource
                total: response.data.data.count, // 总页数
            };
        }
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize:10,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      total: 0,
      loading: false,
      data:[],
      searchData:[]

    };
    if (this.props.getInstance) {
      this.props.getInstance(this);
    }
  }

  componentDidMount() {
    document.addEventListener('keydown',this.onkeydown);
    this.getTableData();
    this.getTree();
    this.getOption();
  }

  onkeydown = (e)=>{
    if (e.keyCode === 13) {
      this.getTableData();
    }
}
  getTree = () => {
      getService(`/workReport/auth/getUnitList/true`,res=>{
          if(res.flag){
              let list = res.data || [];
              this.dealCompany(list)
              this.setState({data:list,})
          }
      })
  }
  getOption = () => {
    let {searchData} = this.state;
    getService(`/workReport/auth/getUnitList/false`,res=>{
        if(res.flag){
            let list = res.data || [];
            this.setState({searchData:list})
        }
    })
}
    //递归处理单位
    dealCompany(values){
      values&&values.map((item,index)=>{
        item.value=item.unitId;
        item.label=item.unitName;
        if(item.children){
          this.dealCompany(item.children);
        }
      });
    }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.pageSize !== this.props.pageSize) {
    //   this.getTableData();
    // }
  }

  refresh = () => {
    this.setState({ current: 1 }, () => {
      this.getTableData();
    });
  };

  resetForm = () => {
    this.props.form.resetFields();
    this.refresh();
  };
  onPageSizeChange = (current, pageSize) => {
    this.setState({ current: 1, pageSize: pageSize  },()=>{
      this.getTableData()
    })
  }

  getTableData = () => {
    const token = sessionStorage.getItem('token');
    if(this.props.searchCreater){
      this.props.form.validateFields((error, values) => {
        let requestData = this.props.searchCreater(
          values,
          this.state.current,
          this.state.pageSize,
        );
        if (!error && requestData) {
          this.setState({ loading: true }, () => {
            if (typeof requestData === 'string') {
              requestData = encodeURI(requestData);
            }
            Axios.request(requestData,{ headers:{
              Authorization:`Bearer:${JSON.parse(token)}`
            }})
              .then((res) => {
                if (res) {
                  const data = this.props.transData(res);
                  if (data) {
                    this.setState({
                      dataSource: data.data,
                      total: data.total,
                      loading: false,
                    });
                  }
                  if (this.props.clearSelectedAfterRequest) {
                    if(this.props.selectedRowKeys){
                      this.setState({ selectedRowKeys: this.props.selectedRowKeys, selectedRows: [] });
                    }else{
                      this.setState({ selectedRowKeys: [], selectedRows: [] });
                    }
                    if (this.props.onSelectChange && this.props.clearParentSelectKeys) {
                      this.props.onSelectChange([], []);
                    }
                  }
                }
              })
              .catch(error2 => {
                this.setState({ loading: false });
              });
          });
        }
      });
    }
  };

  render() {
    const { columns } = this.props;
    const { dataSource, loading,data,searchData } = this.state;
    return (
      <div className={styles.main}>
        <Spin spinning={loading}>

          <div className={this.props.formModal}>
            <Context.Provider value={{ reset: this.resetForm, refresh: this.refresh }}>
              <Form
                layout="inline"
                style={{ overflow: 'hidden'}}
                {...this.props.formProps}
                className={styles.formStyle}
              >
                {this.props.formItems ? (
                  <this.props.formItems
                    refresh={this.refresh}
                    reset={this.resetForm}
                    table={this.refs.table}
                    form={this.props.form}
                    data={data}
                    searchData={searchData}
                    selectedRowKeys={this.state.selectedRowKeys}
                    selectedRows={this.state.selectedRows}
                    {...this.props.formItemsProps}
                  />
                ) : null}
              </Form>
            </Context.Provider>
          </div>
            
          {this.props.btnList && <div className={styles.btnList}>{this.props.btnList}</div>}

          <Table
            ref="table"
            className={this.props.className}
            columns={columns}
            bordered
            rowKey={this.props.rowKey || 'id'}
            dataSource={this.props.dataSource || dataSource}
            scroll={this.props.scroll}
            rowSelection={
              this.props.rowSelection ?
              {
              type: this.props.type || 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys, selectedRows });
                if (this.props.onSelectChange) {
                  this.props.onSelectChange(selectedRowKeys, selectedRows);
                }
              },
              getCheckboxProps: record => {
                if (this.props.getCheckboxProps) {
                  return this.props.getCheckboxProps(record);
                }
                return record;
              },
              selectedRowKeys: this.state.selectedRowKeys,
            }: null}
            pagination={this.props.isNotPagination ? false : {
              pageSize: this.state.pageSize,
              current: this.state.current,
              total: this.state.total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', "20", "30", "40"],
              onShowSizeChange: this.onPageSizeChange,
              showTotal: total => {
                return `共${total}条记录`;
              },
              onChange: (page,pageSize) => {
                this.setState({ current: page,pageSize }, this.getTableData);
              },
            }}
          />
        </Spin>
      </div>
    );
  }
}

export default Form.create()(SearchTable)