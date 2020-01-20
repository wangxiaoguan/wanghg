import React, { Component } from 'react';
import { Card } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { connect } from 'dva';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';
import { createSearchString } from '@/utils/SystemUtil';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import DeleteLink from '@/components/DeleteLink';


const TITLE = '筹建历程管理';

const EDIT_HASH = '#/GuangguBase/roadManagement/roadManagementEdit';

@connect(({ loading }) => ({
  loading,
  loadingDelete: Boolean(loading.effects['guangguBase/remove']),
}))
class RoadManagement extends Component<IDispatchInterface, any> {

  private COLUMNS: any[] = [
    {
      title: '年份',
      dataIndex: 'yearDate',
    },
    {
      title: '事件名称',
      dataIndex: 'title',
    },
    {
      title: '事件描述',
      dataIndex: 'mes',
    },
    {
      title: '建议人',
      dataIndex: 'createUserName',
    },
    {
      title: '第一提案人',
      dataIndex: 'orgName',
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}/1`}>查看</a>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            <DeleteLink target={this} record={record} />
          </span>
        );
      }
    },
  ];

  public remove(id) {
    this.props.dispatch({
      type: 'guangguBase/remove',
      payLoad: id,
      callBack: () => {
        this.table.refresh();
      }
    })
  }

  private table: SearchTableClass;

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/indexManage/opticsvalleyBasePic/getList/${current}/${pageSize}${createSearchString(values)}`;
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
        // selectedAble
        />
      </Card>
    );
  }

}

@connect(({ loading }) => ({
  loading
}))
class SearchForm extends Component<IFormAndDvaInterface, any>  {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
    };
  }

  render() {
    return (
      <div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
        </div>
      </div >
    );
  }
}

export default RoadManagement;