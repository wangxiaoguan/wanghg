import React, { Component } from 'react';
import { Card, Form, Spin } from 'antd';
import SearchTable, { SearchTableClass } from '@/components/SearchTable';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
import EditButton from '@/components/EditButton';
import TrainingInformationPlayer from './TrainingInformationPlayer';
import HRangePicker from '@/components/Antd/HRangePicker';
import { createSearchString } from '@/utils/SystemUtil';
import { connect } from 'dva';
import { confirmDelete } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';

const TITLE = '培训信息管理';
const FormItem = Form.Item;
const EDIT_HASH = '#/SynthesizeManage/TrainingInformationList/TrainingInformationEdit';
/**
 * 培训信息管理
 */
@connect(({ loading }) => (
  {
    loadingDelete: Boolean(loading.effects['trainingInformation/remove']),
  }
))
class TrainingInformationList extends Component<any, any> {
  private playerModal: TrainingInformationPlayer;
  private table: SearchTableClass;

  private COLUMNS: any[] = [
    {
      title: '培训标题',
      dataIndex: 'trainTitle',
    },
    {
      title: '培训日期',
      dataIndex: 'trainDate',
    },
    {
      title: '操作',
      width: 300,
      render: (_, record) => {
        return (
          <span className='controlsContainer'>
            <a href={`${EDIT_HASH}/${record.id}/1`}>查看活动</a>
            <a href={`${EDIT_HASH}/${record.id}`}>修改</a>
            <Spin spinning={this.props.loadingDelete}>
              <a onClick={() => {
                confirmDelete(() => this.remove(record.id));
              }}>删除</a>
            </Spin>
            <a
              onClick={() => {
                this.setState({ selectedRecord: record }, () => {
                  this.playerModal.show();
                });
              }}
            >
              查看报名人员
            </a>
          </span>
        );
      }
    },
  ];

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  remove = (id) => {
    this.props.dispatch(
      {
        type: 'trainingInformation/remove',
        payLoad: id,
        callBack: () => {
          this.table.refresh();
        }
      }
    );
  }


  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/wto/traininfo/list/${current}/${pageSize}${createSearchString(values)}`;
  }

  transData = (response: any) => {
    return {
      data: response.data.data,
      total: response.data.length,
    };
  }

  render() {
    return (
      <Card title={TITLE}>
        <SearchTable
          getInstance={(target) => this.table = target}
          columns={this.COLUMNS}
          formItems={SearchForm}
          searchCreater={this.searchCreater}
          transData={this.transData}
        />
        <TrainingInformationPlayer
          getInstance={(target) => this.playerModal = target}
          width={800}
          title={this.state.selectedRecord ? this.state.selectedRecord.trainTitle : '报名人员'}
          trainId={this.state.selectedRecord ? this.state.selectedRecord.id : null}
        />
      </Card>
    );
  }
}

class SearchForm extends Component<any>  {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '培训标题',
        content: getFieldDecorator('trainTitle')(<HInput />),
      },
      {
        label: '培训时间',
        content: getFieldDecorator('trainDate')(<HRangePicker />),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem key={item.label} label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
        <div className='divAreaContainer controlsContainer'>
          <EditButton hash={EDIT_HASH} />
        </div>
      </div>
    );
  }
}

export default TrainingInformationList;