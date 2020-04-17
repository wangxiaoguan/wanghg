import {Form, Input, Select, Table} from 'antd';
import React, {Component} from 'react';

import FormItem from 'antd/lib/form/FormItem';
import {createTableProps} from '@/utils/AntdUtil';
import FormRefreshButton from '@/components/FormRefreshButton';
import FormResetButton from '@/components/FormResetButton';
import HRangePicker from '@/components/Antd/HRangePicker';


const PAGE_SIZE = 20;
const TABLE_COLUMNS = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '联系方式',
    dataIndex: '',
  },
  {
    title: '联系邮箱',
    dataIndex: '',
  },
  {
    title: '是否已读',
    dataIndex: '',
  },
  {
    title: '留言时间',
    dataIndex: '',
  },
  {
    title: '操作',
    render: (text, record) => {
      return <a>查看</a>
    }
  },
];

class Mailbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      page: 1,
    };
  }

  componentDidMount() {
    this.requestData();
  }

  requestData = () => {
    this.setState({
      data: [
        {
          id: 1,
          name: 'aa',
        }
      ]
    }
    );
  }

  render() {
    return (
      <div>
        <div className='divAreaContainer'>
          <Form layout="inline">
            <FormItem label='姓名'>
              <Input />
            </FormItem>
            <FormItem label='是否已读'>
              <Select allowClear />
            </FormItem>
            <FormItem label='留言时间'>
              <HRangePicker />
            </FormItem>
            <FormItem>
              <FormRefreshButton />
              <FormResetButton />
            </FormItem>
          </Form>
        </div>
        <div className='divAreaContainer'>
          <Table
            {
            ...createTableProps(
              'id',
              TABLE_COLUMNS,
              this.state.data,
              this.state.page,
              (page) => {
                this.setState({page}, this.requestData);
              },
              PAGE_SIZE,
            )
            }
          />
        </div>
      </div>
    );
  }
}

export default Mailbox;