import { Form, message, Spin, Table } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import Axios from 'axios';
import { isEqual } from '@/utils/SystemUtil';

const Context = React.createContext({ reset: null, refresh: null, });

interface ISearchTableProps {

  /**
   * 请求数据后，是否清除选中项
   */
  clearSelectedAfterRequest?: boolean;

  /**
   * form表单的类
   */
  formItems?: any,

  /**
   * table的列
   */
  columns: object[],

  /**
   * 创建查询请求的参数，参考 axios
   * 
   * @param values 表单的值
   * @param pageSize 一页的长度
   * @param current 当前页码,从1开始
   */
  searchCreater: (values: any, pageSize: number, current: number) => any;

  /**
   * 选中项发生变化时的响应函数
   */
  onSelectChange?: (selectedRowKeys, selectedRows) => any;

  /**
   * 返回数据转换为表格需要的数据
   * 
   * @param response 请求返回的数据
   * 
   * @return {data:[]--表格的数据源, total--总条数}
   */
  transData?: (response: any) => { data: any[], total: number };

  /**
   * 获取searchtable实例
   */
  getInstance?: (target: SearchTable) => void,

  /**
   * 一页长度
   */
  pageSize?: number,
  errorHandler?: (error: any) => void,

  /**
   * 要给form传递的props
   */
  formProps?: any,

  /**
   * 要给table的props
   */
  tableProps?: any,

  /**
   * 要传给formItems类实例的props
   */
  formItemsProps?: any,

  /**
   * 是否可选
   */
  selectedAble?: boolean,

  /**
   * 数据唯一标识名称
   */
  rowKey?: string;

  selectedRowKeys?: any[];
}

interface ISearchTableState {
  total: number,
  current: number,
  dataSource: object[],
  selectedRowKeys: any[],
  selectedRows: any[],
  loading: boolean,
}

let formChanged = false;

/**
 * ## 用于搜索的表格
 * + 初始化时，会自动获取一次数据
 * + 切换页码时自动获取数据
 * + 网络请求过程中，显示加载动画
 * + 手动刷新时：外部刷新数据时（例如新增或删除数据后），页码不会被重置
 * + 搜索条件变化后，会自动把页码重置为1
 * + 重置时，自动刷新一次数据
 * 
 * ### 必传属性
 * + formItems--用于搜索的form表单项组件类型（是类型，不是实例）,  formItems中的组件需要用getFieldDecorator包裹
 * + columns--表格的列数据
 * + searchCreater(formValues, pageSize, current)，返回值为网络请求的参数，和axios.quest()的参数相同，通常包含{url, body, method}，可参考axios官网
 * + transData(response)--返回值为{data, total}, data：表格数据源， total:总数据条数；返回null，表示不刷新表格数据（如果请求结果出错，可返回null)。
 * 
 * ### 可选属性
 * + rowKey--table的rowKey属性，如果不传，默认为"id"
 * + pageSize--每页显示的条数，默认为10
 * + tableProps--要单独给table设置的props属性，默认为null
 * + formProps--要给表单传入的props，默认为null
 * + selectedAble--表格是否可选（每行前面是否有单选框)，默认为false
 * + getInstance(target)--获取当前实例
 * 
 * ### formItems组件内部
 * + 可通过执行this.props.refresh()方法，主动刷新表格，例如在表单中有搜索按钮，当点击搜索按钮时，可刷新数据
 * + 可通过this.props.reset()重置表单
 * + 可通过this.props.form获取表单的引用
 * + 可通过this.props.table获取Table组件的引用
 * + 通过this.props.selectedRowKeys获取表格中选中的项id列表
 * + 通过this.props.selectedRow获取表格中选中的项列表
 * 
 * ### 通过组件实例调用(实例可通过props.getInstance获取)
 * + refresh()--刷新列表
 * + resetForm()--重置表单并刷新列表
 */
class SearchTable extends Component<ISearchTableProps & FormComponentProps, ISearchTableState> {
  public static defaultProps = {
    pageSize: 10,
    rowKey: 'id',
    clearSelectedAfterRequest: true,
    transData: (response) => {
      return {
        data: response.data.data,
        total: response.data.length,
      };
    }
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.selectedRowKeys && !isEqual(prevState.selectedRowKeys, nextProps.selectedRowKeys)) {
  //     return {
  //       selectedRowKeys: nextProps.selectedRowKeys,
  //     }
  //   }
  //   return null;
  // }


  constructor(props) {
    super(props);
    if (this.props.getInstance) {
      this.props.getInstance(this);
    }
    this.state = {
      // 当前页码，从1开始
      current: 1,
      // 是否网络请求中
      loading: false,
      // 表格数据源
      dataSource: [],
      // 数据总条数
      total: 0,
      // 已选中的所有行id
      selectedRowKeys: props.selectedRowKeys,
      // 已选中的所有项
      selectedRows: [],
    };
  }

  public componentDidMount() {
    this.searchQuest();
  }

  public componentDidUpdate(prevProps, prevState) {
    if (prevProps.pageSize !== this.props.pageSize) {
      this.searchQuest();
    }
    if (prevProps.selectedRowKeys !== this.props.selectedRowKeys && !isEqual(prevState.selectedRowKeys, this.props.selectedRowKeys)) {
      this.setState({ selectedRowKeys: this.props.selectedRowKeys });
    }
  }

  private searchQuest = () => {
    if (this.props.searchCreater) {
      this.props.form.validateFields((error, values) => {
        if (!error) {
          this.setState({ loading: true, current: formChanged ? 1 : this.state.current }, () => {
            formChanged = false;
            let requestData = this.props.searchCreater(values, this.props.pageSize, this.state.current);
            if (typeof (requestData) === 'string') {
              requestData = encodeURI(requestData);
            }
            Axios.request(requestData)
              .then(
                (response) => {
                  this.setState({
                    loading: false,
                  });
                  /**
                   * 列表请求业务处理，根据实际业务返回码修改
                   */
                  if (response.data.code === '10002') {
                    message.error(response.data.message || '请求失败');
                    return
                  }
                  const data = this.props.transData(response.data);
                  if (data) {
                    this.setState({
                      dataSource: data.data,
                      total: data.total,
                    });
                  }
                  if (this.props.clearSelectedAfterRequest) {
                    this.setState({ selectedRowKeys: [], selectedRows: [] });
                    if (this.props.onSelectChange) {
                      this.props.onSelectChange([], []);
                    }
                  }
                }
              )
              .catch(
                (error2) => {
                  if (this.props.errorHandler) {
                    this.props.errorHandler(error2);
                  }
                  else {
                    message.error(error2.toString());
                  }
                  this.setState({ loading: false });
                }
              );
          });
        }
      });
    }
  }

  /**
   * 重置搜索表单和页码，并刷新数据
   */
  public resetForm = () => {
    this.props.form.resetFields();
    formChanged = true;
    this.searchQuest();
  }

  public refresh = () => {
    this.searchQuest();
  }

  public render() {
    return (
      <div className='searchTable' style={this.props.style}>
        <Spin spinning={this.state.loading}>
          <Context.Provider value={{ reset: this.resetForm, refresh: this.refresh }}>
            <Form layout="inline" {...this.props.formProps}>
              {
                this.props.formItems ? (
                  <this.props.formItems
                    refresh={this.searchQuest}
                    reset={this.resetForm}
                    table={this.refs.table}
                    form={this.props.form}
                    selectedRowKeys={this.state.selectedRowKeys}
                    selectedRows={this.state.selectedRows}
                    {
                    ...this.props.formItemsProps
                    }
                  />
                ) : null
              }
            </Form>
          </Context.Provider>
          <Table
            ref="table"
            scroll={{ x: 1000 }}
            rowSelection={
              this.props.selectedAble ? {
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({ selectedRowKeys, selectedRows });
                  if (this.props.onSelectChange) {
                    this.props.onSelectChange(selectedRowKeys, selectedRows);
                  }
                },
                selectedRowKeys: this.state.selectedRowKeys,
              } : null
            }
            rowKey={this.props.rowKey || "id"}
            columns={this.props.columns}
            dataSource={this.state.dataSource}
            pagination={
              {
                pageSize: this.props.pageSize,
                current: this.state.current,
                total: this.state.total,
                showQuickJumper: true,
                showTotal: (total, range) => {
                  return `共${total}条记录`;
                },
                onChange: (page) => {
                  this.setState({ current: page }, this.searchQuest);
                },
                ...(this.props.tableProps ? this.props.tableProps.pagination : null)
              }
            }
            {...this.props.tableProps}
          />
        </Spin>
      </div>
    );
  }
}

export default Form.create({
  onValuesChange: () => {
    formChanged = true;
  }
})(SearchTable) as any as (props: ISearchTableProps) => any;

export {
  SearchTable as SearchTableClass,
  Context
};