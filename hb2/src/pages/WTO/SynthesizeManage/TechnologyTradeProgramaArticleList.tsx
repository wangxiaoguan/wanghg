import React, { Component } from 'react';
import { Card, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { getPropsParams } from '@/utils/SystemUtil';
import { connect } from 'dva';
import { confirmDelete } from '@/utils/AntdUtil';
import EditButton from '@/components/EditButton';
import IDispatchInterface from '@/Interfaces/IDispatchInterface';

const TITLE = '技术贸易栏目文章';
const EDIT_HASH = '#/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaArticleEdit';

/**
 * 技术贸易措施专题
 */

@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['technologyTradePrograma/remove']),
  }
))
class TechnologyTradeProgramaArticleList extends Component<IDispatchInterface, any> {
  private table: SearchTableClass;
  public state = {
    editRecord: null,
    programaData: null,
    subjectData: null,
  };

  private COLUMNS: any[] = [
    {
      title: '文章标题',
      dataIndex: 'scName',
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${getPropsParams(this.props).programaId}/${record.id}`}>修改</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>
          </span>
        );
      }
    },
  ];

  componentDidMount() {
    this.getProgramaData();
    this.getSubjectData();
  }

  getSubjectData() {
    let subjectId = getPropsParams(this.props).subjectId;
    if (subjectId) {
      this.props.dispatch(
        {
          type: 'technologyTrade/search',
          payLoad: subjectId,
          callBack: (res) => {
            this.setState({ subjectData: res.data });
          }
        }
      );
    }
  }

  getProgramaData() {
    let programaId = getPropsParams(this.props).programaId;
    if (programaId) {
      this.props.dispatch(
        {
          type: 'technologyTradePrograma/search',
          payLoad: programaId,
          callBack: (res) => {
            this.setState({ programaData: res.data });
          }
        }
      );
    }
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'technologyTradePrograma/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    let programaId = getPropsParams(this.props).programaId;    //栏目id
    return `/services/wto/content/list/${current}/${pageSize}?Q=scPid_EQ=${programaId}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    }
  }

  render() {
    const { programaData, subjectData } = this.state;

    return (
      <Card title={TITLE}>
        {
          subjectData &&
          programaData &&
          <a className='controlsContainer' href={`#/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaList/${subjectData.id}`}>
            <span>当前号{subjectData.subjectNo}</span>
            <span>当前专题名称：{subjectData.subjectName}</span>
            <span>当年栏目：{programaData.scName}</span>
          </a>
        }
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
          formItemsProps={{
            programaId: getPropsParams(this.props).programaId
          }}
        />
      </Card>
    );
  }
}

class SearchForm extends Component<any>  {
  render() {
    return (
      <div className='divAreaContainer controlsContainer'>
        <EditButton hash={`${EDIT_HASH}/${this.props.programaId}`} />
      </div>
    );
  }
}

export default TechnologyTradeProgramaArticleList; 