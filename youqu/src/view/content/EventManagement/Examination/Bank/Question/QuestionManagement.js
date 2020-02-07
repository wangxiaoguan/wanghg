import React, { Component } from 'react';
import TableAndSearch from '../../../../../component/table/TableAndSearch';
import {  GetQueryString } from '../../../../myFetch';
import { connect } from 'react-redux';
import { Modal, Button} from 'antd';
import { BEGIN } from '../../../../../../redux-root/action';
import ImportWrapper from '../../../../../component/import/import';   
@connect(
  state => ({
    pageData: state.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class QuestionsManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examDbId: GetQueryString(location.hash, ['id']).id || '',
      importModal:false,
    };
  }
  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22002.001'];
    let updatePowers = powers && powers['20002.22002.002'];
    let deletePowers = powers && powers['20002.22002.004'];
    let importPowers = powers && powers['20002.22011.209']; 
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
                href={`#/EventManagement/Examination/EditQuestionsConfiguration?isEdit=true&id=${
                  record.id
                }`}
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
        ],
      },
    ];
    return (
      <div>
        <TableAndSearch
          columns={columns}
          url={'services/activity/examTopic/list'}
          // query={this.state.examDbId}
          //url={'testkao'}
          search={search}
          urlfilter={`Q=examdbid_S_EQ=${this.state.examDbId}`}
          addBtn={createPowers?{
            order: 1,
            url: '/EventManagement/Examination/AddQuestionsConfiguration?examDbId=' + this.state.examDbId,
          }:null}
          deleteBtn={deletePowers ? { order: 2, url:'services/activity/examTopic/deleteTopic' }:null}
          /* importBtn={importPowers?{
            order: 3,
            url: `services/activity/import/activityExamTopics?examDbId=${
              this.state.examDbId
            }`,
            label: '批量导入题目',
          }:null} */
          customBtn={importPowers?{ order: 3, label: '批量导入题目', onClick:()=>{this.setState({importModal:true});
          }, className: 'resetBtn' }:null}
        />
        <Modal
          title="批量导入题目"
          visible={this.state.importModal}
          footer={<Button onClick={() => this.setState({ importModal: false })}>返回</Button>}
          onCancel={()=>this.setState({ importModal: false })}
          destroyOnClose={true}
        >
          <ImportWrapper title="导入题目模板" uploadUrl={`services/activity/import/activityExamTopics?examDbId=${
            this.state.examDbId
          }`} downloadUrl="/services/activity/examTopic/examTopicTemplate" />  
        </Modal>
      </div>
    );
  }
}

