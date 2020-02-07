import React, { Component } from 'react';
import TableAndSearch from '../../../../../component/table/TableAndSearch';
import {  GetQueryString } from '../../../../myFetch';
import { connect } from 'react-redux';
import { Modal, Button} from 'antd';
import { BEGIN } from '../../../../../../redux-root/action/table/table';
// import ImportWrapper from '../../../../../component/import/import';   
import ImportPart1 from '../../../ImportPart1';
import API_PREFIX from '../../../../apiprefix';
@connect(
  state => ({
    pageData: state.table.pageData,
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

  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }
  
  hideModel = () => {
    this.setState({importModal: false});
  }
 
  getSuccessResult=selectedData => {
    this.props.getData(API_PREFIX + `services/web/activity/exam/getTitleListByCond/1/10?Q=dbId=${this.state.examDbId}`);
  }

   // 父组件调用子组件的方法
  onRef = (ref) => {
    this.child = ref
  }

    //确定用户导入
    handleImportModalOk = () => {
      this.child.UploadChange();
      this.setState({
        importModal: false,
      });
    }

  //取消用户导入
  handleImportModalCancel = () => {
    this.setState({
      importModal: false,
    });
  }

  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22002.001'];
    let updatePowers = powers && powers['20002.22002.002'];
    let deletePowers = powers && powers['20002.22002.004'];
    let importPowers = powers && powers['20002.22011.208']; 
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width:50,
      },
      {
        title: '题目名称',
        dataIndex: 'titleName',
        key: 'titleName',
      },
      {
        title: '题目类型',
        dataIndex: 'titleType',
        key: 'titleType',
        width:74,
        render: (text, record, index) => {
          if (record.titleType === 1) {
            return '单选';
          } else if (record.titleType === 2) {
            return '多选';
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width:86,
      },
      {
        title: '操作',
        key: 'x',
        width:60,
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
        key: 'titleName',
        label: '题目名称',
        qFilter: 'Q=titleName',
        type: 'input',
      },
      {
        key: 'titleType',
        label: '题目类型',
        qFilter: 'Q=titleType',
        type: 'select',
        option: [
          { key: '', value: '全部' },
          { key: 1, value: '单选' },
          { key: 2, value: '多选' },
          // { key: 3, value: '问答' },
        ],
      },
    ];
    return (
      <div>
        <TableAndSearch
          columns={columns}
          url={`services/web/activity/exam/getTitleListByCond`}
          urlfilter={`Q=dbId=${this.state.examDbId}`}
          ///query={this.state.examDbId}
          //url={'testkao'}
          search={search}
         ///// urlfilter={`Q=examdbid=${this.state.examDbId}`}
          addBtn={createPowers?{
            order: 1,
            url: '/EventManagement/Examination/AddQuestionsConfiguration?examDbId=' + this.state.examDbId,
          }:null}
          deleteBtn={deletePowers ? { order: 2, url:'services/web/activity/examtitle/batchDeleteTitleInfo' }:null}
          /* importBtn={importPowers?{
            order: 3,
            url: `services/activity/import/activityExamTopics?examDbId=${
              this.state.examDbId
            }`,
            label: '批量导入题目',
          }:null} */
          // customBtn={importPowers?{ order: 3, label: '批量导入题目', onClick:()=>{this.setState({importModal:true});
          customBtn={{ order: 3, label: '批量导入题目', onClick:()=>{this.setState({importModal:true});
          }, className: 'resetBtn' }}
          goBackBtn={{ order: 1, url: '#/EventManagement/Examination/Bank',label:'返回' }}
        />
        <Modal
          title="批量导入题目"
          visible={this.state.importModal}
          cancelText="返回"
          okText="确定"
        //   footer={<Button onClick={() => this.setState({ importModal: false })}>返回</Button>}
          // onCancel={()=>this.setState({ importModal: false })}
          // onOk={()=>this.setState({ importModal: false })}

          onOk={this.handleImportModalOk}
          onCancel={this.handleImportModalCancel}
          destroyOnClose={true}
        >
          {/* <ImportWrapper title="导入题目模板" 
          uploadUrl={`services/activity/import/activityExamTopics?examDbId=${this.state.examDbId}`} 
          downloadUrl={'services/activity/examTopic/examTopicTemplate'} 
          />   */}
          <ImportPart1 
          onRef={this.onRef}
          importUrl={`services/web/activity/examtitle/examDbImportExamTitle?examDbId=${this.state.examDbId}`}
          listurl={`${API_PREFIX}services/web/activity/exam/getTitleListByCond`}
          downlodUrl={API_PREFIX + 'services/web/activity/examtitle/titletemplate'}
          getSuccessResult={this.getSuccessResult}
          hideModel={this.hideModel}
          fileName='导入题目模板'
          />
        </Modal>
      </div>
    );
  }
}

