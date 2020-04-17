import React, { Component, ReactNode } from 'react';
import { List, message } from 'antd';

import Axios from 'axios';
const Lodash = require('lodash');

interface IArticleListComponentProps {
  /**
   * 用于搜索的参数，会被传递到searchCreater中
   */
  params?: any;
  pageSize?: number;
  searchCreater: (current: number, pageSize: number, params: any) => any;
  responseParser: (response) => { total: number, dataSource: any[] };
  itemRender: (data, index) => ReactNode;
  getInstance?: (target) => void;
}

interface IArticleListComponentState {
  current: number;
  total: number;
  dataSource: any[];
  loading: boolean;
}

/**
 * 文章列表
 */
class SearchList extends Component<IArticleListComponentProps, IArticleListComponentState>{
  static defaultProps = {
    pageSize: 20,
    responseParser: (response) => {
      return {
        total: response.data.length,
        dataSource: response.data.data,
      }
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      total: 0,
      dataSource: [],
      loading: false,
    };

    if (this.props.getInstance) {
      this.props.getInstance(this);
    }
  }

  componentDidMount() {
    this.requestData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!Lodash.isEqual(this.props.params, prevProps.params) || this.props.pageSize !== prevProps.pageSize) {
      this.requestData();
    }
  }

  public refresh() {
    this.requestData();
  }

  public reset() {
    this.setState({ current: 1 }, this.requestData);
  }

  private requestData() {
    this.setState({ loading: true });
    Axios.request(this.props.searchCreater(this.state.current, this.props.pageSize, this.props.params))
      .then((response) => {
        const data = this.props.responseParser(response.data);
        this.setState({ ...data, loading: false });
      })
      .catch((error) => {
        message.error(error.toString ? error.toString() : error);
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <div>
        <List
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          renderItem={this.props.itemRender}
          pagination={{
            showQuickJumper: true,
            pageSize: this.props.pageSize,
            total: this.state.total,
            current: this.state.current,
            onChange: (current: number) => {
              this.setState({ current }, () => this.requestData());
            }
          }}
        />
      </div >
    );
  }
}

export default SearchList;