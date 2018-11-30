import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString } from '../../../myFetch';
import { connect } from 'react-redux';
import { Modal,Button} from 'antd';
import { API_PREFIX} from '../../../apiprefix';
import ImportWrapper from '../../../../component/import/import';
@connect(state => ({
  powers: state.powers,
}))
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activityId: GetQueryString(location.hash, ['id']).id || '',
      importModal:false,
    };
  }
  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22003.001'];
    let updatePowers = powers && powers['20002.22003.002'];
    let deletePowers = powers && powers['20002.22003.004'];
    let importPowers = powers && powers['20002.22011.207'];
    // let importPowers = true;
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题目名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '题目类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record, index) => {
          if (record.type === 1) {
            return '单选';
          } else if (record.type === 2) {
            return '多选';
          }else if(record.type===3){
            return '问答';
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return (
            <div>
              <a
                className="operation"
                href={`#/EventManagement/Questionnaire/TopicEdit?isEdit=true&id=${
                  record.id
                }&activityId=${this.state.activityId}`}
                style={{ display: updatePowers ? 'inline-block' : 'none' }}
              >
                编辑
              </a>
            </div>
          );
        },
      },
    ];
    const search = [
      {
        key: 'title',
        label: '题目名称',
        qFilter: 'Q=title_S_LK',
        type: 'input',
      },
      {
        key: 'type',
        label: '题目类型',
        qFilter: 'Q=type_I_EQ',
        type: 'select',
        option: [
          { key: '', value: '全部' },
          { key: 1, value: '单选' },
          { key: 2, value: '多选' },
          { key: 3, value: '问答' },
        ],
      },
    ];
    
    return (
      <div>
        <TableAndSearch
          columns={columns}
          search={search}
          addBtn={createPowers?{
            order: 1,
            url: `/EventManagement/Questionnaire/TopicAdd?isEdit=false&activityId=${
              this.state.activityId
            }`,
          }:null}
          deleteBtn={deletePowers?{ order: 2, url: 'services/activity/topic/deleteTopics' }:null}
          // deleteBtn={ order: 2, url: 'services/activity/topic/deleteTopics' }
          url={'services/activity/topic/list'}
          urlfilter={`Q=activityid_S_EQ=${this.state.activityId}`}
          /* importBtn={importPowers?{
            order: 3,
            url: `services/activity/import/topics?activityId=${
              this.state.activityId
            }`,
            label: '批量导入题目',
          }:null} */
          customBtn={importPowers?{
            order: 3, label: '批量导入题目', onClick: () => {
              this.setState({ importModal: true });
            }, className: 'resetBtn',
          }:null}
        />
        <Modal
          title="批量导入题目"
          visible={this.state.importModal}
          footer={<Button onClick={() => this.setState({ importModal: false })}>返回</Button>}
          onCancel={()=>this.setState({ importModal: false })}
          destroyOnClose={true}
        >
          <ImportWrapper title="导入题目模板" uploadUrl={`services/activity/import/topics?activityId=${this.state.activityId}`} downloadUrl={'services/activity/questionnaireActivity/exportTopicTemplate'} />
        </Modal>
      </div>
    );
  }
}
