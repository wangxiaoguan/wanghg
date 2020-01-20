import React, { Component } from 'react';
import { Card, Button, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import { getPropsParams, isEqual } from '@/utils/SystemUtil';
import { connect } from 'dva';
import { confirmDelete } from '@/utils/AntdUtil';
import TechnologyTradeProgramaEdit, { TechnologyTradeProgramaEditClass } from './TechnologyTradeProgramaEdit';

const TITLE = '技术贸易措施栏目';

/**
 * 技术贸易措施专题
 */

@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['technologyTradePrograma/remove']),
  }
))
class TechnologyTradeProgramaList extends Component<any, any> {
  private table: SearchTableClass;
  private eidtView: TechnologyTradeProgramaEditClass;
  public state = {
    editRecord: null,
    subjectData: null,
  };

  private COLUMNS: any[] = [
    {
      title: '栏目名称',
      dataIndex: 'scName',
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`#/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaArticleList/${record.id}/${getPropsParams(this.props).subjectId}`}>栏目详情</a>
            <a onClick={() => {
              this.setState({ editRecord: record }, () => this.eidtView.show());
            }}>修改</a>
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
    this.getSujectData();
  }

  componentDidUpdate(prevProps) {
    let prePramas = getPropsParams(prevProps);
    let currentPramas = getPropsParams(this.props);
    if (!isEqual(prePramas, currentPramas)) {
      this.getSujectData();
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
    let subjectId = getPropsParams(this.props).subjectId;    //专题id
    return `/services/wto/content/list/${current}/${pageSize}?Q=subjectId_EQ=${subjectId}`;
  }


  getSujectData() {
    const subjectId = getPropsParams(this.props).subjectId;
    if (subjectId) {
      this.props.dispatch(
        {
          type: 'technologyTrade/search',
          payLoad: subjectId,
          callBack: (res) => {
            this.setState({ subjectData: res.data });
          },
        }
      );
    }
  }


  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    }
  }

  render() {
    const subjectData: any = this.state.subjectData;
    return (
      <Card title={TITLE}>
        {
          subjectData &&
          <div>
            <a href='#/SynthesizeManage/TechnologyTradeList' className='controlsContainer'>
              <span>专题号：{subjectData.subjectNo}</span>
              <span>专题名称：{subjectData.subjectName}</span>
            </a>
          </div>
        }
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
          formItemsProps={{
            subjectid: getPropsParams(this.props).subjectId
          }}
        />
        <TechnologyTradeProgramaEdit
          orgData={this.state.editRecord}
          completeHandler={() => this.table.refresh()}
          subjectid={getPropsParams(this.props).subjectId}
          getInstance={(target) => { this.eidtView = target }} />
      </Card>
    );
  }
}

class SearchForm extends Component<any>  {
  private addView: TechnologyTradeProgramaEditClass;

  render() {
    return (
      <div>
        <div className='divAreaContainer controlsContainer'>
          <a></a>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <Button type="primary" onClick={() => {
            console.log(this.props);
            this.addView.show();
          }}
          >新增</Button>
          <TechnologyTradeProgramaEdit completeHandler={() => this.props.refresh()} subjectid={this.props.subjectid} getInstance={(target) => { this.addView = target }} />
        </div>
      </div>

    );
  }
}

export default TechnologyTradeProgramaList; 