import React, { Component } from 'react';
import { Card, Tabs } from 'antd';
import SearchTable from '@/components/SearchTable';

class AbilityInfo extends Component {
  private COLUMNES = [
    {
      title: '检测项目类别',
      dataIndex: '',
    },
    {
      title: '检测项目名称',
      dataIndex: '',
    },
    {
      title: '检测参数名称',
      dataIndex: '',
    },
    {
      title: '标准名称及编号(含年代号)',
      dataIndex: '',
    },
    {
      title: '限制范围或说明',
      dataIndex: '',
    },
    {
      title: '检查情况',
      dataIndex: '',
    }];
  render() {
    return (
      <Card>
        <Card title='机构证书基本信息'>
          基本信息
        </Card>
        <Tabs>
          <Tabs.TabPane key="1" tab="全部">
            <SearchTable
              searchCreater={(values: any, pageSize: number, current: number) => ''}
              formItems={null}
              columns={this.COLUMNES}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="检测产品">
            <SearchTable
              searchCreater={(values: any, pageSize: number, current: number) => ''}
              formItems={null}
              columns={this.COLUMNES}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="检测参数">
            <SearchTable
              searchCreater={(values: any, pageSize: number, current: number) => ''}
              formItems={null}
              columns={this.COLUMNES}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

    );
  }
}

export default AbilityInfo;