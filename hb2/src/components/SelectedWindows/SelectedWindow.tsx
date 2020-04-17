import React, { Component } from 'react';
import { Input, Button, Form, Icon, Breadcrumb } from 'antd';
import RefModal from '../RefModal';
const classNames = require('./SelectedWindow.less');
import SearchTable, { SearchTableClass } from '../SearchTable';
import FormItem from 'antd/lib/form/FormItem';
import { isEqual } from '@/utils/SystemUtil';
import HInput from '../Antd/HInput';

export interface ISelectedWindowProps {
  className?: string;
  onChange?: (data: any) => void;
  value?: any;
  /**
   * 最大可选中数
   */
  maxSelectCount?: number;
  disabled?: boolean;
}

export interface ISelectedWindowState {
  /**
   * 已选中的项
   */
  selectedItems: any[];
  chains: any[];
  selectedRowKeys: any[];
}

/**
 * 选择窗口，用于从列数据中选择一条
 */
class SelectedWindow extends Component<ISelectedWindowProps, ISelectedWindowState> {
  static defaultProps = {
    labelItem: (item: any) => {
      return item.name;
    },
    maxSelectCount: 0,
  };

  private modal: RefModal;
  private table: SearchTableClass;

  public columns: any[];

  public constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      chains: [],
      selectedRowKeys: [],
    };

    if (props.value) {
      this.updateSelectedItems(props.value.selectKeys, props.value.selectedItems);
    }
  }

  /********  override  **********/
  protected searchCreater(values: any, pageSize: number, current: number): string {
    return '';
  }

  protected labelItem(item) {
    return 'label';
  }

  protected getSearchForm() {
    return null;
  }

  protected getRowKey() {
    return "id";
  }

  protected transData(response) {
    return {
      data: response.data.data,
      total: response.data.length,
    };
  }


  /********  override end **********/

  componentDidUpdate(prevProps, prevState) {
    let value = this.props.value;
    if (!isEqual(this.props.value, prevProps.value)) {
      if (value) {
        this.setState(value);
        this.updateSelectedItems(value.selectKeys, value.selectedItems);
      }
      else {
        this.setState({ selectedRowKeys: [], selectedItems: [] });
        this.updateSelectedItems([], []);
      }
    }
  }

  protected refresh() {
    this.table.resetForm();
  }

  protected get lastChainItem() {
    if (this.state.chains && this.state.chains.length > 0) {
      return this.state.chains[this.state.chains.length - 1];
    }
    return null;
  }

  protected addChain(record) {
    const index = this.state.chains.findIndex((item) => item[this.getRowKey()] === record[this.getRowKey()]);
    //如果包含当前项，则截取到当前项；如果不包含，插入当前项
    if (index >= 0) {
      this.toChainIndex(index);
    }
    else {
      this.state.chains.push(record);
      this.refresh();
      this.forceUpdate();
    }

  }

  clearSelectedItems() {
    this.setState({ selectedRowKeys: [], selectedItems: [] });
  }

  /**
   * 更新选中项，因为antd 的table会出现 selectedRows selectedRowKeys不一致的问题，所以需要手动控制
   * @param selectKeys 
   * @param selectedRows 
   */
  updateSelectedItems(selectKeys, selectedRows) {
    let selectedItems = this.state.selectedItems;
    //把新项加到选中列表
    if (selectedRows) {
      for (let newItem of selectedRows) {
        if (selectedItems.findIndex((item) => item[this.getRowKey()] === newItem[this.getRowKey()]) < 0) {
          selectedItems.push(newItem);
        }
      }
    }

    if (selectedItems && selectKeys && selectedItems.length) {
      //删除selectKeys不包含的项
      selectedItems = selectedItems.filter((item) => selectKeys.indexOf(item[this.getRowKey()]) >= 0);
      this.setState({ selectedItems });
    }

    if (this.props.onChange) {
      this.props.onChange(selectedItems);
    }
  }

  createLabel() {
    if (this.state.selectedItems && this.state.selectedItems.length > 0) {
      if (this.labelItem) {
        return this.state.selectedItems.map((item) => this.labelItem(item)).join(',');
      }
      else {
        return this.state.selectedItems.toString();
      }
    }
    return '请选择数据';
  }

  private toChainIndex(index) {
    if (index >= -1) {
      this.state.chains.splice(index + 1);
    }
    this.refresh();
    this.forceUpdate();
  }

  createBreadcrumb() {
    const chains = this.state.chains;
    let result = [<Breadcrumb.Item key="0"><a onClick={() => this.toChainIndex(-1)}>一级栏目</a></Breadcrumb.Item >]
    if (chains && chains.length > 0) {
      for (let i = 0; i < chains.length; i++) {
        result.push(<Breadcrumb.Item key={chains[i][this.getRowKey()]}><a onClick={() => this.toChainIndex(i)}>{this.labelItem(chains[i])}</a></Breadcrumb.Item>);
      }
    }
    return result;
  }



  public render() {
    return (
      <div className={`${classNames.SelectedWindow} ${this.props.className}`}>
        <div className={classNames.Controls}>
          <div className={classNames.InputContainer}>
            <HInput disabled={true} value={this.createLabel()} allowClear={false} />
            {
              this.state.selectedItems && this.state.selectedItems.length > 0 &&
              <Icon type="close-circle" theme="filled" onClick={() => {
                this.clearSelectedItems();
              }} />
            }
          </div>
          <Button disabled={this.props.disabled} onClick={() => {
            this.modal.show();
          }} icon="search" />
        </div>
        <RefModal
          width={800}
          getInstance={(target) => this.modal = target}
          ref='modal'
          footer={<Button onClick={() => this.modal.close()} type="primary">选好了</Button>}
          title='点击表格选择数据'>
          <div className="divAreaContainer">
            <Form>
              <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="已选数据">
                <Input.TextArea disabled value={this.createLabel()} />
              </FormItem>
            </Form>
            <Breadcrumb>
              {this.createBreadcrumb()}
            </Breadcrumb>
          </div>

          <SearchTable
            clearSelectedAfterRequest={false}
            transData={this.transData}
            rowKey={this.getRowKey()}
            pageSize={10}
            formItems={this.getSearchForm()}
            getInstance={(target) => this.table = target}
            selectedRowKeys={this.state.selectedRowKeys}
            columns={this.columns}
            searchCreater={this.searchCreater}
            selectedAble
            onSelectChange={(selectedRowKeys: any, selectedRows: any) => {
              let keys: any[] = selectedRowKeys;
              const maxSelectCount: number = this.props.maxSelectCount;
              if (maxSelectCount > 0 && keys.length > maxSelectCount) {
                keys = keys.slice(keys.length - maxSelectCount);
              }
              this.setState({ selectedRowKeys: keys });
              this.updateSelectedItems(keys, selectedRows);
            }}
          />
        </RefModal>
      </div>
    );
  }
}

export default SelectedWindow;